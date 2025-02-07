import axios from 'axios';
import { Question, updateQuestiontype } from '../types/question.type';

export const fetchQuestions = async (): Promise<Question> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/questions`, { withCredentials: true });
    return response.data
  } catch (error: any) {
    throw new Error('Không thể lấy danh sách câu hỏi.');
  }
};

export const createQuestion = async (newQuestion: Question): Promise<Question> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/questions`, newQuestion);
    return response.data;
  } catch (error: any) {
    throw new Error('Có lỗi xảy ra khi thêm câu hỏi.');
  }
};

export const updateQuestion = async (
  questionId: string,
  questionData: updateQuestiontype
): Promise<{ message: string }> => {
  // Giả sử đây là hàm gọi API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return response.json();
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`);
  } catch (error: any) {
    throw new Error('Không thể xóa câu hỏi.');
  }
};
