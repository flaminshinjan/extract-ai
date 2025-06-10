import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import OpenAI from "openai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to sanitize URLs
function sanitizeUrl(url: string): string {
  let sanitizedUrl = url.trim();
  
  // Ensure URL has a protocol
  if (!sanitizedUrl.startsWith("http://") && !sanitizedUrl.startsWith("https://")) {
    sanitizedUrl = "https://" + sanitizedUrl;
  }
  
  return sanitizedUrl;
}

// Function to truncate HTML content to avoid token limits
function truncateHtml(html: string, maxLength: number = 100000): string {
  if (html.length <= maxLength) {
    return html;
  }
  
  // Find a reasonable place to cut (end of a tag)
  const cutPoint = html.lastIndexOf('>', maxLength);
  return cutPoint > 0 ? html.substring(0, cutPoint + 1) : html.substring(0, maxLength);
}

// Server-side error formatting
function formatServerError(error: unknown, url?: string): { error: string; status?: number } {
  // Default error message
  let errorMessage = "Failed to extract content";
  let status = 500;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Check for specific error patterns
    if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ETIMEDOUT")) {
      errorMessage = `Could not connect to ${url || 'the URL'}. Please check that the URL is correct and accessible.`;
      status = 400;
    } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      errorMessage = `Resource not found: ${errorMessage}`;
      status = 404;
    } else if (errorMessage.includes("403") || errorMessage.includes("forbidden")) {
      errorMessage = `Access forbidden: ${errorMessage}`;
      status = 403;
    } else if (errorMessage.includes("parse") || errorMessage.includes("JSON")) {
      errorMessage = "Failed to parse content from the webpage";
    } else if (errorMessage.includes("prompt is too long") || errorMessage.includes("tokens")) {
      errorMessage = "The webpage content is too large to process. Try a different URL with less content.";
      status = 400;
    }
  }
  
  return { error: errorMessage, status };
}

// Function to extract content from unstructured Claude response
function extractContentFromText(text: string): { title: string; summary: string; keyPoints: string[] } {
  // Defaults
  let title = "Extracted Content";
  let summary = "Content extracted from URL";
  let keyPoints: string[] = [];
  
  // Extract title
  const titleMatch = text.match(/Title:?\s*(.+?)(?:\n|$)/i) || 
                     text.match(/1\.?\s*(?:Title:?)?\s*(.+?)(?:\n|$)/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }
  
  // Extract summary - use multi-line approach instead of /s flag
  const summaryMatch = text.match(/Summary:?\s*([\s\S]+?)(?:\n\n|\n\d|\n$)/i) ||
                       text.match(/2\.?\s*(?:Summary:?)?\s*([\s\S]+?)(?:\n\n|\n\d|\n$)/i);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].trim();
  }
  
  // Extract key points
  const keyPointsSection = text.match(/Key Points:?\s*([\s\S]+?)(?:\n\n|$)/i) ||
                           text.match(/3\.?\s*(?:Key Points:?)?\s*([\s\S]+?)(?:\n\n|$)/i);
  
  if (keyPointsSection && keyPointsSection[1]) {
    // Extract points with bullet points or numbered format
    const points = keyPointsSection[1].split(/\n\s*[-•*]\s*|\n\s*\d+\.?\s*/)
      .map(point => point.trim())
      .filter(point => point.length > 0);
    
    if (points.length > 0) {
      keyPoints = points;
    }
  }
  
  return { title, summary, keyPoints };
}

// Process content with Claude API
async function processWithClaude(htmlContent: string, url: string, model: string = "claude-3-5-sonnet-20240620") {
  // Truncate HTML to avoid token limits
  const truncatedHtml = truncateHtml(htmlContent, 80000);
  
  try {
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a content extraction and summarization assistant. Given the HTML content from a web page, extract the main content, ignoring navigation, ads, footers, etc.
          
          Then generate:
          1. A title for the content
          2. A concise summary (2-3 sentences)
          3. 3-5 key points from the content
          
          Format your response as follows:
          
          Title: [title]
          
          Summary: [summary]
          
          Key Points:
          - [key point 1]
          - [key point 2]
          - [key point 3]
          
          Here's the HTML content from ${url} (note that it may be truncated):
          
          ${truncatedHtml}`,
        },
      ],
      temperature: 0.5,
    });

    // Safely extract the text content
    const response = message.content[0].type === 'text' 
      ? (message.content[0] as { type: 'text', text: string }).text 
      : '';
    
    console.log("Claude response:", response);
    
    // First try to parse as JSON if it happens to be in JSON format
    try {
      // Try to find JSON within the response if it exists
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : '';
      
      if (jsonStr) {
        const extractedContent = JSON.parse(jsonStr);
        
        // Validate the expected format
        if (extractedContent.title && extractedContent.summary && Array.isArray(extractedContent.keyPoints)) {
          return extractedContent;
        }
      }
      
      // If we get here, either no JSON was found or it didn't have the expected format
      throw new Error("No valid JSON found");
    } catch (parseError) {
      // Extract content from text format instead
      console.log("Parsing as structured text instead of JSON");
      return extractContentFromText(response);
    }
  } catch (error) {
    console.error("Error processing with Claude:", error);
    throw error;
  }
}

// Process content with OpenAI API
async function processWithOpenAI(htmlContent: string, url: string, model: string = "gpt-4o") {
  // Truncate HTML to avoid token limits
  const truncatedHtml = truncateHtml(htmlContent, 60000);
  
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a content extraction and summarization assistant. Extract the main content from HTML, ignoring navigation, ads, and other non-core elements."
        },
        {
          role: "user",
          content: `Given the HTML content from a web page, extract the main content and generate:
          1. A title for the content
          2. A concise summary (2-3 sentences)
          3. 3-5 key points from the content
          
          Format your response as follows:
          
          Title: [title]
          
          Summary: [summary]
          
          Key Points:
          - [key point 1]
          - [key point 2]
          - [key point 3]
          
          Here's the HTML content from ${url} (note that it may be truncated):
          
          ${truncatedHtml}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = response.choices[0]?.message?.content || '';
    console.log("OpenAI response:", responseText);
    
    return extractContentFromText(responseText);
  } catch (error) {
    console.error("Error processing with OpenAI:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { url, model = "claude-3-5-sonnet-20240620", provider = "anthropic" } = requestData;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const sanitizedUrl = sanitizeUrl(url);

    try {
      // Fetch the content from the URL with a timeout
      const { data: htmlContent } = await axios.get(sanitizedUrl, {
        timeout: 15000, // 15 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      // Check if HTML content is too large
      if (htmlContent.length > 1000000) {
        return NextResponse.json(
          { error: "The webpage content is too large to process. Try a different URL with less content." },
          { status: 400 }
        );
      }

      // Process with the selected AI provider
      let extractedContent;
      
      if (provider === "anthropic") {
        extractedContent = await processWithClaude(htmlContent, sanitizedUrl, model);
      } else {
        extractedContent = await processWithOpenAI(htmlContent, sanitizedUrl, model);
      }

      return NextResponse.json({
        url: sanitizedUrl,
        ...extractedContent,
        extractedAt: new Date(),
        id: crypto.randomUUID(),
        model: model,
        provider: provider
      });
    } catch (fetchError) {
      console.error("Error fetching or processing URL:", fetchError);
      
      const errorDetails = formatServerError(fetchError, sanitizedUrl);
      return NextResponse.json(
        { error: errorDetails.error },
        { status: errorDetails.status || 500 }
      );
    }
  } catch (error) {
    console.error("Error extracting content:", error);
    const errorDetails = formatServerError(error);
    return NextResponse.json(
      { error: errorDetails.error },
      { status: errorDetails.status || 500 }
    );
  }
} 