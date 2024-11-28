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
import { updateQuestion } from "@/app/actions/question.action";
import { fetchQuizzes } from "@/app/actions/quizz.action";
import { Question, QuestionType } from "@/app/types/question.type";
import { Quiz } from "@/app/types/quizz.type";

const UpdateQuestionForm = ({ questionId }: { questionId: string }) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.audio_guess);
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [quizz_id, setQuizId] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizList(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quizzes:", error);
      }
    };

    const getQuestion = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`
          );
          if (!response.ok) throw new Error("Không thể tải dữ liệu câu hỏi.");
      
          const data: Question = await response.json();
      
          // Đảm bảo dữ liệu hợp lệ trước khi gán
          const quiz = data?.quizz || {};
          const parsedAnswers = data?.answers?.split(",") || ["", "", "", ""];
      
          setQuestionText(data?.question_text || "");
          setQuestionType(data?.question_type || QuestionType.audio_guess);
          setQuizId(quiz?.quizz_id || "");
          setMediaUrl(data?.media_url || "");
          setAnswers({
            A: parsedAnswers[0] || "",
            B: parsedAnswers[1] || "",
            C: parsedAnswers[2] || "",
            D: parsedAnswers[3] || "",
          });
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Không thể tải dữ liệu câu hỏi.",
            variant: "destructive",
          });
          console.error(error);
        }
      };
      

    getQuizzes();
    getQuestion();
  }, [questionId]);

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedAnswers = Object.values(answers).join(",");

    const updateQuestionDto: Question = {
      question_text: questionText,
      question_type: questionType,
      quizzId: quizz_id,
      media_url: mediaUrl,
      answers: formattedAnswers,
    };

    try {
      const response = await updateQuestion(questionId, updateQuestionDto);
      toast({
        title: "Cập nhật thành công",
        description: `Câu hỏi "${response.question_text}" đã được cập nhật.`,
        variant: "default",
      });
      router.push("/dashboard/question");
    } catch (error: any) {
      const errorMessage = error.message || "Có lỗi không xác định xảy ra.";
      toast({
        title: "Lỗi",
        description: errorMessage,
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
      <h1 className="text-xl font-semibold text-center">Cập Nhật Câu Hỏi</h1>

      {/* Chọn Quiz */}
      <div>
        <Select value={quizz_id} onValueChange={setQuizId} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn quiz cho câu hỏi" />
          </SelectTrigger>
          <SelectContent>
            {quizList.map((item) => (
              <SelectItem key={item.quizz_id} value={item.quizz_id}>
                {item.title || "Quiz không tên"}
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

      {/* Các đáp án */}
      <div className="grid grid-cols-2 gap-4">
        {["A", "B", "C", "D"].map((key) => (
          <Input
            key={key}
            placeholder={`Đáp án ${key}`}
            value={answers[key]}
            onChange={(e) => handleAnswerChange(key, e.target.value)}
            className="w-full"
          />
        ))}
      </div>

      {/* Nút cập nhật */}
      <div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Đang cập nhật..." : "Cập nhật câu hỏi"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateQuestionForm;
