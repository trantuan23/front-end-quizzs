"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { fetchQuestions } from "@/app/actions/question.action";
import { addAnswers } from "@/app/actions/answers.action";
import { Answers } from "@/app/types/answers.type";



const AddAnswersForm = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answers[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách câu hỏi.",
          variant: "destructive",
        });
      }
    };
    loadQuestions();
  }, []);

  const handleChange = (
    questionId: string,
    answerIndex: number,
    field: keyof Answers,
    value: string | boolean
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId].map((answer, index) =>
        index === answerIndex
          ? {
              ...answer,
              [field]: value,
            }
          : answer
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = Object.entries(answers).map(([questionId, answers]) => ({
        questionId,
        answers,
      }));

      await addAnswers(formattedData);
      toast({
        title: "Thành công",
        description: "Đáp án đã được thêm thành công.",
        variant: "default",
      });
      router.push("/dashboard/answers");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm đáp án.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialAnswers = questions.reduce((acc, question) => {
      acc[question.id] = [
        { answer_id: "A", answer_text: "", is_correct: false, data: {} },
        { answer_id: "B", answer_text: "", is_correct: false, data: {} },
        { answer_id: "C", answer_text: "", is_correct: false, data: {} },
        { answer_id: "D", answer_text: "", is_correct: false, data: {} },
      ];
      return acc;
    }, {});
    setAnswers(initialAnswers);
  }, [questions]);

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Thêm đáp án</h2>
      {questions.map((question) => (
        <div key={question.id} className="mb-6">
          <h3 className="font-semibold mb-3 text-lg text-gray-700">
            Câu hỏi: {question.question_text}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {answers[question.id]?.map((answer, index) => (
              <div key={answer.answer_id} className="border rounded p-4">
                <h4 className="font-semibold text-gray-600 mb-2">
                  Đáp án {answer.answer_id}
                </h4>
                <Input
                  placeholder="Nội dung đáp án"
                  value={answer.answer_text}
                  onChange={(e) =>
                    handleChange(question.id, index, "answer_text", e.target.value)
                  }
                  required
                  className="mb-3"
                />
                <label className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={answer.is_conrrect}
                    onChange={(e) =>
                      handleChange(question.id, index, "is_conrrect", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Đáp án đúng
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang thêm..." : "Thêm đáp án"}
        </Button>
      </div>
    </form>
  );
};

export default AddAnswersForm;
