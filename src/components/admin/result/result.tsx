"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Trash, ArrowLeft, ArrowRight, View } from "lucide-react";
import { Result } from "@/app/types/result.type";
import { fetchResults } from "@/app/actions/result.action";

const ResultPage = () => {
  const [result, setResult] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 3;
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadResult = async () => {
    setLoading(true);
    try {
      const data = await fetchResults();

      setResult(data);
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

  useEffect(() => {
    loadResult();
  }, []);

  const filteredUsers = result.filter((result) =>
    result.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Link href="/dashboard/subject/add">
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
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Điểm</th>
                <th className="border border-gray-300 px-4 py-2">
                  Bài kiểm tra
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Người làm bài
                </th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((item, index) => (
                  <tr
                    key={item.result_id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.score}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.quizzes.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.user.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/home/review/${item.result_id}`}>
                        <Button
                          className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                          variant="ghost"
                        >
                          <View size={16} />
                        </Button>
                      </Link>
                      <Button
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
    </div>
  );
};

export default ResultPage;
