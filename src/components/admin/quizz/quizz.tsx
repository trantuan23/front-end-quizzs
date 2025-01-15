"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight, Search, Copy } from "lucide-react";
import { Quiz } from "@/app/types/quizz.type";
import { deleteQuiz, fetchQuizzes } from "@/app/actions/quizz.action";
import Link from "next/link";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [quizToDelete, setQuizToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;

  useEffect(() => {
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
    loadQuizzes();
  }, []);

  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id);
      toast({
        title: "Thành công",
        description: `Quiz ${quizToDelete.name} đã được xóa.`,
        variant: "default",
      });
      setQuizzes(quizzes.filter((quiz) => quiz.quizz_id !== quizToDelete.id));
      setQuizToDelete(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa quiz.",
        variant: "destructive",
      });
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Đã sao chép",
      description: `ID ${id} đã được sao chép ID.`,
      variant: "default",
    });
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const currentQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  );

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Tìm kiếm quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Link href="/dashboard/quizz/add">
          <Button className="w-full sm:w-auto">Thêm mới</Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <div>
          {/* Table for medium to large devices */}
          <div className="hidden sm:block">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="">
                  <th className="border px-4 py-2 text-left">STT</th>
                  <th className="border px-4 py-2 text-left">Tiêu đề</th>
                  <th className="border px-4 py-2 text-left">Môn học</th>
                  <th className="border px-4 py-2 text-left">Lớp</th>
                  <th className="border px-4 py-2 text-left">Actor</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentQuizzes.length > 0 ? (
                  currentQuizzes.map((quiz, index) => (
                    <tr key={quiz.quizz_id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">
                        {index + 1 + (currentPage - 1) * quizzesPerPage}
                      </td>
                      <td className="border px-4 py-2">{quiz.title}</td>
                      <td className="border px-4 py-2">
                        {quiz.subject.subject_name}
                      </td>
                      <td className="border px-4 py-2">
                        {quiz.class.class_name}
                      </td>
                      <td className="border px-4 py-2">{quiz.user.username}</td>
                      <td className="border px-4 py-2">{quiz.time}</td>
                      <td className="border px-4 py-2 flex gap-2">
                        <Link
                          href={`/dashboard/quizz/update/${quiz.quizz_id}`}
                        >
                          <Button variant="ghost">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setQuizToDelete({
                              id: quiz.quizz_id,
                              name: quiz.title,
                            })
                          }
                        >
                          <Trash size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleCopyId(quiz.quizz_id)}
                        >
                          <Copy size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center border px-4 py-2">
                      Không có kết quả.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for small devices */}
          <div className="block sm:hidden">
            {currentQuizzes.length > 0 ? (
              currentQuizzes.map((quiz) => (
                <div
                  key={quiz.quizz_id}
                  className="bg-white shadow rounded-lg mb-4 p-4"
                >
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <p className="text-gray-500">
                    Môn học: {quiz.subject.subject_name}
                  </p>
                  <p className="text-gray-500">Lớp: {quiz.class.class_name}</p>
                  <p className="text-gray-500">Actor: {quiz.user.username}</p>
                  <p className="text-gray-500">Time: {quiz.time}</p>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/quizz/update/${quiz.quizz_id}`}>
                      <Button variant="ghost">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setQuizToDelete({
                          id: quiz.quizz_id,
                          name: quiz.title,
                        })
                      }
                    >
                      <Trash size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleCopyId(quiz.quizz_id)}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Không có kết quả.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              <ArrowLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={page === currentPage ? "secondary" : "outline"}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {quizToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá quiz {quizToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setQuizToDelete(null)} variant="outline">
                Huỷ
              </Button>
              <Button onClick={handleDelete} className="text-red-500">
                Xoá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
