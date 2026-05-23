import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, Zap, ChevronUp, HelpCircle } from "lucide-react";
import type { AppUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircularProgress } from '../ui/circular-progress';
import { PLAN_TOKENS } from '@/hooks/use-auth';

interface UserNavProps {
  user: AppUser;
  onSignOut: () => void;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  triggerVariant?: 'avatar' | 'detailed';
}

const defaultAvatar = `data:image/svg+xml,%3csvg fill='currentColor' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 45.532 45.532' xml:space='preserve'%3e%3cpath d='M22.766 0.001C10.194 0.001 0 10.193 0 22.766s10.193 22.765 22.766 22.765c12.574 0 22.766-10.192 22.766-22.765S35.34 0.001 22.766 0.001zm0 6.808c4.16 0 7.531 3.372 7.531 7.53 0 4.159-3.371 7.53-7.531 7.53-4.158 0-7.529-3.371-7.529-7.53C15.237 10.18 18.608 6.808 22.766 6.808zm0 32.771c-4.149 0-7.949-1.511-10.88-4.012-0.714-0.609-1.126-1.502-1.126-2.439 0-4.217 3.413-7.592 7.631-7.592h8.762c4.219 0 7.619 3.375 7.619 7.592 0 0.938-0.41 1.829-1.125 2.438C30.712 38.068 26.911 39.579 22.761 39.579z'/%3e%3c/svg%3e`;

const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
};

export function UserNav({ user, onSignOut, side = 'bottom', align = "end", triggerVariant = 'avatar' }: UserNavProps) {
    const navigate = useNavigate();
    
    const handleNavigate = (path: string) => {
        navigate(path);
    }
    
    const triggerContent = triggerVariant === 'avatar' ? (
        <div className="p-0.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || defaultAvatar} data-ai-hint="user avatar" alt={user?.displayName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                    {getInitials(user?.displayName, user?.email)}
                </AvatarFallback>
            </Avatar>
        </div>
    ) : (
        <div className="flex items-center gap-3 w-full text-left group">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple shadow-sm hover:shadow-md transition-shadow duration-300">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || defaultAvatar} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-brand-blue to-brand-purple text-white text-xs font-medium">
                        {getInitials(user?.displayName, user?.email)}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground/90 truncate">
                    {user.displayName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {user.plan} Plan
                </p>
            </div>
            <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </div>
    );
    
    const totalTokens = PLAN_TOKENS[user.plan] || 0;
    const progress = user.plan === 'Unlimited' 
        ? 100 
        : totalTokens > 0 
        ? (user.tokens / totalTokens) * 100 
        : 0;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
                        triggerVariant === 'detailed' 
                            ? 'w-full h-auto px-3 py-2.5 justify-start hover:bg-accent/50 rounded-xl border border-transparent hover:border-border' 
                            : 'relative h-10 w-10 rounded-full p-0 hover:bg-accent/30'
                    )}
                >
                    {triggerContent}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 bg-gradient-to-b from-background to-muted/30 backdrop-blur-xl border-border/60 rounded-xl shadow-lg overflow-hidden" 
                side={side} 
                align={align}
            >
                <div className="px-4 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex-1 min-w-0 pr-3">
                        <p className="text-sm font-bold text-foreground truncate">
                            {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email || 'No email provided'}
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <CircularProgress 
                            value={progress} 
                            size={42} 
                            strokeWidth={3}
                            className="text-blue-500 dark:text-blue-400"
                        >
                            <span className="text-xs font-bold">
                                {user.plan === 'Unlimited' ? '∞' : user.tokens}
                            </span>
                        </CircularProgress>
                    </div>
                </div>
                
                <div className="px-4 py-2 bg-muted/30">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Token Usage</span>
                        <span className="text-xs font-medium text-foreground">
                            {user.plan === 'Unlimited' ? 'Unlimited' : `${user.tokens} / ${totalTokens}`}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${user.plan === 'Unlimited' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : progress > 80 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                            style={{ width: `${user.plan === 'Unlimited' ? 100 : progress}%` }}
                        ></div>
                    </div>
                </div>
                
                <DropdownMenuSeparator className="my-1" />
                
                <div className="py-1">
                    <DropdownMenuItem 
                        onSelect={() => handleNavigate('/settings')}
                        className="py-2.5 px-4 cursor-pointer transition-colors duration-200"
                    >
                        <Settings className="mr-3 h-4 w-4 text-blue-500" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onSelect={() => handleNavigate('/help')}
                        className="py-2.5 px-4 cursor-pointer transition-colors duration-200"
                    >
                        <HelpCircle className="mr-3 h-4 w-4 text-indigo-500" />
                        <span>Help</span>
                    </DropdownMenuItem>
                    {user.plan !== 'Unlimited' && (
                        <DropdownMenuItem 
                            onSelect={() => handleNavigate('/plans')}
                            className="py-2.5 px-4 cursor-pointer transition-colors duration-200"
                        >
                            <Zap className="mr-3 h-4 w-4 text-amber-500" />
                            <span>Upgrade Plan</span>
                        </DropdownMenuItem>
                    )}
                </div>
                
                <DropdownMenuSeparator className="my-1" />
                
                <DropdownMenuItem 
                    onSelect={onSignOut} 
                    className="py-2.5 px-4 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50/70 dark:focus:bg-red-900/20 cursor-pointer transition-colors duration-200"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}