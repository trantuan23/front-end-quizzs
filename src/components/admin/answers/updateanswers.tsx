"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { updateAnswers } from "@/app/actions/answers.action";

const UpdateAnswersForm = ({ answersId }: { answersId: string }) => {
  const [answer, setAnswer] = useState({
    answer_text: "",
    is_correct: false,
    reason: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true); // Trạng thái tải dữ liệu
  const router = useRouter();

  useEffect(() => {
    const fetchAnswerData = async () => {
      try {
        setFetching(true); // Bắt đầu tải dữ liệu
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/answers/${answersId}`
        );
        const result = await response.json();

        if (result && result.data) {
          setAnswer({
            answer_text: result.data.answer_text || "",
            is_correct: result.data.is_correct || false,
            reason: result.data.reason || "",
          });
        } else {
          throw new Error("No data found.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to fetch answer data.",
          variant: "destructive",
        });
        console.error("Error fetching answer data:", error);
      } finally {
        setFetching(false); // Kết thúc tải dữ liệu
      }
    };

    if (answersId) fetchAnswerData();
  }, [answersId]);

  const handleChange = (
    field: "answer_text" | "is_correct" | "reason",
    value: string | boolean
  ) => {
    setAnswer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!answer.answer_text.trim()) {
        toast({
          title: "Error",
          description: "Answer text cannot be empty.",
          variant: "destructive",
        });
        return;
      }

      if (answer.is_correct && !answer.reason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a reason for marking this answer as correct.",
          variant: "destructive",
        });
        return;
      }

      const currentPage = localStorage.getItem("currentPageAnswerUpdate") || "1";
      router.push(`/dashboard/answers?page=${currentPage}`);

      const updateData = {
        answer_text: answer.answer_text.trim(),
        is_correct: answer.is_correct,
        reason: answer.reason.trim(),
      };

      const result = await updateAnswers(answersId, updateData);

      if (result.status === 200) {
        toast({
          title: "Success",
          description: result.data.message || "Answer updated successfully.",
          variant: "default",
        });

        const currentPage = localStorage.getItem("currentPageAnswerUpdate") || "1";

        router.push(`/dashboard/answers?page=${currentPage}`);
      } else {
        throw new Error(result.data.message || "Update failed!");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating the answer.",
        variant: "destructive",
      });
      console.error("Error updating answer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Update Answer
      </h2>

      {/* Answer Text */}
      <div className="mb-6">
        <label
          htmlFor="answer-text"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Answer Text:
        </label>
        <Input
          id="answer-text"
          placeholder="Enter answer text"
          value={answer.answer_text}
          onChange={(e) => handleChange("answer_text", e.target.value)}
          className="border-gray-300 focus:ring focus:ring-green-200 focus:border-green-400"
          required
        />
      </div>

      {/* Correct Answer */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="is-correct"
          checked={answer.is_correct}
          onChange={(e) => handleChange("is_correct", e.target.checked)}
          className="w-5 h-5 text-green-600 focus:ring focus:ring-green-200 border-gray-300 rounded-md mr-2"
        />
        <label htmlFor="is-correct" className="text-gray-700">
          Mark as Correct Answer
        </label>
      </div>

      {/* Reason */}
      {answer.is_correct && (
        <div className="mb-6">
          <label
            htmlFor="reason"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Reason:
          </label>
          <textarea
            id="reason"
            placeholder="Enter reason for correctness"
            value={answer.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="border-gray-300 focus:ring focus:ring-green-200 focus:border-green-400 w-full p-2 rounded-md"
            rows={5}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          {loading ? "Updating..." : "Update Answer"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateAnswersForm;
