"use client";

import { ContentItem } from "@/components/content-table";

const STORAGE_KEY = "extract-ai-content";

export function getStoredContent(): ContentItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) return [];
    
    // Fix dates that were stringified in JSON
    return parsedData.map(item => ({
      ...item,
      extractedAt: new Date(item.extractedAt)
    }));
  } catch (error) {
    console.error("Error getting stored content:", error);
    return [];
  }
}

export function storeContent(item: ContentItem): void {
  if (typeof window === "undefined") return;

  try {
    // Get existing content
    const existingContent = getStoredContent();
    
    // Remove any existing item with the same ID
    const filteredContent = existingContent.filter(existing => existing.id !== item.id);
    
    // Add the new item to the beginning
    const updatedContent = [item, ...filteredContent];
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
  } catch (error) {
    console.error("Error storing content:", error);
  }
}

export function deleteContent(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const existingContent = getStoredContent();
    const updatedContent = existingContent.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
  } catch (error) {
    console.error("Error deleting content:", error);
  }
}

export function clearAllContent(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear content:", error);
  }
} 