'use client';

import * as React from 'react';
import { Paperclip, Send, BrainCircuit, Search, ArrowUp, File as FileIcon, X, FileImage, FileText, FileSpreadsheet, FileJson, FileType, Square, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/use-chat';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import { InputModelSelector } from '../common/input-model-selector';

const MESSAGES = {
  PLACEHOLDER: 'Write your message here (Ctrl + Enter to send)...',
  FOOTER: 'Zogna may make mistakes. Consider checking important information.',
  FILE_TOO_LARGE: 'File size exceeds 10MB.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  DRAG_DROP: 'Drop file to attach',
  MAX_FILES: 'Only one file can be uploaded at a time.',
};

const LIMITS = {
  MAX_INPUT_LENGTH: 20000,
  TEXTAREA_MAX_ROWS: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/json',
  'text/markdown'
];

const ACCEPTED_FILE_EXTENSIONS = [
  '.txt', '.md', '.json', '.csv', '.xml', '.html', '.css',
  '.js', '.ts', '.jsx', '.tsx',
  '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.swift', '.kt', '.sql', '.yaml', '.yml'
];

type UploadStatus = 'uploading' | 'parsing' | 'complete' | 'error';

interface UploadedFile {
  file: File;
  progress: number;
  status: UploadStatus;
}

const getFileIcon = (fileType: string, fileName: string) => {
  if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5 text-muted-foreground"/>;
  if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-muted-foreground"/>;
  if (fileType.includes('spreadsheetml') || fileType.includes('ms-excel') || fileType === 'text/csv' || fileName.endsWith('.csv')) return <FileSpreadsheet className="h-5 w-5 text-muted-foreground"/>;
  if (fileType.includes('wordprocessingml') || fileType.includes('msword')) return <FileText className="h-5 w-5 text-muted-foreground"/>;
  if (fileType.includes('presentationml') || fileType.includes('ms-powerpoint')) return <FileType className="h-5 w-5 text-muted-foreground"/>;
  if (fileType === 'application/json' || fileName.endsWith('.json')) return <FileJson className="h-5 w-5 text-muted-foreground"/>;
  return <FileIcon className="h-5 w-5 text-muted-foreground"/>;
};

const isValidFile = (file: File): boolean => {
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    toast.error(MESSAGES.FILE_TOO_LARGE);
    return false;
  }

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = ACCEPTED_FILE_TYPES.includes(file.type) || ACCEPTED_FILE_EXTENSIONS.includes(fileExtension || '');

  if (!isValidType) {
    toast.error(`${MESSAGES.INVALID_FILE_TYPE} Supported types: ${ACCEPTED_FILE_TYPES.join(', ')}`);
    return false;
  }

  return true;
};

export function InputBox() {
  const [message, setMessage] = React.useState('');
  const { addMessageToChat, activeChatId, isLoading, cancelResponse } = useChat();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(null);
  const dragCounter = React.useRef(0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      cancelResponse();
      return;
    }

    if ((!message.trim() && !uploadedFile) || !activeChatId) return;

    let content = message.trim();
    if (uploadedFile) {
      content += `\n\nFile attached: ${uploadedFile.file.name}`;
    }

    addMessageToChat(activeChatId, content);
    setMessage('');
    setUploadedFile(null);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the height
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight, 10);
    const paddingTop = parseInt(computedStyle.paddingTop, 10);
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10);
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = lineHeight * LIMITS.TEXTAREA_MAX_ROWS + paddingTop + paddingBottom;

    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
    // Allow Shift+Enter and Enter to create new lines
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      toast.error(MESSAGES.MAX_FILES);
      return;
    }

    const file = files[0];
    if (!isValidFile(file)) return;

    setUploadedFile({ file, progress: 0, status: 'uploading' });

    // Simulate upload and parsing
    const uploadInterval = setInterval(() => {
      setUploadedFile(prev => {
        if (!prev) {
          clearInterval(uploadInterval);
          return null;
        }
        if (prev.progress < 100) {
          return { ...prev, progress: prev.progress + 10 };
        }
        clearInterval(uploadInterval);

        // Move to parsing
        setTimeout(() => {
          setUploadedFile(p => p ? { ...p, status: 'parsing' } : null);
        }, 300);

        // Move to complete
        setTimeout(() => {
          setUploadedFile(p => p ? { ...p, status: 'complete' } : null);
        }, 1000);

        return prev;
      });
    }, 100);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;

    // Only show drag state if dragging files (not text or other elements)
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show drag state if dragging files
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const cancelUpload = () => {
    setUploadedFile(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMessage(prev => prev + text);
    } catch (error) {
      toast.error('Failed to read from clipboard.');
      console.error('Clipboard paste error:', error);
    }
  };

  const isSubmitDisabled = !isLoading && !message.trim() && !uploadedFile;
  const isInputEmpty = message.trim().length === 0;

  const getUploadStatusText = (status: UploadStatus, progress: number) => {
    switch (status) {
      case 'uploading':
        return `Uploading... ${progress}%`;
      case 'parsing':
        return 'Parsing...';
      case 'complete':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/80 p-4 backdrop-blur-md mt-auto flex-shrink-0">
      <div className="relative mx-auto max-w-3xl">
        <form
          onSubmit={handleSendMessage}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative"
        >
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/10 text-primary font-medium"
            >
              {MESSAGES.DRAG_DROP}
            </motion.div>
          )}
          <div className="w-full max-w-4xl mx-auto p-3 bg-card border rounded-2xl flex flex-col gap-3 shadow-sm">
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-background border"
              >
                {getFileIcon(uploadedFile.file.type, uploadedFile.file.name)}
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={uploadedFile.progress} className="h-1 w-24"/>
                    <p className="text-xs text-muted-foreground">
                      {getUploadStatusText(uploadedFile.status, uploadedFile.progress)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={cancelUpload}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4"/>
                </Button>
              </motion.div>
            )}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={MESSAGES.PLACEHOLDER}
              className="flex-1 resize-none bg-transparent border-0 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 shadow-none focus-visible:ring-0 p-0 overflow-y-hidden text-sm"
              rows={2}
              maxLength={LIMITS.MAX_INPUT_LENGTH}
              disabled={isLoading}
            />
            <div className="flex items-center gap-1">
              <InputModelSelector />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 h-auto bg-background border rounded-full shadow-sm hover:bg-accent/50"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                Search
              </Button>

              <div className="flex-grow" />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground rounded-full"
                onClick={isInputEmpty ? handlePaste : () => setMessage('')}
                disabled={isLoading}
                title={isInputEmpty ? "Paste from clipboard" : "Clear input"}
                aria-label={isInputEmpty ? "Paste from clipboard" : "Clear input"}
              >
                {isInputEmpty ? (
                  <ClipboardPaste className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <motion.div
                whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
                whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
              >
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitDisabled}
                  className={cn(
                    "text-primary-foreground p-2 rounded-full transition-all duration-300",
                    isSubmitDisabled
                      ? "bg-muted cursor-not-allowed text-muted-foreground"
                      : isLoading
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90"
                  )}
                  aria-label={isLoading ? 'Stop generating' : 'Send message'}
                >
                  {isLoading ? <Square className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                </Button>
              </motion.div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept={[...ACCEPTED_FILE_TYPES, ...ACCEPTED_FILE_EXTENSIONS].join(',')}
            aria-label="File upload"
          />
        </form>
      </div>
      <p className="text-center text-xs text-muted-foreground pt-2">
        {MESSAGES.FOOTER}
      </p>
    </div>
  );
}