
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SidebarPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  isMobile: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function SidebarPrimitive({ 
  className, 
  children,
  isOpen,
  isMobile,
  setIsOpen,
  ...props 
}: SidebarPrimitiveProps) {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const desktopSidebar = (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 288 : 0, paddingLeft: isOpen ? 0 : 0, paddingRight: isOpen ? 0 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("flex-shrink-0 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border overflow-hidden", className)}
      {...props}
    >
      <div className="flex h-full flex-col w-72">
        {children}
      </div>
    </motion.aside>
  );

  const mobileSidebar = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn("fixed top-0 left-0 h-full z-50 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border", className)}
            {...props}
          >
            <div className="flex h-full flex-col w-72">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
  
  return isMobile ? mobileSidebar : desktopSidebar;
}
SidebarPrimitive.displayName = "SidebarPrimitive"


export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"
