"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";
import Link from "next/link";
import { fetchAnswers } from "@/app/actions/answers.action";
import Modal from "@/components/ui/Modal.tsx";
import { Answerstype } from "@/app/types/answers.type";

const AnswersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPage = searchParams.get("page");

  const [answers, setAnswers] = useState<Answerstype[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(
    queryPage ? parseInt(queryPage, 10) : 1
  );
  const [selectedAnswer, setSelectedAnswer] = useState<Answerstype | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  const loadAnswers = async () => {
    setLoading(true);
    try {
      const response = await fetchAnswers();
      const data = response.data;
      if (Array.isArray(data)) {
        setAnswers(data);
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy danh sách đáp án.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPageAnswersUpdate");
    if (savedPage && !queryPage) {
      setCurrentPage(parseInt(savedPage, 10));
      router.push(`?page=${savedPage}`);
    } else if (queryPage) {
      setCurrentPage(parseInt(queryPage, 10));
    }
    loadAnswers();
  }, [queryPage, router]);
  

  const groupedAnswersByQuiz = useMemo(() => {
    const grouped: Record<string, Answerstype[]> = {};
    answers.forEach((answer) => {
      const quizId = answer.question?.quizz?.quizz_id || "Không xác định";
      if (!grouped[quizId]) {
        grouped[quizId] = [];
      }
      grouped[quizId].push(answer);
    });
    return grouped;
  }, [answers]);

  const filteredQuizzes = useMemo(() => {
    return Object.entries(groupedAnswersByQuiz)
      .filter(([_, quizAnswers]) =>
        quizAnswers[0]?.question?.quizz?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .map(([quizId, quizAnswers]) => ({ quizId, quizAnswers }));
  }, [groupedAnswersByQuiz, searchTerm]);

  const pageSize = 1;
  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);
  const currentQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = (answer: Answerstype) => {
    setSelectedAnswer(answer);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    localStorage.setItem("currentPageAnswersUpdate", String(newPage)); // Lưu vào localStorage
    router.push(`?page=${newPage}`);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-50 min-h-screen">
    {/* Tìm kiếm */}
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-3 sm:space-y-0">
      <Input
        placeholder="Tìm kiếm bài kiểm tra..."
        value={searchTerm ?? ""}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:max-w-md border border-gray-300 shadow-sm"
      />
    </div>

    {/* Hiển thị dữ liệu */}
    {loading ? (
      <p className="text-center text-gray-600">Đang tải...</p>
    ) : filteredQuizzes.length === 0 ? (
      <p className="text-center text-gray-600">Không có kết quả phù hợp</p>
    ) : (
      <div>
        {currentQuizzes.map(({ quizId, quizAnswers }, quizIndex) => (
          <div
            key={quizId}
            className="mb-8 bg-white shadow-md rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-lg text-blue-700 mb-4 font-semibold">
              Bài kiểm tra {(currentPage - 1) * 10 + quizIndex + 1}:{" "}
              {quizAnswers[0]?.question?.quizz?.title || "Không xác định"}
            </h2>

            {Object.entries(
              quizAnswers.reduce((acc, answer) => {
                const questionId =
                  answer.question?.question_id || "Không xác định";
                if (!acc[questionId]) acc[questionId] = [];
                acc[questionId].push(answer);
                return acc;
              }, {} as Record<string, Answerstype[]>)
            ).map(([questionId, questionAnswers], questionIndex) => (
              <div key={questionId} className="mb-6 pl-4">
                <h3 className="text-md text-gray-700 mb-3 font-medium">
                  Câu hỏi {questionIndex + 1}:{" "}
                  {questionAnswers[0]?.question?.question_text ||
                    "Không xác định"}
                </h3>

                {/* Bảng hiển thị đáp án */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm font-medium text-gray-600">
                          STT
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Đáp án
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Đúng/Sai
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionAnswers.map((answer, index) => (
                        <tr
                          key={answer.answer_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-sm text-gray-700">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm text-gray-700">
                            {answer.answer_text}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 sm:px-4 py-2 text-center text-sm font-semibold ${
                              answer.is_correct
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {answer.is_correct ? "Đúng" : "Sai"}
                          </td>
                          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                            <Link
                              onClick={() =>
                                localStorage.setItem(
                                  "currentPageAnswersUpdate",
                                  String(currentPage)
                                )
                              }
                              href={`/dashboard/answers/update/${answer.answer_id}`}
                            >
                              <Button
                                className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                                variant="ghost"
                              >
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Button
                              className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                              variant="ghost"
                              onClick={() => openModal(answer)}
                            >
                              Xem lí do
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Phân trang */}
        <div className="flex flex-wrap items-center justify-center mt-6 gap-2">
          {/* Nút Previous */}
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ArrowLeft size={16} />
          </Button>

          {/* Hiển thị số trang tối đa 5 số khi màn hình nhỏ */}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )
            .map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? "secondary" : "outline"}
                onClick={() => handlePageChange(pageNumber)}
                className="px-4"
              >
                {pageNumber}
              </Button>
            ))}

          {/* Nút Next */}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
        <p className="text-center mt-4">
          Trang {currentPage} / {totalPages}
        </p>
      </div>
    )}

    {/* Modal for explanation */}
    <Modal open={isModalOpen} onClose={closeModal}>
      <h3 className="text-lg font-semibold mb-4">Lí do đáp án</h3>
      <textarea
        className="w-full h-40 p-4 border border-gray-300 rounded-md"
        value={selectedAnswer?.reason || "Không có lí do."}
        readOnly
      />
    </Modal>
  </div>
  );
};

export default AnswersPage;
