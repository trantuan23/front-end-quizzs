import axios from 'axios';
import {  CreateQuizzrDto, Quiz, UpdateQuizDto } from '../types/quizz.type';

export const fetchQuizzes = async (): Promise<Quiz[]> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
          withCredentials: true,  
        });
      return response.data;
    } catch (error: any) {
      throw new Error('Không thể lấy danh sách quiz.');
    }
  };
  
  
export const createQuiz = async (newQuiz: CreateQuizzrDto): Promise<CreateQuizzrDto> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, newQuiz);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      throw new Error(message);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình tạo quiz.');
    }
  }
};

export const updateQuiz = async (quizId: string, quizData: UpdateQuizDto): Promise<Quiz> => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`, quizData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Cập nhật quiz thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình cập nhật quiz.');
    }
  }
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`);
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Xóa quiz thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Không thể xóa quiz.');
    }
  }
};



  