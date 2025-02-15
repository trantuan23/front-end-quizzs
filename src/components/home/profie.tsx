"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
  class?: string;
}

interface QuizResult {
  title: string;
  score: string;
  completed_at: string;
  quizzes: any;
  subject: string;
  class: string;
  result_id: string;
}

export default function ProfilePage() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<QuizResult[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);  // Get the page from query params

  useEffect(() => {
    if (!userId) return;

    async function fetchUserProfile() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        const quizData = await response.json();

        setUser(quizData);
        setUserData(quizData.results);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [userId]);

  const handleButtonClick = (resultId: string) => {
    router.push(`/home/review/${resultId}`);
  };

  const goToPage = (pageNumber: number) => {
    router.push(`/home/auth/ho-so-nguoi-dung/${userId}?page=${pageNumber}`);
  };

  const itemsPerPage = 1; // Only display 1 quiz per page
  const currentPageData = userData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <Skeleton className="w-full h-64 bg-gray-300" />
          <Skeleton className="mt-4 w-full h-16 bg-gray-300" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 py-20">
        Không thể tải thông tin người dùng.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 pt-24 md:p-16 lg:p-36 space-y-8">
      {/* Hồ sơ người dùng */}
      <Card className="shadow-xl border border-gray-300 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Hồ sơ cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="shadow-lg ring-4 ring-gray-500 mb-4 md:mb-0">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <p className="text-xl md:text-3xl font-bold text-gray-900">{user.username}</p>
            <p className="text-sm md:text-lg text-gray-700">{user.email}</p>
            <p className="text-xs md:text-sm text-gray-600 mt-2">Vai trò: {user.role}</p>
            {user.class && (
              <p className="mt-2 text-xs md:text-sm text-gray-600">
                Lớp học:{" "}
                <span className="font-semibold text-gray-900">
                  {user.class.class_name}
                </span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danh sách bài kiểm tra */}
      <div>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
          Bài kiểm tra đã hoàn thành
        </h2>
        <div className="space-y-6">
          {currentPageData.length > 0 ? (
            currentPageData.map((quiz, index) => (
              <Card
                key={quiz.title || index}
                className="shadow-lg border rounded-xl bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-gray-900">
                    {quiz.quizzes.title}
                  </CardTitle>
                  <div className="mt-2 flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-gray-200 text-gray-900"
                    >
                      {quiz.quizzes.subject.subject_name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-200 text-gray-900"
                    >
                      {quiz.quizzes.class.class_name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 truncate">
                    Điểm: {quiz.score || "Chưa có điểm"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Hoàn thành vào:{" "}
                    {new Date(quiz.completed_at).toLocaleString() ||
                      "Chưa có thời gian"}
                  </p>
                  <div>
                    <Button
                      onClick={() => handleButtonClick(quiz.result_id)}
                      className="mt-4 w-full bg-gray-900 text-white hover:bg-gray-700"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">
              Không có bài kiểm tra nào đã hoàn thành.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Previous
        </Button>
        <Button
          onClick={() => goToPage(page + 1)}
          disabled={page >= Math.ceil(userData.length / itemsPerPage)}
          className="bg-gray-800 text-white hover:bg-gray-700 ml-4"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
