"use client";
import { MenuSquare, ChevronDown, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import React from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMiddleDropdownOpen, setIsMiddleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-br from-gray-900 to-blue-700 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
          Quiz Platform
        </Link>

        {/* Navbar Desktop */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/about" className="text-lg hover:text-gray-300 transition-all">About</Link>

          {/* Dropdown More */}
          <div className="relative group">
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
                  <li><Link href="/services" className="block px-4 py-2 hover:bg-gray-700">Services</Link></li>
                  <li><Link href="/pricing" className="block px-4 py-2 hover:bg-gray-700">Pricing</Link></li>
                  <li><Link href="/faq" className="block px-4 py-2 hover:bg-gray-700">FAQ</Link></li>
                </ul>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-lg hover:text-gray-300 transition-all">Contact</Link>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            <User className="w-6 h-6 text-white" />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
              <ul className="py-2">
                <li><Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
                <li><Link href="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link></li>
                <li><Link href="/home/auth/authForm" className="block px-4 py-2 hover:bg-gray-700 text-red-400">Login</Link></li>
                <li><Link href="/logout" className="block px-4 py-2 hover:bg-gray-700 text-red-400">Logout</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-4 mt-4 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
              <ul className="py-2">
                <li><Link href="/about" className="block px-4 py-2 hover:bg-gray-700">About</Link></li>
                <li><Link href="/contact" className="block px-4 py-2 hover:bg-gray-700">Contact</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
