"use client";

import { ContentItem } from "./content-table";
import { formatDistanceToNow } from "date-fns";
import { 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";

interface NotionTableProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
}

interface ColumnWidth {
  [key: string]: number;
}

const defaultColumnWidths = {
  title: 20,
  keyPoints: 35,
  summary: 35,
  actions: 10
};

export function NotionTable({ items, onDeleteItem }: NotionTableProps) {
  const [sortField, setSortField] = useState<keyof ContentItem>("extractedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths] = useState<ColumnWidth>(defaultColumnWidths);
  const tableRef = useRef<HTMLTableElement>(null);
  const itemsPerPage = 5;

  const handleSort = (field: keyof ContentItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredItems = [...filteredItems]
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === "asc" 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      }
      
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });

  
  const totalPages = Math.ceil(sortedAndFilteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const columnStyle = (columnId: string) => ({
    width: `${columnWidths[columnId]}%`,
  });
  
  if (items.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No content found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border overflow-x-auto relative">
        <table ref={tableRef} className="w-full text-sm table-fixed">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th style={columnStyle('title')} className="py-3 px-4 text-left font-medium">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className="h-8 px-2 -ml-2 font-medium"
                    onClick={() => handleSort("title")}
                  >
                    Title
                    <ArrowUpDown className={cn(
                      "ml-1 h-4 w-4", 
                      sortField === "title" ? "opacity-100" : "opacity-40"
                    )} />
                  </Button>
                </div>
              </th>
              <th style={columnStyle('keyPoints')} className="py-3 px-4 text-left font-medium">
                <div className="flex items-center">
                  Key Points
                </div>
              </th>
              <th style={columnStyle('summary')} className="py-3 px-4 text-left font-medium">
                <div className="flex items-center">
                  Summary
                </div>
              </th>
              <th style={columnStyle('actions')} className="py-3 px-4 text-center font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/30">
                <td style={columnStyle('title')} className="py-3 px-4 align-top">
                  <div className="flex flex-col">
                    <div className="font-medium break-words">{item.title}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 w-fit"
                      >
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{item.url}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                      
                      <div className="flex items-center gap-1">
                        {item.provider === "anthropic" ? (
                          <Sparkles className="h-3 w-3 text-purple-500" />
                        ) : (
                          <Brain className="h-3 w-3 text-green-500" />
                        )}
                        <span>
                          {item.model?.split("-")[0] === "claude" 
                            ? `Claude ${item.model.split("-")[2]?.charAt(0).toUpperCase() + item.model.split("-")[2]?.slice(1)}`
                            : item.model
                          }
                        </span>
                      </div>
                      
                      <span>{formatDistanceToNow(item.extractedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </td>
                <td style={columnStyle('keyPoints')} className="py-3 px-4 align-top">
                  <div className="space-y-2">
                    {item.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs break-words">{point}</p>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={columnStyle('summary')} className="py-3 px-4 align-top">
                  <p className="text-xs break-words">{item.summary}</p>
                </td>
                <td style={columnStyle('actions')} className="py-3 px-4 text-center align-top min-w-[60px]">
                  <div className="flex justify-center">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedAndFilteredItems.length)} of {sortedAndFilteredItems.length} items
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              }
              
              if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <Button
                    key={`ellipsis-${pageNumber}`}
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 w-8 p-0"
                  >
                    ...
                  </Button>
                );
              }
              return null;
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 