"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const QuestionCard = ({ question, index, selectedAnswers }: any) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Câu {index + 1}: {question.question_text}
        </h2>
        {question.question_type === "audio_guess" && (
          <audio controls src={question.media_url} className="mt-2 mb-4">
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
        )}
        {question.answers.map((answer: any) => {
          const isSelected = selectedAnswers.includes(answer.answer_id); // Kiểm tra xem câu trả lời có được chọn không
          const isCorrect = answer.is_conrrect; // Kiểm tra xem đây có phải là câu trả lời đúng không
          const answerStatus = isSelected
            ? isCorrect
              ? "true" // Người dùng chọn đúng
              : "false" // Người dùng chọn sai
            : isCorrect
            ? "correct" // Đáp án đúng nhưng chưa được chọn
            : ""; // Câu trả lời không liên quan
  
          return (
            <div
              key={answer.answer_id}
              className={`flex items-center mb-3 ${
                answerStatus === "true"
                  ? "bg-green-100 border-l-4 border-green-400"
                  : answerStatus === "false"
                  ? "bg-red-100 border-l-4 border-red-400"
                  : answerStatus === "correct"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : ""
              }`}
            >
              <Checkbox
                id={`answer-${answer.answer_id}`}
                checked={isSelected} // Đánh dấu tích nếu đã chọn
                disabled
              />
              <label
                htmlFor={`answer-${answer.answer_id}`}
                className="ml-3 text-lg"
              >
                {answer.answer_text}
                {isSelected && (
                  <span
                    className={`ml-2 text-sm font-semibold ${
                      answerStatus === "false"
                        ? "text-red-600"
                        : answerStatus === "true"
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    {answerStatus === "false"
                      ? "(Bạn đã chọn sai)"
                      : "(Bạn đã chọn đúng)"}
                  </span>
                )}
                {!isSelected && answerStatus === "correct" && (
                  <span className="ml-2 text-sm font-semibold text-green-600">
                    (Đáp án đúng)
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    );
  };
  

const ReviewPage = ({ reviewId }: { reviewId: string }) => {
  const [timeLeft, setTimeLeft] = useState(5400); // Thời gian mặc định (giây)
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quiz, setQuiz] = useState({
    quizz_id: "",
    title: "",
    description: "",
    time: 0,
    questions: [] as any[],
  });

  const questionsPerPage = 3;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/results/${reviewId}`
      );

      if (!response.ok) throw new Error("Failed to fetch quiz data");

      const quizData = await response.json();
      setQuiz({
        quizz_id: reviewId,
        title: quizData.quizzes?.title || "",
        description: quizData.quizzes?.description || "",
        time: quizData.quizzes?.time || 0,
        questions: Array.isArray(quizData.quizzes?.questions)
          ? quizData.quizzes.questions
          : [],
      });

      setSelectedAnswers(quizData.answer_ids || []);
      setTimeLeft(quizData.quizzes?.time || 0);
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy dữ liệu quiz.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [reviewId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(quiz.questions.length / questionsPerPage) - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const displayedQuestions = useMemo(() => {
    return quiz.questions.slice(
      currentPage * questionsPerPage,
      (currentPage + 1) * questionsPerPage
    );
  }, [quiz.questions, currentPage, questionsPerPage]);

  const formatTime = (timeInSeconds: number) => {
    if (timeInSeconds <= 0) return "Đã hết giờ";
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes} phút ${
      seconds < 10 ? "0" : ""
    }${seconds} giây`;
  };

  return (
    <div className="pt-20 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Cột bên trái */}
      <div className="lg:col-span-3">
        <Card className="p-6">
          <CardContent>
            <h1 className="text-3xl font-bold text-indigo-700">{quiz.title}</h1>
            <p className="text-lg text-gray-600">{quiz.description}</p>
            <p className="text-red-600 text-lg font-semibold">
              Thời gian còn lại: {formatTime(timeLeft)}
            </p>
            {displayedQuestions.map((question, index) => (
              <QuestionCard
                key={question.question_id}
                question={question}
                index={currentPage * questionsPerPage + index}
                selectedAnswers={selectedAnswers}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Điều hướng */}
      <div className="flex justify-between col-span-1 lg:col-span-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Trang trước
        </Button>
        <span>
          Trang {currentPage + 1} /{" "}
          {Math.ceil(quiz.questions.length / questionsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={
            currentPage ===
            Math.ceil(quiz.questions.length / questionsPerPage) - 1
          }
        >
          Trang tiếp
        </Button>
      </div>
    </div>
  );
};

export default ReviewPage;
