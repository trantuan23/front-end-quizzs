"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { Option } from "@/app/types/option.type";
import { deleteOption, fetchOption } from "@/app/actions/option.action";
import Link from "next/link";

const OptionPage = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [optionToDelete, setOptionToDelete] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const optionsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const data = await fetchOption();
      // Kiểm tra xem dữ liệu có phải là một mảng không
      if (Array.isArray(data)) {
        setOptions(data);
        setTotalPages(Math.ceil(data.length / optionsPerPage));
      } else {
        setOptions([]); // Đặt giá trị rỗng nếu không phải là mảng
        toast({
          title: "Lỗi",
          description: "Dữ liệu không hợp lệ.",
          variant: "destructive",
        });
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
    loadOptions();
  }, []);

  const handleDelete = async () => {
    if (!optionToDelete) return;
    try {
      await deleteOption(optionToDelete.id);
      toast({
        title: "Thành công",
        description: `Tùy chọn ${optionToDelete.text} đã được xóa.`,
        variant: "default",
      });
      loadOptions();
      setOptionToDelete(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa tùy chọn.",
        variant: "destructive",
      });
    }
  };

  const filteredOptions = options.filter((option) =>
    option.option_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOption = currentPage * optionsPerPage;
  const indexOfFirstOption = indexOfLastOption - optionsPerPage;
  const currentOptions = filteredOptions.slice(
    indexOfFirstOption,
    indexOfLastOption
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm tùy chọn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Link href="/dashboard/option/add">
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
                <th className="border border-gray-300 px-4 py-2">Tùy chọn</th>
                <th className="border border-gray-300 px-4 py-2">Đúng/Sai</th>
                <th className="border border-gray-300 px-4 py-2">ID Câu hỏi</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentOptions.length > 0 ? (
                currentOptions.map((optionData) => (
                  <tr
                    key={optionData.option_id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {optionData.option_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {optionData.option_text}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {optionData.is_correct ? "Đúng" : "Sai"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {optionData.questionId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/dashboard/option/update/${optionData.option_id}`}>
                        <Button
                          className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                          variant="ghost"
                        >
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          setOptionToDelete({
                            id: optionData.option_id,
                            text: optionData.option_text,
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
                  <td colSpan={5} className="text-center border border-gray-300 px-4 py-2">
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

      {optionToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá tùy chọn {optionToDelete.text}?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOptionToDelete(null)}
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

export default OptionPage;
