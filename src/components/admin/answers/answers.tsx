"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

import { deleteAnswers, fetchAnswers } from "@/app/actions/answers.action";
import { Answers } from "@/app/types/answers.type";

const AnswersPage = () => {
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [optionToDelete, setOptionToDelete] = useState<{
    id: string;
    text: string;
  } | null>(null);

  const answersPerPage = 5; // Số câu trả lời hiển thị mỗi trang

  // Load dữ liệu câu trả lời
  const loadAnswer = async () => {
    setLoading(true);
    try {
      const response = await fetchAnswers();
      const answersArray = Array.isArray(response.data) ? response.data : [];
      setAnswers(answersArray);
      setTotalPages(Math.ceil(answersArray.length / answersPerPage));
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy danh sách tùy chọn.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswer();
  }, []);

  const handleDelete = async () => {
    if (!optionToDelete) return;
    try {
      await deleteAnswers(optionToDelete.id);
      toast({
        title: "Thành công",
        description: `Tùy chọn "${optionToDelete.text}" đã được xóa.`,
        variant: "default",
      });
      loadAnswer();
      setOptionToDelete(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa tùy chọn.",
        variant: "destructive",
      });
    }
  };

  // Lọc câu trả lời theo từ khóa tìm kiếm
  const filteredOptions = answers.filter((answer) =>
    answer.answer_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang câu trả lời
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = filteredOptions.slice(indexOfFirstAnswer, indexOfLastAnswer);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Tìm kiếm tùy chọn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Link href="/dashboard/answers/add">
          <Button className="flex items-center gap-2">Thêm mới</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Tùy chọn</th>
                <th className="border border-gray-300 px-4 py-2">Đúng/Sai</th>
                <th className="border border-gray-300 px-4 py-2">Câu hỏi</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentAnswers.length > 0 ? (
                currentAnswers.map((answer, index) => (
                  <tr key={answer.answer_id} className="hover:bg-gray-100 transition-colors">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {(currentPage - 1) * answersPerPage + index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{answer.answer_text}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {answer.is_conrrect ? "Đúng" : "Sai"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{answer.question.question_text}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2 justify-center">
                      <Link href={`/dashboard/option/update/${answer.answer_id}`}>
                        <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          setOptionToDelete({
                            id: answer.answer_id,
                            text: answer.answer_text,
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
                  <td colSpan={5} className="text-center border border-gray-300 px-4 py-2 text-gray-500">
                    Không có kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {optionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa tùy chọn "{optionToDelete.text}" không?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOptionToDelete(null)}>
                Hủy
              </Button>
              <Button onClick={handleDelete}>Xóa</Button>
            </div>
          </div>
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="px-4 py-2"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">{`Trang ${currentPage} / ${totalPages}`}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="px-4 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AnswersPage;
