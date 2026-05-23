
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useAiSettings } from '@/hooks/use-ai-settings';
import { cn } from '@/lib/utils';

interface AiSettingsSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AiSettingsSheet({ children, isOpen, onOpenChange }: AiSettingsSheetProps) {
  const {
    isStreamingEnabled,
    setIsStreamingEnabled,
    showTokens,
    setShowTokens,
    isThinkingEnabled,
    setIsThinkingEnabled,
    thinkingBudget,
    setThinkingBudget,
    temperature,
    setTemperature,
  } = useAiSettings();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="max-h-[80vh] overflow-y-auto max-w-2xl mx-auto mb-4 border rounded-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>AI Settings</SheetTitle>
          <SheetDescription>
            Control the overall behavior of the AI assistant.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="streaming-mode" className="flex flex-col gap-1">
              <span>Streaming Mode</span>
              <span className="text-xs font-normal text-muted-foreground">
                Receive responses as they are generated.
              </span>
            </Label>
            <Switch
              id="streaming-mode"
              checked={isStreamingEnabled}
              onCheckedChange={setIsStreamingEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="token-count" className="flex flex-col gap-1">
              <span>Show Token Count</span>
              <span className="text-xs font-normal text-muted-foreground">
                Display token usage for each message.
              </span>
            </Label>
            <Switch
              id="token-count"
              checked={showTokens}
              onCheckedChange={setShowTokens}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="thinking-mode" className="flex flex-col gap-1">
                <span>Thinking Mode</span>
                <span className="text-xs font-normal text-muted-foreground">
                    Allow the AI to perform deeper analysis.
                </span>
            </Label>
            <Switch
                id="thinking-mode"
                checked={isThinkingEnabled}
                onCheckedChange={setIsThinkingEnabled}
            />
          </div>
          <div className={cn("grid gap-2", !isThinkingEnabled && "opacity-50 cursor-not-allowed")}>
            <Label htmlFor="thinking-budget">
              Thinking Budget ({thinkingBudget})
            </Label>
            <Slider
              id="thinking-budget"
              min={100}
              max={10000}
              step={100}
              value={[thinkingBudget]}
              onValueChange={(value) => setThinkingBudget(value[0])}
              disabled={!isThinkingEnabled}
            />
            <p className="text-xs text-muted-foreground">
              Set a budget for how much "thinking" the AI can do. Higher values may lead to more detailed responses.
            </p>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="temperature">
              Temperature ({temperature.toFixed(1)})
            </Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness. Lower values are more deterministic, higher values are more creative.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
