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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

const AddAnswersForm = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Answers[]>(
    Array(4).fill({
      questionId: "",
      answer_text: "",
      is_conrrect: false,
      answer_id: "",
      questionts: "",
      data: null,
    })
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isNoMoreQuestions, setIsNoMoreQuestions] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // state to control dialog visibility
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();

        const unansweredQuestions = response.data.filter(
          (question: any) => !question.answers || question.answers.length === 0
        );

        setQuestions(unansweredQuestions);

        if (unansweredQuestions.length > 0 && !selectedQuestion) {
          setSelectedQuestion(unansweredQuestions[0].question_id);
        } else if (unansweredQuestions.length === 0) {
          setIsNoMoreQuestions(true);
        }
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error);
      }
    };
    loadQuestions();
  }, [selectedQuestion]);

  const handleChange = (
    index: number,
    field: keyof Answers,
    value: boolean
  ) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
  
      if (field === "is_conrrect") {
        // Đặt tất cả đáp án khác thành false, chỉ cho phép một đáp án đúng
        updatedOptions.forEach((opt, idx) => {
          updatedOptions[idx] = {
            ...opt,
            is_conrrect: idx === index ? value : false,
          };
        });
      } else {
        // Cập nhật các trường khác ngoài `is_conrrect`
        updatedOptions[index] = {
          ...updatedOptions[index],
          [field]: value,
        };
      }
  
      return updatedOptions;
    });
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedQuestion) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng chọn câu hỏi trước khi thêm đáp án.",
          variant: "destructive",
        });
        return;
      }

      if (options.every((option) => !option.answer_text.trim())) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng điền nội dung cho tất cả các đáp án.",
          variant: "destructive",
        });
        return;
      }

      if (options.filter((option) => option.is_conrrect).length === 0) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng chọn ít nhất một đáp án đúng.",
          variant: "destructive",
        });
        return;
      }

      // Xử lý gửi dữ liệu
      const formattedAnswers = options.map((option, index) => ({
        questionId: selectedQuestion,
        answer_text: `${String.fromCharCode(65 + index)}. ${
          option.answer_text
        }`,
        is_conrrect: option.is_conrrect,
        data: null,
      }));

      const res = await addAnswers(formattedAnswers);

      toast({
        title: "Thành công!",
        description: res.message,
        variant: "default",
      });

      // Reset các đáp án
      setOptions(
        Array(4).fill({
          questionId: selectedQuestion,
          answer_text: "",
          is_conrrect: false,
        })
      );
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      return;
    }

    if (options.filter((option) => option.is_conrrect).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }

    if (isNoMoreQuestions) {
      setOpenDialog(true); // Hiển thị dialog nếu không còn câu hỏi
    } else {
      router.push("/dashboard/answers");
    }
  };

  const handleFinish = () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      return;
    }

    if (options.filter((option) => option.is_conrrect).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }

    // Sau khi kiểm tra, cho phép chuyển trang
    handleSubmit(new Event("submit"));
    router.push("/dashboard/answers");
  };

  const handleDialogCancel = () => {
    setOpenDialog(false); // Close dialog without action
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Thêm đáp án cho câu hỏi
        </h2>

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
            {questions.length === 0 ? (
              <option disabled>No more questions to add answers</option>
            ) : (
              questions.map((question) => (
                <option key={question.question_id} value={question.question_id}>
                  {question.question_text}
                </option>
              ))
            )}
          </select>
        </div>

        {options.map((option, index) => (
          <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-700">
              Đáp án {String.fromCharCode(65 + index)}
            </h4>
            <Input
              placeholder={`Nhập nội dung đáp án ${String.fromCharCode(
                65 + index
              )}`}
              value={option.answer_text}
              onChange={(e) =>
                handleChange(index, "answer_text", e.target.value)
              }
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
              />

              <span className="text-gray-700">Đáp án đúng</span>
            </div>
          </div>
        ))}

        <div className="text-center">
          <Button
            type="button"
            onClick={handleContinue}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mr-2"
          >
            Tiếp tục
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Đang thêm..." : "Thêm đáp án"}
          </Button>

          <Button
            type="button"
            onClick={handleFinish}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg ml-2"
          >
            Kết thúc
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>Không còn câu hỏi</DialogHeader>
          <p className="mb-4">
            Không còn câu hỏi nào để thêm đáp án. Bạn có muốn quay lại trang
            thêm câu hỏi không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              Hủy bỏ
            </Button>
            <Button onClick={handleContinue}>Tiếp tục</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAnswersForm;
