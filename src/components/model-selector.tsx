"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const handleSelectModel = (model: AIModel) => {
    onModelChange(model);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Select AI Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Anthropic</span>
            </h3>
            <div className="space-y-2">
              {models
                .filter(model => model.provider === "anthropic")
                .map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModelId === model.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleSelectModel(model)}
                  >
                    <div className="flex w-full items-start">
                      <Sparkles className="mr-3 h-4 w-4 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{model.description}</div>
                      </div>
                      {selectedModelId === model.id && (
                        <Check className="h-4 w-4 ml-2 shrink-0" />
                      )}
                    </div>
                  </Button>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Brain className="h-4 w-4 text-green-500" />
              <span>OpenAI</span>
            </h3>
            <div className="space-y-2">
              {models
                .filter(model => model.provider === "openai")
                .map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModelId === model.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleSelectModel(model)}
                  >
                    <div className="flex w-full items-start">
                      <Brain className="mr-3 h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{model.description}</div>
                      </div>
                      {selectedModelId === model.id && (
                        <Check className="h-4 w-4 ml-2 shrink-0" />
                      )}
                    </div>
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 