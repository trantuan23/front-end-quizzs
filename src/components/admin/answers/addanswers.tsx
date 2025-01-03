"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { fetchQuestions } from "@/app/actions/question.action";
import { addAnswers } from "@/app/actions/answers.action";
import { Answers } from "@/app/types/answers.type";
import { Question } from "@/app/types/question.type";
import { toast } from "@/hooks/use-toast";

const AddAnswersForm = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Answers[]>(
    Array(4).fill({
      questionId: "",
      answer_text: "",
      is_conrrect: false,
      
    })
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);
        
        // Chọn câu hỏi đầu tiên nếu chưa chọn câu hỏi nào
        if (response.data.length > 0 && !selectedQuestion) {
          setSelectedQuestion(response.data[0].question_id); // Chọn câu hỏi đầu tiên
        }
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error);
      }
    };
    loadQuestions();
  }, [selectedQuestion]);

  // Xử lý thay đổi khi chọn đáp án đúng
  const handleChange = (
    index: number,
    field: keyof Answers,
    value: string | boolean
  ) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option, i) => {
        if (i === index) {
          // Khi thay đổi "is_conrrect" của một đáp án, tắt "is_conrrect" của các đáp án khác
          return {
            ...option,
            [field]: value,
            is_conrrect: field === "is_conrrect" && value ? true : option.is_conrrect,
          };
        }
        // Khi không phải đáp án đang thay đổi, giữ nguyên giá trị is_conrrect
        return {
          ...option,
          is_conrrect: false,
        };
      });
      return updatedOptions;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!selectedQuestion) {
      alert("Vui lòng chọn câu hỏi trước khi thêm đáp án.");
      return;
    }

    if (options.every((option) => !option.answer_text.trim())) {
      alert("Vui lòng điền nội dung cho tất cả các đáp án.");
      return;
    }

    const formattedAnswers: Answers[] = options.map((option, index) => ({
      questionId: selectedQuestion,
      answer_text: `${String.fromCharCode(65 + index)}. ${option.answer_text}`,
      is_conrrect: option.is_conrrect,
      answer_id: "", 
      data: null, 
      questionts: "",
    }));

    const res = await addAnswers(formattedAnswers);

    toast({
      title: "Thành công!",
      description: res.message,
      variant: "default",
    });

    setOptions(
      Array(4).fill({
        questionId: selectedQuestion,
        answer_text: "",
        is_conrrect: false,
      })
    );
    router.push("/dashboard/answers");
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Đã xảy ra lỗi khi thêm đáp án.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Thêm đáp án cho câu hỏi
      </h2>

      {/* Chọn câu hỏi */}
      <div className="mb-6">
        <label
          htmlFor="question-select"
          className="block text-gray-700 font-medium mb-2"
        >
          Chọn câu hỏi:
        </label>
        <select
          id="question-select"
          value={selectedQuestion || ""}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50"
        >
          {questions.map((question) => (
            <option key={question.question_id} value={question.question_id}>
              {question.question_text}
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị các đáp án */}
      {options.map((option, index) => (
        <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-700">
            Đáp án {String.fromCharCode(65 + index)}
          </h4>
          <Input
            placeholder={`Nhập nội dung đáp án ${String.fromCharCode(65 + index)}`}
            value={option.answer_text}
            onChange={(e) => handleChange(index, "answer_text", e.target.value)}
            required
            className="mt-2 mb-4"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={option.is_conrrect}
              onChange={(e) =>
                handleChange(index, "is_conrrect", e.target.checked)
              }
              className="mr-2"
              disabled={options.filter((opt) => opt.is_conrrect).length >= 1 && !option.is_conrrect}
            />
            <span className="text-gray-700">Đáp án đúng</span>
          </div>
        </div>
      ))}

      <div className="text-center">
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Đang thêm..." : "Thêm đáp án"}
        </Button>
      </div>
    </form>
  );
};

export default AddAnswersForm;
