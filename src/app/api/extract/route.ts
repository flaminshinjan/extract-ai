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


function sanitizeUrl(url: string): string {
  let sanitizedUrl = url.trim();
  
  if (!sanitizedUrl.startsWith("http://") && !sanitizedUrl.startsWith("https://")) {
    sanitizedUrl = "https://" + sanitizedUrl;
  }
  
  return sanitizedUrl;
}


function truncateHtml(html: string, maxLength: number = 100000): string {
  if (html.length <= maxLength) {
    return html;
  }
  

  const cutPoint = html.lastIndexOf('>', maxLength);
  return cutPoint > 0 ? html.substring(0, cutPoint + 1) : html.substring(0, maxLength);
}

function formatServerError(error: unknown, url?: string): { error: string; status?: number } {

  let errorMessage = "Failed to extract content";
  let status = 500;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    

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


function extractContentFromText(text: string): { title: string; summary: string; keyPoints: string[] } {

  let title = "Extracted Content";
  let summary = "Content extracted from URL";
  let keyPoints: string[] = [];
  

  const titleMatch = text.match(/Title:?\s*(.+?)(?:\n|$)/i) || 
                     text.match(/1\.?\s*(?:Title:?)?\s*(.+?)(?:\n|$)/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }
  

  const summaryMatch = text.match(/Summary:?\s*([\s\S]+?)(?:\n\n|\n\d|\n$)/i) ||
                       text.match(/2\.?\s*(?:Summary:?)?\s*([\s\S]+?)(?:\n\n|\n\d|\n$)/i);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].trim();
  }
  

  const keyPointsSection = text.match(/Key Points:?\s*([\s\S]+?)(?:\n\n|$)/i) ||
                           text.match(/3\.?\s*(?:Key Points:?)?\s*([\s\S]+?)(?:\n\n|$)/i);
  
  if (keyPointsSection && keyPointsSection[1]) {

    const points = keyPointsSection[1].split(/\n\s*[-•*]\s*|\n\s*\d+\.?\s*/)
      .map(point => point.trim())
      .filter(point => point.length > 0);
    
    if (points.length > 0) {
      keyPoints = points;
    }
  }
  
  return { title, summary, keyPoints };
}


async function processWithClaude(htmlContent: string, url: string, model: string = "claude-3-5-sonnet-20240620") {

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


    const response = message.content[0].type === 'text' 
      ? (message.content[0] as { type: 'text', text: string }).text 
      : '';
    
    console.log("Claude response:", response);
    

    try {

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : '';
      
      if (jsonStr) {
        const extractedContent = JSON.parse(jsonStr);
        
        
        if (extractedContent.title && extractedContent.summary && Array.isArray(extractedContent.keyPoints)) {
          return extractedContent;
        }
      }
      
      
      throw new Error("No valid JSON found");
    } catch (parseError) {

      console.log("Parsing as structured text instead of JSON");
      return extractContentFromText(response);
    }
  } catch (error) {
    console.error("Error processing with Claude:", error);
    throw error;
  }
}


async function processWithOpenAI(htmlContent: string, url: string, model: string = "gpt-4o") {

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
    
      const { data: htmlContent } = await axios.get(sanitizedUrl, {
        timeout: 15000, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      
      if (htmlContent.length > 1000000) {
        return NextResponse.json(
          { error: "The webpage content is too large to process. Try a different URL with less content." },
          { status: 400 }
        );
      }

      
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