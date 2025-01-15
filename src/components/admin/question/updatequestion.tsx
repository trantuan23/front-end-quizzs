"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  QuestionType, updateQuestiontype } from "@/app/types/question.type";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { updateQuestion } from "@/app/actions/question.action";

const UpdateQuestionPage = ({ questionId }: { questionId: string }) => {
  const [questionData, setQuestionData] = useState<updateQuestiontype>({
    question_text: "",
    question_type: QuestionType ,
    media_url: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch question data");
        }
        const data = await response.json();
        setQuestionData({
          question_text: data.data.question_text,
          question_type: data.data.question_type,
          media_url: data.data.media_url || null

        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu câu hỏi.",
          variant: "default",
        });
      }
    };

    fetchQuestionData();
  }, [questionId]);

  const handleUpdateQuestion = async () => {
    if (!questionData.question_text) {
      toast({
        title: "Lỗi",
        description: "Nội dung câu hỏi là bắt buộc",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await updateQuestion(questionId , questionData);
      
      toast({
        title: "Thành công!",
        description: res.message,
        variant: "default",
      });
      router.push("/dashboard/question");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật câu hỏi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cập nhật câu hỏi</h2>

      {/* Nội dung câu hỏi */}
      <div className="mb-4">
        <Input
          placeholder="Nội dung câu hỏi"
          value={questionData.question_text}
          onChange={(e) =>
            setQuestionData({ ...questionData, question_text: e.target.value })
          }
        />
      </div>

      {/* Loại câu hỏi */}
      <div className="mb-4">
        <Select
          value={questionData.question_type}
          onValueChange={(value) =>
            setQuestionData({ ...questionData, question_type: value as QuestionType })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại câu hỏi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={QuestionType.audio_guess}>Đoán âm thanh</SelectItem>
            <SelectItem value={QuestionType.multiple_choice}>Trắc nghiệm</SelectItem>
            <SelectItem value={QuestionType.drag_drop}>Kéo thả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Media URL */}
      {questionData.question_type === QuestionType.audio_guess && (
        <div className="mb-4">
          <Input
            placeholder="URL media (nếu có)"
            value={questionData.media_url}
            onChange={(e) =>
              setQuestionData({ ...questionData, media_url: e.target.value })
            }
          />
        </div>
      )}

      {/* Nút hành động */}
      <div className="mt-4 flex justify-between space-x-4">
        <Button onClick={handleUpdateQuestion} disabled={loading}>
          {loading ? "Đang tải lên ..." : "Cập nhật"}
        </Button>
        <Link href="/dashboard/question">
          <Button variant="destructive">Quay lại</Button>
        </Link>
      </div>
    </div>
  );
};

export default UpdateQuestionPage;
