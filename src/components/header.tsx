"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 shadow-md z-20">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        {/* Sidebar Toggle */}
        <Button
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-800 transition p-2 rounded-md"
        >
          <Menu size={28} />
        </Button>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <Avatar className="border-2 border-white transition duration-200 hover:scale-105">
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
              <ul className="py-2">
                <li>
                  <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700">
                    <User size={18} className="mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-700">
                    <Settings size={18} className="mr-2" /> Settings
                  </Link>
                </li>
                <li>
                  <Link href="/logout" className="flex items-center px-4 py-2 hover:bg-gray-700 text-red-400">
                    <LogOut size={18} className="mr-2" /> Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
