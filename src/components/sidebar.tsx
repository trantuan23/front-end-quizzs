"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import {
  ChevronDownIcon,
  DatabaseBackupIcon,
  HomeIcon,
  ListCollapse,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    color: "text-blue-400",
  },
  {
    name: "Quizz",
    href: "/dashboard/quizz",
    icon: ListCollapse,
    color: "text-green-400",
  },
  {
    name: "Người dùng",
    href: "/dashboard/user",
    icon: User2Icon,
    color: "text-red-500",
  },
  {
    name: "Question",
    href: "/dashboard/question",
    icon: ListCollapse,
    color: "text-purple-400",
  },
  {
    name: "Answers",
    href: "/dashboard/answers",
    icon: ListCollapse,
    color: "text-green-400",
  },
  {
    name: "Result",
    href: "/dashboard/result",
    icon: ListCollapse,
    color: "text-green-400",
  },
  {
    name: "Backup",
    href: "/dashboard/backup",
    icon: DatabaseBackupIcon,
    color: "text-yellow-400",
  },
];

const subcategories = [
  { name: "Class", href: "/dashboard/class" },
  { name: "Subject", href: "/dashboard/subject" },
];

export default function Sidebar() {
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);

  const filteredMenuItems = menuItems.filter(
    (item) => item.name !== "Backup" || role === "admin"
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isSidebarVisible) return null;

  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-gray-900 text-white p-4 shadow-lg z-50 transition-transform duration-300",
          isSidebarVisible ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:w-64"
        )}
      >
        <nav>
          <ul>
            {filteredMenuItems.map(({ name, href, icon: Icon, color }) => (
              <li key={name} className="group">
                <Link
                  href={href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-300"
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <Icon className={cn("h-5 w-5 mr-3", color)} />
                  <span className="text-base font-medium">{name}</span>
                </Link>
              </li>
            ))}

            <li className="mt-4 relative">
              <div
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-base font-medium">Subcategory</span>
                <ChevronDownIcon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </div>
              {isDropdownOpen && (
                <ul className="bg-gray-800 rounded-lg shadow-lg w-full mt-2">
                  {subcategories.map(({ name, href }) => (
                    <li key={name}>
                      <Link
                        href={href}
                        className="block p-3 text-sm hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={isMobile ? toggleSidebar : undefined}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
