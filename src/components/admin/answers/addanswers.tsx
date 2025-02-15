"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchQuestions } from "@/app/actions/question.action";
import { addAnswers } from "@/app/actions/answers.action";
import { Answerstype } from "@/app/types/answers.type";
import { Question } from "@/app/types/question.type";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { clearQuizId } from "@/store/slices/quizSlice";


const AddAnswersForm = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Answerstype[]>(
    Array(4).fill({
      questionId: "",
      answer_text: "",
      is_correct: false,
      answer_id: "",
      questionts: "",
      data: null,
      reason: "", // Thêm trường lý do
    })
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isNoMoreQuestions, setIsNoMoreQuestions] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // state to control dialog visibility
  const router = useRouter();
  const dispatch = useDispatch();

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

  const handleChange = (index: number, field: keyof Answerstype, value: any) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];

      if (field === "is_correct") {
        // Đặt tất cả đáp án khác thành false, chỉ cho phép một đáp án đúng
        updatedOptions.forEach((opt, idx) => {
          updatedOptions[idx] = {
            ...opt,
            is_correct: idx === index ? value : false,
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

      if (options.filter((option) => option.is_correct).length === 0) {
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
        is_correct: option.is_correct,
        data: option.reason, // Gửi lý do vào cơ sở dữ liệu
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
          reason: "", // Reset lý do
        })
      );
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      return;
    }

    if (options.filter((option) => option.is_correct).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Xử lý gửi dữ liệu
      const formattedAnswers = options.map((option, index) => ({
        questionId: selectedQuestion,
        answer_text: `${String.fromCharCode(65 + index)}. ${
          option.answer_text
        }`,
        is_correct: option.is_correct,
        reason: option.reason, // Gửi lý do vào cơ sở dữ liệu
      }));

      const res = await addAnswers(formattedAnswers);

      toast({
        title: "Thành công!",
        description: res.message,
        variant: "default",
      });

      // Reset các đáp án để chuẩn bị cho câu hỏi tiếp theo
      setOptions(
        Array(4).fill({
          questionId: selectedQuestion,
          answer_text: "",
          is_correct: false,
          reason: "", // Reset lý do
        })
      );

      // Kiểm tra nếu không còn câu hỏi nào chưa có đáp án
      if (isNoMoreQuestions) {
        setOpenDialog(true); // Hiển thị dialog nếu không còn câu hỏi
      } else {
        router.push("/dashboard/question/add"); // Chuyển hướng về trang Add Questions
      }
    } catch (error) {
      console.error("Lỗi khi thêm đáp án:", error);
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi thêm đáp án. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  

  const handleFinish = async () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      
      return;
    }
  
    if (options.filter((option) => option.is_correct).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }
  
   
  
    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as unknown as React.FormEvent;
  
    // Sau khi kiểm tra, gọi handleSubmit để gửi dữ liệu
    await handleSubmit(event);
    dispatch(clearQuizId()); 
    // Chuyển hướng tới trang answers sau khi đã submit thành công
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
            value={selectedQuestion ?? ""}
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

        <div className="grid gap-6">
          {options.map((option, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="font-medium">{`Đáp án ${String.fromCharCode(
                65 + index
              )}`}</label>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={(e) =>
                    handleChange(index, "is_correct", e.target.checked)
                  }
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={option.answer_text}
                  onChange={(e) =>
                    handleChange(index, "answer_text", e.target.value)
                  }
                  placeholder={`Nội dung đáp án ${String.fromCharCode(
                    65 + index
                  )}`}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                />
              </div>
              {option.is_correct && (
                <textarea
                  placeholder="Lý do đáp án đúng"
                  value={option.reason || ""}
                  onChange={(e) =>
                    handleChange(index, "reason", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg bg-gray-50"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleContinue}
            disabled={loading}
          >
            Tiếp tục
          </Button>
          <Button type="button" onClick={handleFinish} disabled={loading}>
            Hoàn thành
          </Button>
        </div>
      </form>

      {/* Dialog hiển thị khi không còn câu hỏi nào */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-xl font-semibold">Không còn câu hỏi nào</h2>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogCancel}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAnswersForm;
