"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { fetchQuizzes } from "@/app/actions/quizz.action";
import { Quiz } from "@/app/types/quizz.type";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State điều khiển modal
  const user_id = useSelector((state: RootState) => state.user.userId);
  const router = useRouter();

  const formatTime = (seconds: number) => {
    if (seconds <= 60) {
      return `${seconds} giây`;
    }
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút ${seconds % 60} giây`;
  };

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy danh sách quiz.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizz_id: string) => {
    if (!user_id) {
      // Nếu người dùng chưa đăng nhập, mở modal xác nhận
      setIsModalOpen(true);
    } else {
      // Nếu đã đăng nhập, cho phép tham gia bài kiểm tra
      router.push(`home/quizzpage/test/${quizz_id}`);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/home/auth/dang-nhap-dang-ki-nguoi-dung");
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadQuizzes();
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto mt-16 px-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
          Hệ Thống Đánh Giá Năng Lực
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Lựa chọn bài kiểm tra phù hợp để đánh giá năng lực của bạn.
        </p>
      </div>

      <div className="text-xl font-medium text-gray-700 bg-gray-100 py-3 px-6 rounded-lg shadow-sm">
        ⏰ Thời gian hiện tại: <span className="font-bold">{currentTime}</span>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <div
                key={quiz.quizz_id}
                className="group border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 bg-white p-6"
              >
                <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  ⏳ Thời gian: {quiz.time ? formatTime(quiz.time) : "Không giới hạn"}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  👤 <span className="font-medium text-gray-700">Người ra đề:</span> {quiz.user.username}
                </p>
              
                <Button
                  onClick={() => handleQuizClick(quiz.quizz_id)}
                  className="mt-6 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md font-medium text-white transition"
                >
                  🎯 Tham gia bài kiểm tra
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500 text-center">Không có bài kiểm tra nào.</p>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-md text-gray-700">
          Bạn đã có tài khoản chưa? 
          <Link href="/home/auth/authForm" className="text-blue-500 hover:underline font-medium ml-1">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Modal xác nhận */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Bạn chưa đăng nhập</h3>
            <p className="text-md mb-4">Bạn cần đăng nhập để tham gia bài kiểm tra. Bạn có muốn đăng nhập ngay không?</p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Hủy
              </Button>
              <Button
                onClick={handleLoginRedirect}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
