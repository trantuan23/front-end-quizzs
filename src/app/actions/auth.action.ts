import axios from "axios";
import { CreateUserDto } from "../types/user.type";

export const loginUser = async (credentials: { email: string, password: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        throw new Error(message);
      } else {
        throw new Error('Đăng nhập thất bại.');
      }
    }
  }
  
  export const sigupUser = async (userData: CreateUserDto) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        throw new Error(message);
      } else {
        throw new Error('Không thể đăng ký người dùng.');
      }
    }
  };

  
