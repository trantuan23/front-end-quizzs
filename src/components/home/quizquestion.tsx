"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import Modal from "../ui/Modal.tsx";
import { Answerstype } from "@/app/types/answers.type";
import { useRouter, useSearchParams } from "next/navigation";

const QuizQuestion = ({ quizId }: { quizId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Sử dụng useSearchParams
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
    article: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const questionsPerPage = 5;

  const fetchData = async () => {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`
      );
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch quiz data");

      const quizData = await response.json();
      setQuiz({
        quizz_id: quizId,
        title: quizData.title,
        description: quizData.description,
        time: quizData.time,
        questions: quizData.questions,
        subject: quizData.subject.subject_id,
        article: quizData.article,
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

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setTimeLeft(quiz.time);
    setCurrentPage(0);

    // Xóa dữ liệu quiz khỏi localStorage
    localStorage.removeItem(`quiz-${quizId}`);
    location.reload()
  };

  const restoreStateFromStorage = () => {
    try {
      const storedState = localStorage.getItem(`quiz-${quizId}`);
      if (storedState) {
        const { currentPage, selectedAnswers } = JSON.parse(storedState);
        setCurrentPage(currentPage || 1);
        setSelectedAnswers(selectedAnswers || {});
      }
    } catch (error) {
      console.error("Error restoring state from storage:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchData();
      restoreStateFromStorage();

      // Kiểm tra và lấy page từ URL nếu có, mặc định là trang 1
      const pageParam = searchParams.get("page");
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      setCurrentPage(page); // Cập nhật state currentPage

      // Thay đổi URL ngay khi mới vào trang
      router.replace(`?page=${page}`);
    };

    if (!quiz.quizz_id) {
      initialize();
    }
  }, [quizId, searchParams]);

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
    handleSubmitQuiz();
  }, [timeLeft]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === answerId ? "" : answerId, // Cho phép bỏ chọn
    }));
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

    // Nếu có câu hỏi chưa trả lời, thông báo cho người dùng nhưng vẫn cho phép nộp bài
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Chưa hoàn thành",
        description:
          "Bạn chưa trả lời hết các câu hỏi. Bạn vẫn có thể nộp bài.",
      });
    }

    const quizMetaData = {
      quizId: quiz.quizz_id, // Lấy quizId từ quizzData hoặc trực tiếp
      userId: "fd6c4fce-f968-4d82-9c29-2798e80df6f4", // userId
      subjectId: quiz.subject,
    };

    const quizIdString = Array.isArray(quizMetaData.quizId)
      ? quizMetaData.quizId.join(",") // Nếu là mảng, join các phần tử lại
      : quizMetaData.quizId; // Nếu là chuỗi, sử dụng trực tiếp

    const answers = quiz.questions.map((question) => {
      const selectedAnswer = selectedAnswers[question.question_id];
      const answer =
        question.answers.find(
          (ans: Answerstype) => ans.answer_id === selectedAnswer
        ) || {};

      return {
        question_id: question.question_id,
        question_text: question.question_text,
        selected_answer: {
          answer_id: selectedAnswer, // ID câu trả lời đã chọn
          answer_text: answer?.answer_text, // Nội dung câu trả lời
          is_correct: answer?.is_correct, // Kiểm tra xem câu trả lời có đúng hay không
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

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(
          `Error status: ${response.status}, Message: ${errorMessage}`
        );
        throw new Error(`Failed to submit quiz: ${errorMessage}`);
      }

      toast({
        title: "Nộp bài thành công",
        description: "Cảm ơn bạn đã hoàn thành bài kiểm tra!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể nộp bài kiểm tra.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes} phút ${
      seconds < 10 ? "0" : ""
    }${seconds} giây`;
  };

  const currentQuestions = useMemo(() => {
    // Tính lại câu hỏi bắt đầu từ trang 1, không phải trang 0
    return quiz.questions.slice(
      (currentPage - 1) * questionsPerPage, // Lấy câu hỏi từ trang 1 trở đi
      currentPage * questionsPerPage
    );
  }, [quiz.questions, currentPage]); // Thêm `currentPage` vào dependency

  const totalPages = useMemo(() => {
    return Math.ceil(quiz.questions.length / questionsPerPage);
  }, [quiz.questions.length, questionsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Cập nhật trạng thái hiện tại
      router.push(`?page=${newPage}`); // Đồng bộ URL
    }
  };

  const handleQuestionClick = (questionIndex: number) => {
    const pageNumber = Math.floor(questionIndex / questionsPerPage) + 1; // Tính toán số trang dựa trên index câu hỏi
    setCurrentPage(pageNumber); // Cập nhật trang hiện tại
    router.push(`?page=${pageNumber}`); // Đồng bộ hóa URL
  };
  

  return (
    <div className="pt-20 p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Nội dung câu hỏi */}
      <div className="lg:col-span-3">
        <Card className="p-6 shadow-lg rounded-xl">
          <CardContent>
            <h1 className="text-3xl font-bold text-indigo-700">{quiz.title}</h1>
            <p className="text-lg text-gray-600">Yêu cầu :{quiz.article}</p>
            <p className="text-lg text-gray-600">Đề bài: {quiz.description}</p>
            {currentQuestions.map((question, index) => (
              <div key={question.question_id} className="mb-6">
                <h2 className="text-xl font-bold">
                Câu {currentPage * questionsPerPage - questionsPerPage + index + 1} : 

                  {question.question_text}
                </h2>
                {question.answers.map((answer: any) => (
                  <div
                    key={answer.answer_id}
                    className="flex items-center mb-3 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer transition-all"
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

      {/* Danh sách câu hỏi */}
      <div className="lg:col-span-1 sticky top-20 hidden lg:block overflow-y-auto max-h-screen">
        <Card className="p-4 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Danh sách câu hỏi
          </h2>
          <p className="text-red-600 font-semibold mb-4">
            Thời gian còn lại: {formatTime(timeLeft)}
          </p>
          <div className="grid grid-cols-4 gap-4 auto-rows-fr">
            {quiz.questions.map((question, index) => (
              <div
                key={question.question_id}
                onClick={() =>
                  handleQuestionClick(index)
                }
                className={`p-4 text-center rounded-lg cursor-pointer transition-all ${
                  selectedAnswers[question.question_id]
                    ? "bg-green-300 text-white font-semibold"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-100`}
              >
                <span className="font-semibold">Câu {index + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Nộp bài */}
        <div className="flex justify-between mt-6">
          <Button onClick={handleSubmitQuizConfirmation}>Nộp bài</Button>
          <Button variant="outline" onClick={handleResetQuiz}>
            Làm lại
          </Button>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-4 flex justify-between mt-6 px-4 relative z-10">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1} // Đảm bảo không cho đi qua trang 0
        >
          Trang trước
        </Button>
        <span className="text-lg font-medium">
          Trang {currentPage} /{" "}
          {Math.ceil(quiz.questions.length / questionsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang tiếp
        </Button>
      </div>

      {/* Modal xác nhận */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold">Xác nhận nộp bài</h2>
        <p>Bạn có chắc chắn muốn nộp bài kiểm tra không?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirmSubmit}>Xác nhận</Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuizQuestion;
