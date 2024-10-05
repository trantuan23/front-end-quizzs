"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Tạo Context
const SidebarContext = createContext({
  isSidebarVisible: true,
  toggleSidebar: () => {},
});

// Custom Hook để sử dụng SidebarContext
export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
