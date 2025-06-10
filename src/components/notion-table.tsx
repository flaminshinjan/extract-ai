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
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NotionTableProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
}

interface ColumnWidth {
  [key: string]: number;
}

const defaultColumnWidths = {
  title: 33,
  keyPoints: 33,
  summary: 28,
  actions: 6
};

export function NotionTable({ items, onDeleteItem }: NotionTableProps) {
  const [sortField, setSortField] = useState<keyof ContentItem>("extractedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resizing, setResizing] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<ColumnWidth>(defaultColumnWidths);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  const itemsPerPage = 5;

  // Column resizing handlers
  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(columnId);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnId]);
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return;
    
    const tableWidth = tableRef.current?.clientWidth || 1000;
    const diff = e.clientX - startX;
    const percentageDiff = (diff / tableWidth) * 100;
    
    // Calculate new width but set minimum width constraints
    const minWidth = 10; // Minimum percentage width
    const newWidth = Math.max(minWidth, startWidth + percentageDiff);
    
    setColumnWidths(prev => {
      // Create a copy of previous widths
      const newWidths = { ...prev };
      
      // Calculate how much we're changing the width by
      const delta = newWidth - prev[resizing];
      
      // If we're making a column wider, take space from the next column
      // If we're making a column narrower, give space to the next column
      const columnsArray = Object.keys(prev);
      const currentIndex = columnsArray.indexOf(resizing);
      const nextColumn = columnsArray[currentIndex + 1];
      
      // Update the current column width
      newWidths[resizing] = newWidth;
      
      // Only adjust the next column if it exists and would stay above min width
      if (nextColumn && prev[nextColumn] - delta >= minWidth) {
        newWidths[nextColumn] = prev[nextColumn] - delta;
      } else if (nextColumn) {
        // If next column would be too small, adjust current column instead
        const availableDelta = prev[nextColumn] - minWidth;
        newWidths[resizing] = prev[resizing] + availableDelta;
        newWidths[nextColumn] = minWidth;
      }
      
      return newWidths;
    });
  };

  const handleResizeEnd = () => {
    setResizing(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizing]);

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

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const columnStyle = (columnId: string) => ({
    width: `${columnWidths[columnId]}%`,
    position: 'relative' as const
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
      
      <div className="rounded-md border overflow-hidden relative">
        <table ref={tableRef} className="w-full text-sm">
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
                    <div className="font-medium">{item.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 w-fit"
                      >
                        <span className="truncate max-w-[200px]">{item.url}</span>
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
                        <p className="text-xs">{point}</p>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={columnStyle('summary')} className="py-3 px-4 align-top">
                  <p className="text-xs">{item.summary}</p>
                </td>
                <td style={columnStyle('actions')} className="py-3 px-4 text-center align-top">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Resizable column dividers that span the entire table height */}
        <div 
          className={cn(
            "absolute top-0 w-2 h-full cursor-col-resize z-10 group",
            resizing === 'title' ? "bg-primary/10" : "hover:bg-primary/5"
          )}
          style={{ left: `calc(${columnWidths.title}% - 1px)` }}
          onMouseDown={(e) => handleResizeStart(e, 'title')}
        >
          <div className="absolute right-0.5 top-0 h-full w-0.5 bg-border group-hover:bg-primary/50" />
        </div>
        
        <div 
          className={cn(
            "absolute top-0 w-2 h-full cursor-col-resize z-10 group",
            resizing === 'keyPoints' ? "bg-primary/10" : "hover:bg-primary/5"
          )}
          style={{ left: `calc(${columnWidths.title + columnWidths.keyPoints}% - 1px)` }}
          onMouseDown={(e) => handleResizeStart(e, 'keyPoints')}
        >
          <div className="absolute right-0.5 top-0 h-full w-0.5 bg-border group-hover:bg-primary/50" />
        </div>
        
        <div 
          className={cn(
            "absolute top-0 w-2 h-full cursor-col-resize z-10 group",
            resizing === 'summary' ? "bg-primary/10" : "hover:bg-primary/5"
          )}
          style={{ left: `calc(${columnWidths.title + columnWidths.keyPoints + columnWidths.summary}% - 1px)` }}
          onMouseDown={(e) => handleResizeStart(e, 'summary')}
        >
          <div className="absolute right-0.5 top-0 h-full w-0.5 bg-border group-hover:bg-primary/50" />
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
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
              // Show limited page numbers with ellipsis
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
              // Show ellipsis for skipped pages
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