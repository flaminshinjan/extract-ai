"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Globe } from "lucide-react";

const urlFormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch (error) {
          return false;
        }
      },
      { message: "Please enter a valid URL including http:// or https://" }
    ),
});

type UrlFormValues = z.infer<typeof urlFormSchema>;

interface UrlInputFormProps {
  onUrlSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function UrlInputForm({ onUrlSubmit, isLoading }: UrlInputFormProps) {
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load stored URLs after component mounts
  useEffect(() => {
    const storedUrls = localStorage.getItem("extract-ai-recent-urls");
    setRecentUrls(storedUrls ? JSON.parse(storedUrls) : []);
    setMounted(true);
  }, []);

  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = async (values: UrlFormValues) => {
    try {
      // Ensure URL has protocol
      let url = values.url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
        form.setValue("url", url);
      }

      // Save to recent URLs
      if (!recentUrls.includes(url)) {
        const updatedUrls = [url, ...recentUrls].slice(0, 5);
        setRecentUrls(updatedUrls);
        localStorage.setItem("extract-ai-recent-urls", JSON.stringify(updatedUrls));
      }

      await onUrlSubmit(url);
    } catch (error) {
      toast.error("Failed to process URL");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter a URL (e.g., example.com/article)"
                    {...field}
                    disabled={isLoading}
                    className="pl-8"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter any public webpage URL to extract its content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {mounted && recentUrls.length > 0 && (
          <div className="text-xs">
            <p className="mb-1 text-muted-foreground">Recent URLs:</p>
            <div className="flex flex-wrap gap-2">
              {recentUrls.map((url, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  disabled={isLoading}
                  onClick={() => {
                    form.setValue("url", url);
                    form.trigger("url");
                  }}
                >
                  {new URL(url).hostname}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Extracting content..." : "Extract Content"}
        </Button>
      </form>
    </Form>
  );
} 