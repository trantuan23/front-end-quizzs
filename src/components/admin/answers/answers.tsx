"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { deleteAnswers, fetchAnswers } from "@/app/actions/answers.action";
import { Answers } from "@/app/types/answers.type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AnswersPage = () => {
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [answersPerPage] = useState<number>(5);
  const [optionToDelete, setOptionToDelete] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); // Quản lý trạng thái modal

  const loadAnswer = async () => {
    setLoading(true);
    try {
      const response = await fetchAnswers();
      const data = response.data 
      
      // Assuming response.data contains the answers array
      const answersArray = Array.isArray(data) ? data : [];
      setAnswers(answersArray);
      
      // If there are no answers in the current page and it's greater than 1, go back to the previous page
      const indexOfLastAnswer = currentPage * answersPerPage;
      const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
      const currentAnswers = answersArray.slice(indexOfFirstAnswer, indexOfLastAnswer);
      
      if (currentAnswers.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
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
  
    setLoading(true); // Bắt đầu trạng thái "đang xử lý"
    try {
      const result = await deleteAnswers(optionToDelete.id);
      toast({
        title: "Thành công",
        description: result.message,
        variant: "default",
      });
      loadAnswer(); // Tải lại danh sách
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa tùy chọn.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false); // Đóng modal
      setOptionToDelete(null); // Reset lựa chọn
    }
  };
  

  const filteredOptions = answers.filter((answer) =>
    answer.answer_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOptions.length / answersPerPage);
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = filteredOptions.slice(indexOfFirstAnswer, indexOfLastAnswer);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Tìm kiếm tùy chọn..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
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
    currentAnswers.map((item, index) => (
      <tr key={item.answer_id} className="hover:bg-gray-100 transition-colors">
        <td className="border border-gray-300 px-4 py-2 text-center">
          {(currentPage - 1) * answersPerPage + index + 1}
        </td>
        <td className="border border-gray-300 px-4 py-2">{item.answer_text}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          {item.is_conrrect ? "Đúng" : "Sai"}
        </td>
        <td className="border border-gray-300 px-4 py-2">
          {item.question?.question_text || "Không có câu hỏi"}
        </td>
        <td className="border border-gray-300 px-4 py-2 flex items-center gap-2 justify-center">
          <Link href={`/dashboard/answers/update/${item.answer_id}`}>
            <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost">
              <Edit size={16} />
            </Button>
          </Link>
          <Button
            onClick={() => {
              setOptionToDelete({
                id: item.answer_id,
                text: item.answer_text,
              });
              setDeleteModalOpen(true);
            }}
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

      {/* Modal Xác nhận Xóa */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn xóa tùy chọn <strong>{optionToDelete?.text}</strong> không?
          </p>
          <DialogFooter>
            <Button onClick={() => setDeleteModalOpen(false)} variant="outline">
              Hủy
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnswersPage;
