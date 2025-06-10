"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContentItem } from "./content-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const columns: ColumnDef<ContentItem>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const url = row.original.url;
      
      return (
        <div className="font-medium">
          <div className="truncate max-w-[200px]">{title}</div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mt-1"
          >
            <span className="truncate max-w-[180px]">{url}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => {
      const summary = row.getValue("summary") as string;
      
      return (
        <div className="truncate max-w-[300px]">
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="cursor-help">{summary}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">{summary}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "keyPoints",
    header: "Key Points",
    cell: ({ row }) => {
      const keyPoints = row.original.keyPoints;
      const displayPoints = keyPoints.slice(0, 1);
      const remainingCount = keyPoints.length - 1;
      
      return (
        <div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-help">
                <div className="truncate max-w-[200px]">{displayPoints[0]}</div>
                {remainingCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{remainingCount} more
                  </span>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <ul className="space-y-1 list-disc pl-5">
                {keyPoints.map((point, i) => (
                  <li key={i} className="text-sm">{point}</li>
                ))}
              </ul>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "extractedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Extracted At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.extractedAt;
      
      return (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // Will be implemented in content-page.tsx
            const event = new CustomEvent('delete-content', { detail: item.id });
            window.dispatchEvent(event);
          }}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];