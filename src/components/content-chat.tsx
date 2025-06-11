"use client";

import { ContentItem } from "./content-table";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Trash2, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ContentChatProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
}

export function ContentChat({ items, onDeleteItem }: ContentChatProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No content found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-lg border p-3 sm:p-6 shadow-sm overflow-hidden"
        >
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold break-words">{item.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:underline flex items-center gap-1 break-all"
                >
                  <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">{item.url}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
                {item.provider && item.model && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    {item.provider === "anthropic" ? (
                      <Sparkles className="h-3 w-3 text-purple-500" />
                    ) : (
                      <Brain className="h-3 w-3 text-green-500" />
                    )}
                    {item.model.split("-")[0] === "claude" 
                      ? `Claude ${item.model.split("-")[2]?.charAt(0).toUpperCase() + item.model.split("-")[2]?.slice(1)}`
                      : item.model
                    }
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-0 flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(item.extractedAt, { addSuffix: true })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteItem(item.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Summary</h3>
            <p className="text-sm break-words">{item.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 sm:mb-3 text-muted-foreground">Key Points</h3>
            <div className="space-y-2 sm:space-y-3">
              {item.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="chat-message-container flex"
                >
                  <div className={cn(
                    "chat-bubble px-3 sm:px-4 py-2 sm:py-3 rounded-lg break-words",
                    index % 2 === 0
                      ? "bg-muted text-foreground ml-auto max-w-[90%] sm:max-w-[85%] rounded-tr-none"
                      : "bg-primary text-primary-foreground mr-auto max-w-[90%] sm:max-w-[85%] rounded-tl-none"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 