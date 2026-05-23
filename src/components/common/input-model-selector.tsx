
"use client";

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronUp, BrainCircuit, Check } from "lucide-react";
import type { AIModel } from "@/lib/types";
import { useModel } from '@/hooks/use-model';
import { aiModels } from './model-selector';
import { cn } from '@/lib/utils';

export function InputModelSelector() {
  const { selectedModel, setSelectedModel } = useModel();
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5 text-xs px-2 py-2.5 h-auto bg-background border rounded-full shadow-sm hover:bg-accent/50 group">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
                <BrainCircuit className="w-4 h-4 text-brand-blue" />
                <span className="font-medium inline">
                    {selectedModel.name}
                </span>
            </div>
            <ChevronUp className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" side="top">
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
                          "text-[12px]",
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
