"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  Paperclip,
  ChevronDown,
} from "lucide-react";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;

      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface AIChatProps {
  onSubmit: (prompt: string, template: string) => void;
  isLoading?: boolean;
}

const templates = [
  { id: "startup-workforce", label: "Startup Workforce" },
];

export function AIChat({ onSubmit, isLoading = false }: AIChatProps) {
  const [value, setValue] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim(), selectedTemplate.id);
      setValue("");
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-3">
          What can I help you build?
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Describe your task and let the workforce handle the rest
        </p>
      </div>

      <div className="relative">
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="p-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe your task... e.g., 'Analyze whether we should launch a SaaS for developers in 2026'"
              className={cn(
                "w-full px-4 py-3",
                "resize-none",
                "bg-transparent",
                "border-none",
                "text-foreground text-sm font-light",
                "focus:outline-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground placeholder:text-sm placeholder:font-light",
                "min-h-[60px]"
              )}
              style={{
                overflow: "hidden",
              }}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between p-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="group p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-1"
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground hidden group-hover:inline transition-opacity">
                  Attach
                </span>
              </button>

              {/* Template Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground transition-colors border border-border hover:border-muted-foreground/50 hover:bg-secondary"
                >
                  <span>{selectedTemplate.label}</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 transition-transform",
                    isDropdownOpen && "rotate-180"
                  )} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-10">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs transition-colors hover:bg-secondary",
                          selectedTemplate.id === template.id && "text-foreground bg-secondary/50"
                        )}
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
              className={cn(
                "p-2 rounded-lg text-sm transition-all",
                value.trim() && !isLoading
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUpIcon className="w-4 h-4" />
              )}
              <span className="sr-only">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
