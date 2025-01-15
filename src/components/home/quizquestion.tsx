"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Answers } from "@/app/types/answers.type";
import Modal from "../ui/Modal.tsx";

const QuizQuestion = ({ quizId }: { quizId: string }) => {
  const [timeLeft, setTimeLeft] = useState(5400); // Thời gian mặc định (giây)
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [quiz, setQuiz] = useState({
    quizz_id: "",
    title: "",
    description: "",
    time: 0,
    questions: [] as any[],
    subject: [] as any[],
    
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const questionsPerPage = 3;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch quiz data");

      const quizData = await response.json();
     
      
      setQuiz({
        quizz_id: quizId,
        title: quizData.title,
        description: quizData.description,
        time: quizData.time,
        questions: quizData.questions,
        subject:quizData.subject,
      });
      setTimeLeft(quizData.time);
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
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      toast({
        title: "Hết thời gian",
        description: "Bài kiểm tra đã kết thúc!",
        variant: "destructive",
      });
    }
  }, [timeLeft]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

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

  const handleSubmitQuizConfirmation = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    await handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    const unansweredQuestions = quiz.questions.filter(
      (question) => !selectedAnswers[question.question_id]
    );

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Chưa hoàn thành",
        description: "Bạn cần trả lời hết các câu hỏi trước khi nộp bài.",
        variant: "destructive",
      });
      return;
    }

    const quizMetaData = {
      quizId: quiz.quizz_id, // Lấy quizId từ quizzData hoặc trực tiếp
      userId: "fd6c4fce-f968-4d82-9c29-2798e80df6f4", // userId
      subjectId:quiz.subject.subject_id
    };

    const quizIdString = Array.isArray(quizMetaData.quizId)
      ? quizMetaData.quizId.join(",") // Nếu là mảng, join các phần tử lại
      : quizMetaData.quizId; // Nếu là chuỗi, sử dụng trực tiếp

    const answers = quiz.questions.map((question) => {
      const selectedAnswer = selectedAnswers[question.question_id];
      const answer = question.answers.find(
        (ans: Answers) => ans.answer_id === selectedAnswer
      );

      return {
        question_id: question.question_id,
        question_text: question.question_text,
        selected_answer: {
          answer_id: selectedAnswer, // ID câu trả lời đã chọn
          answer_text: answer?.answer_text, // Nội dung câu trả lời
          is_conrrect: answer?.is_conrrect, // Kiểm tra xem câu trả lời có đúng hay không
        },
      };
    });

    // Tạo đối tượng dữ liệu gửi đi
    const requestData = {
      quizId: quizIdString,
      answers: answers,
      userId: quizMetaData.userId,
      subjectId: quizMetaData.subjectId,
    };

    // Thực hiện gửi dữ liệu
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit quiz");

      toast({
        title: "Nộp bài thành công",
        description: "Cảm ơn bạn đã hoàn thành bài kiểm tra!",
      });

      // Xử lý sau khi nộp bài (ví dụ: chuyển hướng hoặc làm mới trang)
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể nộp bài kiểm tra.",
        variant: "destructive",
      });
    }
  };

  const displayedQuestions = quiz.questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const formatTime = (timeInSeconds: number) => {
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
              <div key={question.question_id} className="mb-6">
                <h2 className="text-xl font-bold">
                  Câu {currentPage * questionsPerPage + index + 1}:{" "}
                  {question.question_text}
                </h2>
                {question.answers.map((answer: any) => (
                  <div
                    key={answer.answer_id}
                    className="flex items-center mb-3"
                  >
                    <Checkbox
                      id={`answer-${answer.answer_id}`}
                      checked={
                        selectedAnswers[question.question_id] ===
                        answer.answer_id
                      }
                      onCheckedChange={() =>
                        handleSelectAnswer(
                          question.question_id,
                          answer.answer_id
                        )
                      }
                    />
                    <label
                      htmlFor={`answer-${answer.answer_id}`}
                      className="ml-3 text-lg"
                    >
                      {answer.answer_text}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cột bên phải */}
      <div className="lg:col-span-1">
        <Card className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Danh sách câu hỏi
          </h2>
          <div className="space-y-2 overflow-y-auto max-h-96">
            {quiz.questions.map((question) => (
              <div key={question.question_id} className="p-2 border rounded-lg">
                <p>{question.question_text}</p>
                <p className="text-gray-600">
                  {selectedAnswers[question.question_id]
                    ? `Đáp án: ${
                        question.answers.find(
                          (answer) =>
                            answer.answer_id ===
                            selectedAnswers[question.question_id]
                        )?.answer_text
                      }`
                    : "Chưa trả lời"}
                </p>
              </div>
            ))}
          </div>
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

      {/* Nộp bài */}
      <div className="col-span-1 lg:col-span-4 flex justify-center mt-6">
        <Button onClick={handleSubmitQuizConfirmation}>Nộp bài</Button>
      </div>

      {/* Modal xác nhận */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold">Xác nhận nộp bài</h2>
        <p>Bạn có chắc chắn muốn nộp bài kiểm tra không?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirmSubmit}>Nộp bài</Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuizQuestion;
