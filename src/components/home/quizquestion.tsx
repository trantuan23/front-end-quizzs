"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox"; 

const QuizQuestion = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    new Array(13).fill("")
  );

  const questions = [
    {
      question: "Công ty nào phát triển hệ điều hành Windows?",
      options: ["Google", "Microsoft", "Apple", "IBM"],
    },
    {
      question: "Ngôn ngữ lập trình nào được phát triển bởi Google?",
      options: ["Python", "Java", "Go", "C#"],
    },
    {
      question: "JavaScript được sử dụng chủ yếu ở đâu?",
      options: ["Backend", "Frontend", "Database", "Security"],
    },
    {
      question: "Ai là người sáng lập ra Microsoft?",
      options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Larry Page"],
    },
    {
      question: "Ngôn ngữ lập trình nào là ngôn ngữ chính cho phát triển web?",
      options: ["JavaScript", "Java", "Python", "C++"],
    },
    {
      question: "Công cụ nào được sử dụng để quản lý phiên bản mã nguồn?",
      options: ["Git", "Docker", "Kubernetes", "Node.js"],
    },
    {
      question: "Công ty nào phát triển hệ điều hành Android?",
      options: ["Google", "Microsoft", "Apple", "Facebook"],
    },
    {
      question: "Công ty nào phát triển hệ điều hành iOS?",
      options: ["Google", "Microsoft", "Apple", "IBM"],
    },
    {
      question: "Lập trình viên nào sáng lập ra Python?",
      options: [
        "Guido van Rossum",
        "James Gosling",
        "Linus Torvalds",
        "Dennis Ritchie",
      ],
    },
    {
      question: "Khi nào phiên bản đầu tiên của HTML được phát hành?",
      options: ["1991", "1995", "2000", "2005"],
    },
    {
      question: "Ngôn ngữ nào được sử dụng để phát triển iOS?",
      options: ["Objective-C", "Java", "Python", "Swift"],
    },
    {
      question: "Công ty nào phát triển hệ điều hành Linux?",
      options: ["Red Hat", "Microsoft", "Apple", "Không ai cả, mã nguồn mở"],
    },
    {
      question: "Ngôn ngữ nào được sử dụng trong phát triển dữ liệu lớn?",
      options: ["Python", "R", "Java", "Tất cả đều đúng"],
    },
  ];

  const questionsPerPage = 2;

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    if (timeLeft === 0) clearInterval(timer);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectAnswer = (index: number, value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = value;
    setSelectedAnswers(newAnswers);
  };

  const handleNextPage = () => {
    if (currentPage < Math.floor(questions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const displayedQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  return (
    <div className="pt-20 p-2">
      <Card className="p-4">
        <CardContent>
          <div className="text-right text-red-600 text-lg font-semibold mb-4 animate-pulse">
            Thời gian còn lại: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </div>

          {/* Nút Quay về câu hỏi đầu tiên */}
          <div className="mb-6 text-center">
            <button
              onClick={handleFirstPage}
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              Quay về câu hỏi đầu tiên
            </button>
          </div>

          {displayedQuestions.map((question, questionIndex) => {
            const globalIndex = currentPage * questionsPerPage + questionIndex;
            return (
              <div key={globalIndex} className="mb-6">
                <h1 className="text-2xl font-bold mb-2 text-indigo-700">
                  Câu hỏi {globalIndex + 1}
                </h1>
                <p className="text-lg mb-4 text-gray-800">
                  {question.question}
                </p>

                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <Checkbox
                      id={`option-${globalIndex}-${index}`}
                      checked={selectedAnswers[globalIndex] === option}
                      onCheckedChange={(checked) =>
                        handleSelectAnswer(
                          globalIndex,
                          checked ? option : ""
                        )
                      }
                    />
                    <label
                      htmlFor={`option-${globalIndex}-${index}`}
                      className={`ml-3 text-lg font-medium transition-all cursor-pointer ${
                        selectedAnswers[globalIndex] === option
                          ? "text-yellow-500 font-bold"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                    >
                      {`${String.fromCharCode(65 + index)}. ${option}`}
                    </label>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="mt-8 flex justify-between items-center">
            {currentPage > 0 ? (
              <button
                onClick={handlePreviousPage}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all"
              >
                Back
              </button>
            ) : (
              <button className="px-6 py-2 bg-gray-300 text-white rounded-lg shadow-md cursor-not-allowed">
                No back
              </button>
            )}

            <button
              onClick={handleNextPage}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
              {currentPage < Math.floor(questions.length / questionsPerPage)
                ? "Next"
                : "End"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizQuestion;
