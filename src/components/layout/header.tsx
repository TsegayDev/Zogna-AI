
'use client';

import * as React from 'react';
import {
  Menu,
  MoreVertical,
  Edit,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/use-chat';
import { ConfirmationDialog } from '../common/confirmation-dialog';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModelSelector } from '../common/model-selector';
import { useAppSidebar } from '@/context/sidebar-provider';
import { UserNav } from '../common/user-nav';
import type { AppUser } from '@/lib/types';
import { AiSettingsSheet } from '../common/ai-settings-sheet';

export default function Header() {
  const { 
    activeChatId, 
    getChatById, 
    deleteChat, 
    renameChat, 
    createNewChat 
  } = useChat();
  const activeChat = getChatById(activeChatId);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const { isOpen, toggle } = useAppSidebar();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleDelete = () => {
    if (activeChatId) {
      deleteChat(activeChatId);
      toast.success('Chat Deleted');
      setIsDeleteOpen(false);
    }
  };
  
  const handleRename = (newName?: string) => {
    if (activeChatId && newName && newName.trim() !== '') {
      renameChat(activeChatId, newName);
      toast.success('Chat Renamed');
      setIsRenameOpen(false);
    }
  };

  const mockUser: AppUser = {
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    photoURL: 'https://placehold.co/100x100.png',
    plan: 'Premium',
    tokens: 750,
  }
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-2 sm:px-4 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={toggle}>
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <AiSettingsSheet isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <Button onClick={() => setIsSettingsOpen(true)} size="icon" variant="outline" className="rounded-full">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </AiSettingsSheet>
        
        <Button onClick={createNewChat} size="icon" variant="outline" className="rounded-full">
            <Edit className="h-4 w-4" />
        </Button>

        <UserNav user={mockUser} onSignOut={() => alert('Signing out...')} triggerVariant="avatar" />
      </div>
    </header>
  );
}
