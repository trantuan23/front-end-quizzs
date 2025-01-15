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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions();
      const questionArray = Array.isArray(response.data) ? response.data : [];
      setQuestions(questionArray);
      // Nhóm các câu hỏi theo bài quiz
      const groupedByQuiz = questionArray.reduce<Record<string, Question[]>>(
        (acc, question) => {
          const quizTitle = question.quizz.title || "Không xác định";
          if (!acc[quizTitle]) {
            acc[quizTitle] = [];
          }
          acc[quizTitle].push(question);
          return acc;
        },
        {}
      );
      // Lưu trữ số lượng bài quiz có trong hệ thống
      setTotalPages(Math.ceil(Object.keys(groupedByQuiz).length / 1)); // Mỗi trang hiển thị một quiz
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

  useEffect(() => {
    loadQuestions();
  }, []);

  // Nhóm câu hỏi theo bài quiz
  const groupedQuestions = questions.reduce<Record<string, Question[]>>(
    (acc, question) => {
      const quizTitle = question.quizz.title || "Không xác định";
      if (!acc[quizTitle]) {
        acc[quizTitle] = [];
      }
      acc[quizTitle].push(question);
      return acc;
    },
    {}
  );

  const filteredQuestions = searchTerm
    ? Object.entries(groupedQuestions).filter(([title, _]) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Object.entries(groupedQuestions);

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * 1,  // Mỗi trang chỉ hiển thị 1 quiz
    currentPage * 1
  );

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleOptionChange = (questionId: string, option: string) => {
    console.log(`Question ${questionId}: Selected option - ${option}`);
    // Xử lý việc lưu câu trả lời của người dùng
  };

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
          {paginatedQuestions.length > 0 ? (
            paginatedQuestions.map(([title, questions], index) => (
              <div key={title} className="mb-6">
                <h2 className="text-lg mb-2">
                  {index + 1} : Tên bài kiểm tra : {title}
                </h2>
                <table className="min-w-full text-center border-collapse border border-gray-300">
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
                    {questions.map((question, index) => (
                      <tr
                        key={question.question_id}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {question.question_text}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                        {question.question_type === "multiple_choice" && (
                            <div className="mt-2">
                              <strong>Chọn đáp án</strong>
                            </div>
                          )}
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
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>Không có kết quả phù hợp</p>
          )}

          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="text-blue-500"
            >
              <ArrowLeft size={16} />
            </Button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-blue-500"
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
