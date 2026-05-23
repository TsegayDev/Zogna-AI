
"use client";

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, BrainCircuit, Check } from "lucide-react";
import type { AIModel } from "@/lib/types";
import { useModel } from '@/hooks/use-model';
import { cn } from '@/lib/utils';

export const aiModels: AIModel[] = [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google' },
];

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useModel();
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 rounded-full shadow-sm h-auto py-1.5 px-3 group"
        >
            <div className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
                <BrainCircuit className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium text-foreground/90 inline">
                    {selectedModel.name}
                </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        {aiModels.map(model => (
            <DropdownMenuItem 
              key={model.id} 
              onSelect={() => setSelectedModel(model)}
              className={cn(
                "p-2 cursor-pointer",
                 selectedModel.id === model.id && "bg-gradient-to-r from-brand-blue to-brand-purple text-primary-foreground focus:text-primary-foreground"
              )}
            >
                <div className="flex items-center gap-3 w-full">
                    <BrainCircuit className={cn("w-5 h-5", selectedModel.id === model.id ? 'text-primary-foreground' : 'text-muted-foreground')} />
                    <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium">{model.name}</span>
                        <span className={cn(
                          "text-xs",
                          selectedModel.id === model.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}>
                            {model.id} &middot; {model.provider}
                        </span>
                    </div>
                    {selectedModel.id === model.id && <Check className="w-4 h-4 ml-auto" />}
                </div>
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
