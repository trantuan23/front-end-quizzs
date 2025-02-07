"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState<number>(queryPage ? parseInt(queryPage, 10) : 1);
  const [selectedAnswer, setSelectedAnswer] = useState<Answerstype | null>(null);
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
    // Kiểm tra nếu là lần đầu tiên vào trang
    if (!queryPage && !isFirstVisit) {
      setCurrentPage(1);
      router.push('?page=1');
      setIsFirstVisit(true); // Đánh dấu là đã truy cập
    } else if (queryPage) {
      setCurrentPage(parseInt(queryPage, 10));
    }
    loadAnswers();
  }, [queryPage, router, isFirstVisit]);
    

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
        quizAnswers[0]?.question?.quizz?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([quizId, quizAnswers]) => ({ quizId, quizAnswers }));
  }, [groupedAnswersByQuiz, searchTerm]);

  const pageSize = 1;
  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);
  const currentQuizzes = filteredQuizzes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openModal = (answer: Answerstype) => {
    setSelectedAnswer(answer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnswer(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Tìm kiếm bài kiểm tra..."
          value={searchTerm ?? ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md border border-gray-300 shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Đang tải...</p>
      ) : (
        <>
          {filteredQuizzes.length === 0 ? (
            <p className="text-center text-gray-600">Không có kết quả phù hợp</p>
          ) : (
            <div>
              {currentQuizzes.map(({ quizId, quizAnswers }, quizIndex) => (
                <div key={quizId} className="mb-8 bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg text-blue-700 mb-4">
                    Bài kiểm tra {(currentPage - 1) * pageSize + quizIndex + 1}:{" "}
                    {quizAnswers[0]?.question?.quizz?.title || "Không xác định"}
                  </h2>

                  {Object.entries(
                    quizAnswers.reduce((acc, answer) => {
                      const questionId = answer.question?.question_id || "Không xác định";
                      if (!acc[questionId]) acc[questionId] = [];
                      acc[questionId].push(answer);
                      return acc;
                    }, {} as Record<string, Answerstype[]>)
                  ).map(([questionId, questionAnswers], questionIndex) => (
                    <div key={questionId} className="mb-6 pl-4">
                      <h3 className="text-md text-gray-700 mb-3">
                        Câu hỏi {questionIndex + 1}: {questionAnswers[0]?.question?.question_text || "Không xác định"}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">STT</th>
                              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Đáp án</th>
                              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Đúng/Sai</th>
                              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {questionAnswers.map((answer, index) => (
                              <tr key={answer.answer_id} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-700">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{answer.answer_text}</td>
                                <td className={`border border-gray-300 px-4 py-2 text-center text-sm font-semibold ${answer.is_correct ? "text-green-600" : "text-red-600"}`}>
                                  {answer.is_correct ? "Đúng" : "Sai"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  <Link onClick={() => localStorage.setItem("currentPageAnswersUpdate", String(currentPage))} href={`/dashboard/answers/update/${answer.answer_id}`}>
                                    <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost">
                                      <Edit size={16} />
                                    </Button>
                                  </Link>
                                  <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost" onClick={() => openModal(answer)}>
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

              <div className="flex justify-center items-center mt-6">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="mr-2">
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2">
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for explanation */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <h3 className="text-lg font-semibold mb-4">Lí do đáp án</h3>
        <textarea className="w-full h-40 p-4 border border-gray-300 rounded-md" value={selectedAnswer?.reason || "Không có lí do."} readOnly />
      </Modal>
    </div>
  );
};

export default AnswersPage;
