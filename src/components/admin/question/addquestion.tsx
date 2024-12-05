"use client";
import React, { useEffect, useState } from "react";
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

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.audio_guess
  );
  const [quizzId, setQuizId] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [quizList, setQuizList] = useState<Quiz[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizList(data);
      } catch (error) {
        console.error(error);
      }
    };
    getQuizzes();
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createQuestionDto: Partial<Question> = {
      question_text: questionText,
      question_type: questionType,
      quizzId: quizzId,
    
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
      router.push("/dashboard/question");
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

      {/* Chọn Quiz */}
      <div>
        <Select value={quizzId} onValueChange={setQuizId} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn quiz cho câu hỏi" />
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
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại câu hỏi" />
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
            value={mediaUrl}
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
          {loading ? "Đang thêm câu hỏi..." : "Tiếp tục và thêm câu hỏi "}
        </Button>
      </div>
    </form>
  );
};

export default AddQuestionForm;
