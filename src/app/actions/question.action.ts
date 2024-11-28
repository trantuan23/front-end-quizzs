import axios from 'axios';
import { Question } from '../types/question.type';

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

export const updateQuestion = async (questionId: string, questionData: Question): Promise<Question> => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`, questionData);
    return response.data;
  } catch (error: any) {
    throw new Error('Có lỗi xảy ra khi cập nhật câu hỏi.');
  }
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`);
  } catch (error: any) {
    throw new Error('Không thể xóa câu hỏi.');
  }
};
