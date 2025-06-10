"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type AIModel = {
  id: string;
  name: string;
  provider: "anthropic" | "openai";
  description: string;
};

const models: AIModel[] = [
  {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    description: "Balanced model for various tasks from Anthropic",
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most powerful Claude model for complex tasks",
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    description: "Fast, efficient model for simpler tasks",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's most capable model for complex tasks",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Efficient OpenAI model for general tasks",
  },
];

interface ModelSelectorProps {
  onModelChange: (model: AIModel) => void;
  selectedModelId: string;
}

export function ModelSelector({ onModelChange, selectedModelId }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  
  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedModel.provider === "anthropic" ? (
              <Sparkles className="h-4 w-4 text-purple-500" />
            ) : (
              <Brain className="h-4 w-4 text-green-500" />
            )}
            <span>{selectedModel.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            <div className="font-medium text-xs text-muted-foreground px-2 py-1 border-b">
              Anthropic
            </div>
            {models
              .filter(model => model.provider === "anthropic")
              .map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelChange(model);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>{model.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedModelId === model.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{model.description}</p>
                  </div>
                </CommandItem>
              ))}
            <div className="font-medium text-xs text-muted-foreground px-2 py-1 border-b mt-2">
              OpenAI
            </div>
            {models
              .filter(model => model.provider === "openai")
              .map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelChange(model);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span>{model.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedModelId === model.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{model.description}</p>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 