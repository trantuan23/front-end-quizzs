"use client";

import React, { useEffect, useState } from "react";
import { Question } from "@/app/types/question.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { deleteQuestion, fetchQuestions } from "@/app/actions/question.action";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [questionToDelete, setQuestionToDelete] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [jsonString, setJsonString] = useState<string>("");

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions();
      const questionArray = Array.isArray(response.data) ? response.data : [];

      setQuestions(questionArray);
      setTotalPages(Math.ceil(questionArray.length / questionsPerPage));

      const json = JSON.stringify(questionArray, null, 2);
      setJsonString(json);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy danh sách câu hỏi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const questionTypeMapping: Record<string, string> = {
    multiple_choice: "Chọn câu hỏi",
    drag_drop: "Kéo thả đáp án",
    audio_guess: "Nghe",
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    setDeleting(true);
    try {
      await deleteQuestion(questionToDelete.id);
      toast({
        title: "Thành công!",
        description: `Câu hỏi đã được xóa.`,
        variant: "default",
      });
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.question_id !== questionToDelete.id)
      );
      setQuestionToDelete(null);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa câu hỏi.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Link href="/dashboard/question/add">
          <Button className="flex items-center gap-2">Thêm mới</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">
                  Nội dung câu hỏi
                </th>
                <th className="border border-gray-300 px-4 py-2">Loại</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question) => (
                  <tr
                    key={question.question_id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {question.question_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {question.question_text}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {questionTypeMapping[question.question_type] ||
                        "Không xác định"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link
                        href={`/dashboard/question/update/${question.question_id}`}
                      >
                        <Button
                          className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                          variant="ghost"
                        >
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          setQuestionToDelete({
                            id: question.question_id,
                            text: question.question_text,
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
                    colSpan={5}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    Không có câu hỏi nào.
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

      {questionToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá câu hỏi "{questionToDelete.text}"?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setQuestionToDelete(null)}
                className="mr-2"
              >
                Huỷ
              </Button>
              <Button onClick={handleDeleteQuestion} className="text-red-500">
                Xoá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
