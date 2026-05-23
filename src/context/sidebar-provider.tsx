
"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768;

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

const AppSidebarContext = React.createContext<SidebarState | null>(null);
const AdminSidebarContext = React.createContext<SidebarState | null>(null);

export function useAppSidebar() {
  const context = React.useContext(AppSidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function useAdminSidebar() {
  const context = React.useContext(AdminSidebarContext);
  if (!context) {
    throw new Error("useAdminSidebar must be used within a SidebarProvider");
  }
  return context;
}

const createSidebarStore = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkSize = () => {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
        setIsOpen(!mobile);
    }
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const toggle = React.useCallback(() => {
      setIsOpen(prev => !prev);
  }, []);

  return { isOpen, isMobile, setIsOpen, toggle };
}


interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const appSidebarStore = createSidebarStore();
    const adminSidebarStore = createSidebarStore();

    return (
      <AppSidebarContext.Provider value={appSidebarStore}>
        <AdminSidebarContext.Provider value={adminSidebarStore}>
            {children}
        </AdminSidebarContext.Provider>
      </AppSidebarContext.Provider>
    )
}
