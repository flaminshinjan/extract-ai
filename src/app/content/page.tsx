"use client";

import { useEffect, useState, useCallback } from "react";
import { ContentItem } from "@/components/content-table";
import { columns } from "@/components/content-columns";
import { DataTable } from "@/components/ui/data-table";
import { getStoredContent, deleteContent, storeContent } from "@/lib/content-service";
import { ThemeToggler } from "@/components/theme-toggler";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { UrlInputForm } from "@/components/url-input-form";
import { ModelSelector, AIModel } from "@/components/model-selector";
import { ContentChat } from "@/components/content-chat";
import { NotionTable } from "@/components/notion-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Table2, List } from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";

export default function ContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel>({
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    description: "Balanced model for various tasks from Anthropic",
  });

  // Load stored content on initial render
  useEffect(() => {
    setContentItems(getStoredContent());
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    deleteContent(id);
    setContentItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Content deleted");
  }, []);

  // Listen for delete events from the data table
  useEffect(() => {
    const handleDeleteContent = (event: CustomEvent<string>) => {
      handleDeleteItem(event.detail);
    };

    window.addEventListener('delete-content', handleDeleteContent as EventListener);
    
    return () => {
      window.removeEventListener('delete-content', handleDeleteContent as EventListener);
    };
  }, [handleDeleteItem]);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);

    try {
      toast.info("Extracting content from URL...", { duration: 10000, id: "extract-toast" });
      
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          url,
          model: selectedModel.id,
          provider: selectedModel.provider 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract content");
      }

      // Store the content
      storeContent(data);
      setContentItems((items) => [data, ...items.filter(item => item.id !== data.id)]);
      toast.success("Content extracted successfully", { id: "extract-toast" });
    } catch (error) {
      console.error("Error extracting content:", error);
      
      let errorMessage = "Failed to extract content";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: "extract-toast" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    toast.info(`Model changed to ${model.name}`);
  };

  return (
    <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-full">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Extract AI</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Extract and summarize content from any URL using AI
          </p>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <ThemeToggler />
          <UserDropdown />
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(250px,_1fr)_minmax(0,_3fr)]">
        <div className="space-y-6">
          <div className="rounded-lg border p-3 sm:p-4">
            <h2 className="text-lg font-medium mb-3 sm:mb-4">Extract Content</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">AI Model</label>
                <ModelSelector 
                  onModelChange={handleModelChange} 
                  selectedModelId={selectedModel.id} 
                />
              </div>
              <UrlInputForm onUrlSubmit={handleUrlSubmit} isLoading={isLoading} />
            </div>
          </div>
          
          <div className="rounded-lg border p-3 sm:p-4">
            <h2 className="text-lg font-medium mb-2">About</h2>
            <p className="text-sm text-muted-foreground">
              Extract AI uses advanced AI models to analyze web content and extract the most important information.
              Simply enter a URL to get started.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Current model: <span className="font-medium">{selectedModel.name}</span>
            </p>
          </div>
        </div>
        
        <div className="w-full min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-medium">Your Content</h2>
            <Tabs defaultValue="notion" className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="notion">
                  <List className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Notion View</span>
                  <span className="sm:hidden">Notion</span>
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Chat View</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Table2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Table View</span>
                  <span className="sm:hidden">Table</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs defaultValue="notion" className="w-full">
            <TabsContent value="notion" className="mt-0">
              <NotionTable
                items={contentItems}
                onDeleteItem={handleDeleteItem}
              />
            </TabsContent>
            <TabsContent value="chat" className="mt-0">
              <ContentChat
                items={contentItems}
                onDeleteItem={handleDeleteItem}
              />
            </TabsContent>
            <TabsContent value="table" className="mt-0">
              <DataTable 
                columns={columns} 
                data={contentItems} 
                searchColumn="title"
                searchPlaceholder="Search by title..."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
} 