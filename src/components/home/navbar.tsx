"use client";
import { MenuSquare, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import React from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMiddleDropdownOpen, setIsMiddleDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMiddleDropdown = () => {
    setIsMiddleDropdownOpen(!isMiddleDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-br from-black to-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          Quiz Platform
        </Link>

        <div className="hidden md:flex space-x-8 justify-center flex-grow relative">
          <Link href="/about" className="text-lg hover:text-gray-300 transition">
            About
          </Link>

          <div className="relative">
            <button
              onClick={toggleMiddleDropdown}
              className="text-lg hover:text-gray-300 flex items-center space-x-1 focus:outline-none"
            >
              <span>More</span>
              <ChevronDown className={`transition-transform ${isMiddleDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isMiddleDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/services"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-lg hover:text-gray-300 transition">
            Contact
          </Link>
        </div>

        <Link href="/login" className="ml-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition text-lg">
          Login
        </Link>

        {/* Dropdown cho di động */}
        <div className="md:hidden">
          <button
            onClick={toggleDropdown}
            className="focus:outline-none flex items-center space-x-2"
          >
            <MenuSquare className="text-lg" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-4 mt-4 w-48 bg-gray-800 rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
