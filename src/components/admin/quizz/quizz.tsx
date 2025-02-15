"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Edit, Trash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteQuiz, fetchQuizzes } from "@/app/actions/quizz.action";

interface Quiz {
  quizz_id: string;
  title: string;
  time: number;
  subject: { subject_name: string };
  class: { class_name: string };
  user: { username: string };
}

const quizzesPerPage = 10;

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Thay vì undefined hoặc null
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quizToDelete, setQuizToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        const data = await fetchQuizzes();
        console.log("Quizzes fetched:", data); // Kiểm tra dữ liệu trả về từ API
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setQuizzes([]); // Nếu API không trả về mảng, set về []
        }
      } catch (error: any) {
        console.error("Error fetching quizzes:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể lấy danh sách quiz.",
          variant: "destructive",
        });
        setQuizzes([]); // Đảm bảo quizzes luôn là mảng
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleDelete = useCallback(async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id);
      setQuizzes((prev) =>
        prev.filter((quiz) => quiz.quizz_id !== quizToDelete.id)
      );
      toast({
        title: "Thành công",
        description: `Đã xóa bài kiểm tra: ${quizToDelete.name}`,
      });
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể xóa bài kiểm tra." });
    }
    setQuizToDelete(null);
  }, [quizToDelete, toast]);

  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [quizzes, debouncedSearch]
  );

  const currentQuizzes = useMemo(() => {
    const start = (currentPage - 1) * quizzesPerPage;
    return filteredQuizzes.slice(start, start + quizzesPerPage);
  }, [filteredQuizzes, currentPage]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách Bài Kiểm Tra</h1>
      <Input
        placeholder="Tìm kiếm bài kiểm tra..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Môn học</TableCell>
            <TableCell>Lớp</TableCell>
            <TableCell>Người tạo</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : currentQuizzes.map((quiz, index) => (
                <TableRow key={quiz.quizz_id}>
                  <TableCell>
                    {index + 1 + (currentPage - 1) * quizzesPerPage}
                  </TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.subject.subject_name}</TableCell>
                  <TableCell>{quiz.class.class_name}</TableCell>
                  <TableCell>{quiz.user.username}</TableCell>
                  <TableCell>{quiz.time} phút</TableCell>
                  <TableCell className="flex gap-2">
                    <Link href={`/dashboard/quizz/update/${quiz.quizz_id}`}>
                      <Button variant="ghost">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setQuizToDelete({ id: quiz.quizz_id, name: quiz.title })
                      }
                    >
                      <Trash size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigator.clipboard.writeText(quiz.quizz_id)
                      }
                    >
                      <Copy size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {/* Modal xác nhận xóa */}
      {quizToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa bài kiểm tra "{quizToDelete.name}"?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setQuizToDelete(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
