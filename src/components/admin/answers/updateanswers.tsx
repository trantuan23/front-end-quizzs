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
    is_conrrect: false,  // Đảm bảo mặc định là false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAnswerData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/answers/${answersId}`
        );
        const result = await response.json();

        if (result && result.data) {
          setAnswer({
            answer_text: result.data.answer_text,
            is_conrrect: result.data.is_conrrect || false,  // Đảm bảo is_conrrect mặc định là false nếu không có dữ liệu
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to fetch answer data.",
          variant: "destructive",
        });
        console.error("Error fetching answer data:", error);
      }
    };

    if (answersId) fetchAnswerData();
  }, [answersId]);

  const handleChange = (
    field: "answer_text" | "is_conrrect",
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
  
      // Check if is_conrrect is properly set before submitting
      if (answer.is_conrrect === undefined) {
        toast({
          title: "Error",
          description: "Please select whether the answer is correct or not.",
          variant: "destructive",
        });
        return;
      }
  
      const updateData = {
        answer_text: answer.answer_text,
        is_conrrect: answer.is_conrrect, // Use is_conrrect, not is_correct
      };
  
      const result = await updateAnswers(answersId, updateData);
  
      if (result.status === 200) {
        toast({
          title: "Success",
          description: result.data.message || "Answer has been updated successfully.",
          variant: "default",
        });
  
        router.push("/dashboard/answers");
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
          checked={answer.is_conrrect}
          onChange={(e) => handleChange("is_conrrect", e.target.checked)}
          className="w-5 h-5 text-green-600 focus:ring focus:ring-green-200 border-gray-300 rounded-md mr-2"
        />
        <label htmlFor="is-correct" className="text-gray-700">
          Mark as Correct Answer
        </label>
      </div>

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
