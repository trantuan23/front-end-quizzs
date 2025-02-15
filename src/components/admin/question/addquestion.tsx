"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { fetchQuizzes } from "@/app/actions/quizz.action";
import { createQuestion } from "@/app/actions/question.action";
import { Question, QuestionType } from "@/app/types/question.type";
import { Quiz } from "@/app/types/quizz.type";
import { RootState } from "@/store/store";

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType | "">("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const quizzId = useSelector((state: RootState) => state.quiz.quizId);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizList(data);
        // Nếu không có quizzId từ Redux, chọn quiz đầu tiên trong danh sách
        if (!quizzId && data.length > 0) {
          setSelectedQuizId(data[0].quizz_id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getQuizzes();
  }, [quizzId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalQuestionType =
      questionType || QuestionType.multiple_choice;

    const finalQuizId = quizzId || selectedQuizId; // Sử dụng quizzId từ Redux hoặc từ select

    const createQuestionDto: Partial<Question> = {
      question_text: questionText,
      question_type: finalQuestionType,
      quizzId: finalQuizId || '', 
    };

    if (mediaUrl) {
      createQuestionDto.media_url = mediaUrl;
    }

    try {
      const response = await createQuestion(createQuestionDto as Question);
      toast({
        title: "Thêm câu hỏi thành công",
        description: `Câu hỏi "${response.data.question_text}" đã được thêm.`,
        variant: "default",
      });
      router.push("/dashboard/answers/add");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi không xác định xảy ra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
    >
      <h1 className="text-xl font-semibold text-center">
        Thêm Câu Hỏi cho bài kiểm tra
      </h1>

      {/* Hiển thị quiz nếu có quizzId từ Redux hoặc chọn quiz từ select */}
      <div>
        <Select
          value={quizzId || selectedQuizId || ""}
          onValueChange={(value) => setSelectedQuizId(value || null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn bài kiểm tra" />
          </SelectTrigger>
          <SelectContent>
            {quizList.map((quiz) => (
              <SelectItem key={quiz.quizz_id} value={quiz.quizz_id}>
                {quiz.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nội dung câu hỏi */}
      <div>
        <Input
          placeholder="Nội dung câu hỏi"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Loại câu hỏi */}
      <div>
        <Select
          value={questionType}
          onValueChange={(value) => setQuestionType(value as QuestionType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại câu hỏi (mặc định: Trắc nghiệm)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={QuestionType.audio_guess}>
              Đoán âm thanh
            </SelectItem>
            <SelectItem value={QuestionType.multiple_choice}>
              Trắc nghiệm
            </SelectItem>
            <SelectItem value={QuestionType.drag_drop}>Kéo thả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* URL Media */}
      {questionType === QuestionType.audio_guess && (
        <div>
          <Input
            placeholder="URL media (nếu có)"
            value={mediaUrl ?? ""}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Nút thêm */}
      <div className="flex justify-between gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full hover:bg-slate-400"
        >
          {loading ? "Đang thêm câu hỏi..." : "Tiếp tục và thêm câu hỏi"}
        </Button>
      </div>
    </form>
  );
};

export default AddQuestionForm;
