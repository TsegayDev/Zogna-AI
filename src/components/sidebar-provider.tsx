
"use client"

import * as React from "react"

const SidebarContext = React.createContext<{
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  toggleSidebar: () => void,
} | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const toggleSidebar = React.useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // On mobile, we want the sidebar to be closed by default
    React.useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        }
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
      <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
        {children}
      </SidebarContext.Provider>
    )
}
