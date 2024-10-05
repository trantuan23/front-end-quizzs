"use client";

import { useSidebar } from "@/context/SidebarContext";
import { ChevronDownIcon, CogIcon, HomeIcon, Users2Icon } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { isSidebarVisible } = useSidebar();

  if (!isSidebarVisible) return null;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside className="w-64 hidden md:block bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 shadow-lg transition-transform duration-300">
      <nav>
        <ul>
          <li className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <HomeIcon className="h-6 w-6 mr-3 text-blue-400" />
            <span className="text-lg font-medium">
              Dashboard
              </span>
          </li>

          <li className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <Users2Icon className="h-6 w-6 mr-3 text-green-400" />
            <span className="text-lg font-medium">Users</span>
          </li>

          <li className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <CogIcon className="h-6 w-6 mr-3 text-yellow-400" />
            <span className="text-lg font-medium">Settings</span>
          </li>
        </ul>
      </nav>

      <div className="mt-4 relative">
        <div
          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={toggleDropdown}
        >
          <span className="text-lg font-medium">Options</span>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isDropdownOpen && (
          <ul className="bg-gray-800 rounded-lg shadow-lg w-full mt-2">
            <li className="p-3 hover:bg-gray-600 rounded-lg cursor-pointer">Option 1</li>
            <li className="p-3 hover:bg-gray-600 rounded-lg cursor-pointer">Option 2</li>
            <li className="p-3 hover:bg-gray-600 rounded-lg cursor-pointer">Option 3</li>
          </ul>
        )}
      </div>
    </aside>
  );
}
