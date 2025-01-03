"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { fetchQuestions } from "@/app/actions/question.action";
import { updateAnswers } from "@/app/actions/answers.action"; 
import { Answers } from "@/app/types/answers.type";
import { Question } from "@/app/types/question.type";
import { toast } from "@/hooks/use-toast";

const UpdateAnswersForm = ({ answerId }: { answerId: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Answers[]>([]); // Start with an empty array for answers
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch the questions for the dropdown
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);

        if (response.data.length > 0 && !selectedQuestion) {
          setSelectedQuestion(response.data[0].question_id); // Set default to first question
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    loadQuestions();

    // Fetch the existing answer data for this specific answerId
    const fetchAnswerData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answers/${answerId}`);
        const answerData = await response.json();
        if (answerData) {
          setSelectedQuestion(answerData.questionId);
          setOptions(answerData.answers); // Populate the form with the existing answer options
        }
      } catch (error) {
        console.error("Error fetching answer data:", error);
      }
    };

    if (answerId) {
      fetchAnswerData();
    }
  }, [answerId, selectedQuestion]);

  const handleChange = (
    index: number,
    field: keyof Answers,
    value: string | boolean
  ) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [field]: value,
            is_conrrect: field === "is_conrrect" && value ? true : option.is_conrrect,
          };
        }
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
        alert("Please select a question before updating the answers.");
        return;
      }

      if (options.every((option) => !option.answer_text.trim())) {
        alert("Please fill in all the answer contents.");
        return;
      }

      const formattedAnswers: Answers[] = options.map((option, index) => ({
        questionId: selectedQuestion,
        answer_text: `${String.fromCharCode(65 + index)}. ${option.answer_text}`,
        is_conrrect: option.is_conrrect,
        answer_id: option.answer_id, // Make sure we keep the correct answer_id for update
        data: option.data, 
        questions: option.question, 
      }));

      await updateAnswers(answerId, formattedAnswers); 

      toast({
        title: "Success!",
        description: "Answers have been updated.",
        variant: "default",
      });

      router.push("/dashboard/answers");
    } catch (error) {
      console.error("Error updating answers:", error);
      alert("An error occurred while updating the answers.");
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
        Update Answer for Question
      </h2>

      {/* Question Selection */}
      <div className="mb-6">
        <label
          htmlFor="question-select"
          className="block text-gray-700 font-medium mb-2"
        >
          Select a question:
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

      {/* Answer Fields */}
      {options.map((option, index) => (
        <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-700">
            Answer {String.fromCharCode(65 + index)} - {option.answer_id}
          </h4>
          <Input
            placeholder={`Enter content for Answer ${String.fromCharCode(65 + index)}`}
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
            <span className="text-gray-700">Correct Answer</span>
          </div>
        </div>
      ))}

      <div className="text-center">
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Answer"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateAnswersForm;
