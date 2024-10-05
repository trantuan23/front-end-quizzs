"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Hàm cập nhật thời gian hiện tại
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center space-y-8 max-w-2xl w-full mt-24">
      <h1 className="text-4xl font-extrabold text-black md:text-5xl">
        Welcome to the Online Quiz Platform
      </h1>
      <p className="text-lg text-blue-800">
        Experience a seamless and interactive online quiz system. Challenge
        yourself and track your progress with our user-friendly interface.
      </p>

      <div className="text-xl font-medium text-black">
        Current Time: {currentTime}
      </div>

      {/* Responsive Buttons */}
      <div className="space-x-0 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-800 w-full md:w-auto">
            Start Quiz
          </Button>
        </Link>
        <Link href="/about">
          <Button className="bg-green-600 hover:bg-green-800 w-full md:w-auto">
            Learn More
          </Button>
        </Link>
      </div>

      {/* Login Link */}
      <div className="mt-8">
        <p className="text-md text-black">
          Already have an account?
          <Link href="/login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default HomePage;
