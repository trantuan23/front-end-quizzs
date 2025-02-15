"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Trash, ArrowLeft, ArrowRight, View } from "lucide-react";
import { Result } from "@/app/types/result.type";
import { deleteResult, fetchResults } from "@/app/actions/result.action";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

const usersPerPage = 5;

const ResultPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search
  const [totalPages, setTotalPages] = useState<number>(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const queryPage = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(queryPage ? parseInt(queryPage, 10) : 1);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        const data = await fetchResults();
        setResults(data);
        setTotalPages(Math.ceil(data.length / usersPerPage));
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error || "Không thể lấy danh sách kết quả.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  // Tính toán danh sách kết quả sau khi lọc (useMemo giúp tối ưu hiệu suất)
  const filteredResults = useMemo(() => {
    return results.filter((result) =>
      result.user?.username?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [results, debouncedSearchTerm]);

  // Xử lý phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentResults = useMemo(() => {
    return filteredResults.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredResults, currentPage]);

  const handleDelete = async (resultId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kết quả này?")) return;
    try {
      await deleteResult(resultId);
      toast({ title: "Thành công", description: "Kết quả đã được xóa.", variant: "default" });
      setResults((prev) => prev.filter((item) => item.result_id !== resultId)); // Cập nhật state tránh gọi API lại
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa kết quả.", variant: "destructive" });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Điểm</th>
                <th className="border border-gray-300 px-4 py-2">Bài kiểm tra</th>
                <th className="border border-gray-300 px-4 py-2">Người làm bài</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.length > 0 ? (
                currentResults.map((item, index) => (
                  <tr key={item.result_id} className="hover:bg-gray-100 transition-colors">
                    <td className="border border-gray-300 px-4 py-2">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{item.score}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.quizzes.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.user.username}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/home/review/${item.result_id}`}>
                        <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost">
                          <View size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(item.result_id)}
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
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="mr-2">
              <ArrowLeft size={16} />
            </Button>
            <div className="flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "secondary" : "outline"}
                  onClick={() => setCurrentPage(pageNumber)}
                  className="mx-1"
                >
                  {pageNumber}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
