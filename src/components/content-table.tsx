"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Search, Trash2, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export interface ContentItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  keyPoints: string[];
  extractedAt: Date;
  model?: string;
  provider?: string;
}

interface ContentTableProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
}

export function ContentTable({ items, onDeleteItem }: ContentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.url.toLowerCase().includes(searchLower) ||
      item.summary.toLowerCase().includes(searchLower) ||
      item.keyPoints.some((point) => point.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, URL, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">No content found</p>
          {searchTerm && (
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search term
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex justify-between items-center border-b p-4">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-[250px]">{item.url}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.extractedAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Summary</h4>
                    <p className="text-sm">{item.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Points</h4>
                    <ul className="ml-5 list-disc space-y-1">
                      {item.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 