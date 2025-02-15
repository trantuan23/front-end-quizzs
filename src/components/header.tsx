"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, User, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Logout } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { LogoutAuth } from "@/app/actions/auth.action";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const username = useSelector((state: RootState) => state.user.username);
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);

  const logout = async () => {
    if (!userId) return;
    await LogoutAuth(userId);
    dispatch(Logout());
    localStorage.clear();
    sessionStorage.clear();
    router.push("/admin/auth/dang-nhap-trang-quan-tri");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white py-4 shadow-md z-20">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Button onClick={toggleSidebar} className="text-white hover:bg-gray-800 p-2 rounded-md">
          <Menu size={28} />
        </Button>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center">
            <User className="w-6 h-6" />
            <p>{username || "Login"}</p>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border">
              <button onClick={logout} className="flex items-center px-4 py-2 w-full">
                <LogOut size={18} className="mr-2 text-red-400" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
