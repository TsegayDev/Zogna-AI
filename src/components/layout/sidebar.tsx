'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/icons';
import { Trash2, History, X, Search, TriangleAlert, Copy, MessageSquare, Edit } from 'lucide-react';
import type { Chat, AppUser } from '@/lib/types';
import { ThemeToggle } from '@/components/common/theme-toggle';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import { useChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/common/user-nav';
import { useAppSidebar } from '@/context/sidebar-provider';
import { SidebarPrimitive, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { ConfirmationDialog } from '../common/confirmation-dialog';

const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (diffInSeconds < 60) return 'now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
}

export default function Sidebar() {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    deleteChat,
    deleteAllChats,
    createNewChat,
    renameChat,
  } = useChat();
  const { isMobile, toggle, isOpen, setIsOpen } = useAppSidebar();
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [itemToRename, setItemToRename] = React.useState<{id: string, title: string} | null>(null);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [isClearAllOpen, setIsClearAllOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  
  const filteredHistory = React.useMemo(() => {
    const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!searchQuery) return sortedChats;
    return sortedChats.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [chats, searchQuery]);
  
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);
  
  const handleToggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };
  
  const handleDelete = () => {
    if (itemToDelete) {
      deleteChat(itemToDelete);
      setItemToDelete(null);
      toast.success('Chat deleted');
    }
  };
  
  const handleRename = (newName?: string) => {
    if (itemToRename && newName && newName.trim() !== '') {
      renameChat(itemToRename.id, newName);
      toast.success('Chat Renamed');
      setIsRenameOpen(false);
      setItemToRename(null);
    }
  };
  
  const handleClear = () => {
    if (searchQuery) {
      const idsToDelete = filteredHistory.map((item) => item.id);
      idsToDelete.forEach(id => deleteChat(id));
      toast.success(`${idsToDelete.length} chats deleted`);
    } else {
      deleteAllChats();
      toast.success('All chats deleted');
    }
    setIsClearAllOpen(false);
  };
  
  const clearDialogDescription = searchQuery
    ? `This will permanently delete the ${filteredHistory.length} items matching your search.`
    : 'This action cannot be undone. This will permanently delete your entire expansion history.';
  
  const getHistoryItemPreview = (item: Chat) => {
    const lastMessage = item.messages.filter(m => m.role === 'user').pop();
    return lastMessage?.content || "No messages yet";
  }
  
  const handleNewChat = () => {
    createNewChat();
    if(isMobile) toggle();
  }
  
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    if (isMobile) {
      toggle();
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
    <SidebarPrimitive isOpen={isOpen} isMobile={isMobile} setIsOpen={setIsOpen}>
      {/* Header */}
      <SidebarHeader className="p-0">
        <div className="px-5 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl shadow-md">
                <Logo className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-headline text-foreground/90 whitespace-nowrap">
                  Zogna
                </h1>
                <p className="text-xs text-muted-foreground/80 whitespace-nowrap">Intelligence. Unified.</p>
              </div>
            </motion.div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 md:hidden text-muted-foreground hover:text-foreground" 
              onClick={toggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      
      {/* Content */}
      <SidebarContent className="p-0 flex flex-col">
        {/* New Chat Button */}
        <div className="p-3 border-b">
          <Button 
            onClick={handleNewChat} 
            variant="default" 
            className="w-full justify-start gap-2 px-4 py-2.5 shadow-sm font-medium"
          >
            <Edit className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        {/* Search Section */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between px-1 h-10">
            <AnimatePresence mode="wait">
              {isSearchVisible ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 w-full"
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary/40 bg-muted/30 dark:bg-muted/10"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground/90">Chat History</h2>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={handleToggleSearch}
              >
                {isSearchVisible ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isSearchVisible ? 'Close search' : 'Open search'}
                </span>
              </Button>
              {chats.length > 0 && !isSearchVisible && (
                <AlertDialog
                  open={isClearAllOpen}
                  onOpenChange={setIsClearAllOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-xs h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      Clear
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                        <TriangleAlert
                          className="h-6 w-6 text-red-600 dark:text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="mt-2">
                            {clearDialogDescription}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                    </div>
                    <AlertDialogFooter className="mt-4 gap-2 sm:flex-row sm:justify-end">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClear}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="h-14 w-14 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No chats yet
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">
                    Your conversations will appear here
                  </p>
                </div>
              ) : (
                <AlertDialog>
                  <AnimatePresence>
                    {filteredHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -20,
                          transition: { duration: 0.2 },
                        }}
                        className="group relative"
                      >
                        <div
                          className={cn(
                            'p-3.5 rounded-xl border border-border/60 hover:border-border/90 hover:bg-muted/30 dark:hover:bg-muted/10 transition-all duration-200 cursor-pointer shadow-sm',
                            activeChatId === item.id && 'bg-primary/10 border-primary/30 shadow-sm'
                          )}
                          onClick={() => handleSelectChat(item.id)}
                          title={item.title}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(item.createdAt)}
                              {item.model && ` · ${item.model}`}
                            </p>
                          </div>
                          <p className="text-sm font-medium line-clamp-1 mb-1.5 text-foreground/90">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground/80 line-clamp-2">
                            {getHistoryItemPreview(item)}
                          </p>
                        </div>
                        <div
                          className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 flex items-center gap-1 transition-opacity duration-200 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm"
                        >
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToRename({ id: item.id, title: item.title });
                                setIsRenameOpen(true);
                              }}
                              className="p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                              aria-label="Rename item"
                            >
                              <Edit className="h-4 w-4 text-primary" />
                          </button>
                          <AlertDialogTrigger asChild>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete(item.id);
                                }}
                                className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
                                aria-label="Delete item"
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </AlertDialogTrigger>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <AlertDialogContent>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                        <TriangleAlert
                          className="h-6 w-6 text-red-600 dark:text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="mt-2">
                            This will permanently delete this chat.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                    </div>
                    <AlertDialogFooter className="mt-4 gap-2 sm:flex-row sm:justify-end">
                      <AlertDialogCancel
                        onClick={() => setItemToDelete(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </ScrollArea>
        </div>
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter className="p-3 border-t bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <UserNav 
              user={mockUser} 
              onSignOut={() => alert("Signing out...")} 
              side="top" 
              align="start" 
              triggerVariant='detailed'
            />
          </div>
          <ThemeToggle className="ml-2" />
        </div>
      </SidebarFooter>
      
      <ConfirmationDialog
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        title="Rename Chat"
        description="Enter a new name for this chat."
        onConfirm={handleRename}
        isRename
        initialInputValue={itemToRename?.title || ''}
      >
        <span />
      </ConfirmationDialog>
    </SidebarPrimitive>
  );
}