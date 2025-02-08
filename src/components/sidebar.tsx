import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils"; // Tiện ích hợp nhất className
import { ChevronDownIcon, CogIcon, HomeIcon, ListCollapse, User2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, color: "text-blue-400" },
  { name: "Quizz", href: "/dashboard/quizz", icon: ListCollapse, color: "text-green-400" },
  { name: "Người dùng", href: "/dashboard/auth", icon: User2Icon, color: "text-red-500" },
  { name: "Question", href: "/dashboard/question", icon: ListCollapse, color: "text-purple-400" },
  { name: "Answers", href: "/dashboard/answers", icon: ListCollapse, color: "text-green-400" },
  { name: "Result", href: "/dashboard/result", icon: ListCollapse, color: "text-green-400" },
];

const subcategories = [
  { name: "Class", href: "/dashboard/class" },
  { name: "Subject", href: "/dashboard/subject" },
  { name: "Drap question", href: "#" },
  { name: "Audio question", href: "#" },
  { name: "Results", href: "#" },
];

export default function Sidebar() {
  const { isSidebarVisible } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isSidebarVisible) return null;

  return (
    <aside
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-gray-900 text-white p-4 shadow-lg z-10 transition-transform duration-300"
    >
      <nav>
        <ul>
          {menuItems.map(({ name, href, icon: Icon, color }) => (
            <li key={name} className="group">
              <Link
                href={href}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                <Icon className={cn("h-5 w-5 mr-3", color)} />
                <span className="text-base font-medium group-hover:text-gray-300">{name}</span>
              </Link>
            </li>
          ))}

          {/* Subcategory Dropdown */}
          <li className="mt-4 relative">
            <div
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-base font-medium">Subcategory</span>
              <ChevronDownIcon
                className={cn("h-5 w-5 transition-transform duration-200", isDropdownOpen && "rotate-180")}
              />
            </div>
            {isDropdownOpen && (
              <ul className="bg-gray-800 rounded-lg shadow-lg w-full mt-2 overflow-hidden">
                {subcategories.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="block p-3 text-sm hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Settings */}
          <li className="mt-4">
            <Link
              href="#"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              <CogIcon className="h-5 w-5 mr-3 text-yellow-400" />
              <span className="text-base font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
