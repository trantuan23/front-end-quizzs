"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { Quiz } from "@/app/types/quizz.type";
import { deleteQuiz, fetchQuizzes } from "@/app/actions/quizz.action";
import Link from "next/link";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [quizToDelete, setQuizToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const quizzesPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzes();
      console.log(data);
      
      setQuizzes(data);
      setTotalPages(Math.ceil(data.length / quizzesPerPage));
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

  useEffect(() => {
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
      loadQuizzes();
      setQuizToDelete(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa quiz.",
        variant: "destructive",
      });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(
    indexOfFirstQuiz,
    indexOfLastQuiz
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm quiz..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
       <Link href="/dashboard/quizz/add"> <Button className="flex items-center gap-2">Thêm mới</Button></Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Tiêu đề</th>
                <th className="border border-gray-300 px-4 py-2">Mô tả</th>
                <th className="border border-gray-300 px-4 py-2">Người thực hiện</th>
                <th className="border border-gray-300 px-4 py-2">Thời gian thực hiện</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.length > 0 ? (
                currentQuizzes.map((quizzData) => (
                  <tr
                    key={quizzData.quizz_id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {quizzData.quizz_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {quizzData.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {quizzData.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {quizzData.user.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {quizzData.time}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/dashboard/quizz/update/${quizzData.quizz_id}`}>
                      <Button
                        className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                        variant="ghost"
                      >
                        <Edit size={16} />
                      </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          setQuizToDelete({
                            id: quizzData.quizz_id,
                            name: quizzData.title,
                          })
                        }
                        className="p-2 text-red-600 hover:bg-red-100 transition-all"
                        variant="ghost"
                      >
                        <Trash size={16} />
                      </Button>
                     
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    Không có kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-center mt-4">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={
                      pageNumber === currentPage ? "secondary" : "outline"
                    }
                    onClick={() => setCurrentPage(pageNumber)}
                    className="mx-1"
                  >
                    {pageNumber}
                  </Button>
                )
              )}
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {quizToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá quiz {quizToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setQuizToDelete(null)}
                className="mr-2"
              >
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
