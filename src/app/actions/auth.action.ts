import axios from "axios";
import { CreateUserDto } from "@/app/types/user.type";

export const loginUser = async (credentials: { email: string, password: string }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Đăng nhập thất bại.");
    } else {
      throw new Error("Lỗi kết nối đến server.");
    }
  }
};

export const signupUser = async (userData: CreateUserDto) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Không thể đăng ký.");
    } else {
      throw new Error("Lỗi kết nối đến server.");
    }
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,{email} );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra.");
  }
};

export const verifyOtp = async (email: string, otpCode: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, { email, otpCode });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Mã OTP không hợp lệ.");
  }
};

export const resetPassword = async (email: string, otpCode: string, newPassword: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      email,
      otpCode,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra.");
  }
};
