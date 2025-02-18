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
        const isCorrect = answer.is_correct; // Kiểm tra xem đây có phải là câu trả lời đúng không
        const answerStatus = isSelected
          ? isCorrect
            ? "true" // Người dùng chọn đúng
            : "false" // Người dùng chọn sai
          : isCorrect
          ? "null" // Đáp án đúng nhưng chưa được chọn
          : ""; // Câu trả lời không liên quan

        return (
          <div
            key={answer.answer_id}
            className={`flex flex-col mb-3 p-4 rounded ${
              answerStatus === "true"
                ? "bg-green-100 border-l-4 border-green-400"
                : answerStatus === "false"
                ? "bg-red-100 border-l-4 border-red-400"
                : answerStatus === "null"
                ? "bg-green-50 border-l-4 border-yellow-400"
                : ""
            }`}
          >
            <div className="flex items-center">
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
                        : answerStatus === "null"
                        ? "text-yellow-300"
                        : ""
                    }`}
                  >
                    {answerStatus === "true"
                      ? "(Bạn đã trả lời đúng câu này)"
                      : "(Bạn đã trả lời sai câu này)"}
                  </span>
                )}
                {!isSelected && answerStatus === "null" && (
                  <span className="ml-2 text-sm font-semibold text-green-400">
                    (Đây là câu trả lời đúng)
                  </span>
                )}
              </label>
            </div>

            {/* Hiển thị lý do tại đây */}
            {(answerStatus === "true" ||
              answerStatus === "false" ||
              answerStatus === "null") && (
              <p className="mt-2 text-sm text-gray-600 italic">
              {answer.reason}
              </p>
            )}
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
    score: "",
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
        score: quizData.score || "",
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

  return (
    <div className="pt-20 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Cột bên trái */}
      <div className="lg:col-span-3">
        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl t-4 font-bold text-indigo-700 text-center flex-1">
                {quiz.title}
              </h1>
            </div>
            <p className="text-lg p-6 text-gray-600">{quiz.description}</p>
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
