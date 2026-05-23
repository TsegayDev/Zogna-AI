'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: (inputValue?: string) => void;
  isRename?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialInputValue?: string;
}

export function ConfirmationDialog({
  children,
  title,
  description,
  onConfirm,
  isRename = false,
  isOpen,
  onOpenChange,
  initialInputValue = '',
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = React.useState(initialInputValue);

  React.useEffect(() => {
    if (isRename && isOpen) {
      setInputValue(initialInputValue);
    }
  }, [isOpen, isRename, initialInputValue]);
  
  const handleConfirm = () => {
    onConfirm(isRename ? inputValue : undefined);
    onOpenChange?.(false);
    if(isRename) setInputValue('');
  };

  const handleCancel = () => {
    if (isRename) setInputValue('');
    onOpenChange?.(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {isRename && (
            <div className="grid gap-2 py-4">
                <Label htmlFor="name" className="text-left">
                    New Name
                </Label>
                <Input
                    id="name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter new name"
                />
            </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isRename && !inputValue.trim()}>
            {isRename ? 'Rename' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
