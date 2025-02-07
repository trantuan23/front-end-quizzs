"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useSidebar } from "@/context/SidebarContext";

const DashBoardLayout =({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isSidebarVisible } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className={`flex flex-1 transition-all duration-300 ${isSidebarVisible ? "ml-48" : "ml-0"}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-24 bg-white shadow-md rounded-lg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
