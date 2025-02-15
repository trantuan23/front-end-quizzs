"use client";

import { Logout } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { ChevronDown, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMiddleDropdownOpen, setIsMiddleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const username = useSelector((state: RootState) => state.user.username);
  const userId = useSelector((state:RootState)=>state.user.userId)

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const middleDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(Logout());
    localStorage.clear();
    sessionStorage.clear();
  };

  const closeDropdown = () => {
    setIsUserDropdownOpen(false);
    setIsMiddleDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        middleDropdownRef.current &&
        !middleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMiddleDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-br from-gray-900 to-blue-700 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition" onClick={closeDropdown}>
          Quiz Platform
        </Link>

        {/* Navbar Desktop */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/about" className="text-lg hover:text-gray-300 transition-all" onClick={closeDropdown}>About</Link>

          {/* Dropdown More */}
          <div className="relative" ref={middleDropdownRef}>
            <button
              className="text-lg flex items-center space-x-1 hover:text-gray-300 transition-all focus:outline-none"
              onClick={() => setIsMiddleDropdownOpen(!isMiddleDropdownOpen)}
            >
              <span>More</span>
              <ChevronDown className={`transition-transform ${isMiddleDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isMiddleDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
                <ul className="py-2">
                  <li><Link href="/services" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>Services</Link></li>
                  <li><Link href="/pricing" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>Pricing</Link></li>
                  <li><Link href="/faq" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>FAQ</Link></li>
                </ul>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-lg hover:text-gray-300 transition-all" onClick={closeDropdown}>Contact</Link>
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            <User className="w-6 h-6 text-white" /> <p>{username || "Login"}</p>
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
              <ul className="py-2">
                <li>
                  <Link href={userId ? `/home/auth/ho-so-nguoi-dung/${userId}` : "#"} className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>
                    Settings
                  </Link>
                </li>

                {username ? (
                  <li>
                    <div className="block px-4 py-2 hover:bg-gray-700 text-red-400">
                      <button onClick={() => { logout(); closeDropdown(); }}>Logout</button>  
                    </div>
                  </li>
                ) : (
                  <li>
                    <Link href="/home/auth/dang-nhap-dang-ki-nguoi-dung" className="block px-4 py-2 hover:bg-gray-700 text-red-400" onClick={closeDropdown}>
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden" ref={mobileDropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none flex items-center space-x-2"
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-4 mt-4 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
              <ul className="py-2">
                <li><Link href="/about" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>About</Link></li>
                <li><Link href="/contact" className="block px-4 py-2 hover:bg-gray-700" onClick={closeDropdown}>Contact</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
