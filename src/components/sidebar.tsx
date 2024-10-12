"use client";

import { useSidebar } from "@/context/SidebarContext";
import {
  AwardIcon,
  ChevronDownIcon,
  CogIcon,
  HomeIcon,
  ListCheckIcon,
  ListCollapse,
  ListIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const { isSidebarVisible } = useSidebar();

  if (!isSidebarVisible) return null;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside className="w-48 hidden md:block bg-gradient-to-b from-gray-900 to-gray-700 text-white p-4 shadow-lg transition-transform duration-300">
      <nav>
        <ul>
          <li className="flex items-center p-2 mb-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <HomeIcon className="h-5 w-5 mr-2 text-blue-400" />
            <span className="text-base font-medium">Dashboard</span>
          </li>

          <li className="flex items-center p-2 mb-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <AwardIcon className="h-5 w-5 mr-2 text-green-400" />
            <Link href="/dashboard/quizz">
              <span className="text-base font-medium">Quizz</span>
            </Link>
          </li>

          <li className="flex items-center p-2 mb-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <User2Icon className="h-5 w-5 mr-2 text-red-500" />
            <Link href="/dashboard/users">
              <span className="text-base font-medium">Users</span>
            </Link>
          </li>

          <li className="flex items-center p-2 mb-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <ListIcon className="h-5 w-5 mr-2 text-orange-400" />
            <Link href="/dashboard/option">
              <span className="text-base font-medium">Option</span>
            </Link>
          </li>

          <li className="flex items-center p-2 mb-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <ListCollapse className="h-5 w-5 mr-2 text-purple-400" />
            <Link href="/dashboard/question">
              <span className="text-base font-medium">Question</span>
            </Link>
          </li>

          <li className="mt-4 relative">
            <div
              className="flex items-center justify-between p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300"
              onClick={toggleDropdown}
            >
              <ListCheckIcon />
              <span className="text-base font-medium">Subcategory</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-white transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <ul className="bg-gray-800 rounded-lg shadow-lg w-full mt-2">
                <Link href="/dashboard/class">
                  <li className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                    Class
                  </li>
                </Link>
                <Link href="/dashboard/subject">
                  <li className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                    Subject
                  </li>
                </Link>
                <li className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                  Drap question
                </li>
                <li className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                  Audio question
                </li>
                <li className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                  Results
                </li>
              </ul>
            )}
          </li>

          <li className="flex items-center p-2 mt-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <CogIcon className="h-5 w-5 mr-2 text-yellow-400" />
            <span className="text-base font-medium">Settings</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
