import axios from "axios";

import { Result } from "../types/result.type";
import axiosInstance from "@/lib/axiosInstance";

export const fetchResults = async (): Promise<Result[]> => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results`, {
      withCredentials: true,
    });
    return res.data; 
  } catch (error: any) {
    console.error("Error fetching results:", error?.response?.data || error.message);
    throw new Error("Lấy danh sách không thành công!");
  }
};


export const deleteResult = async (resultId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/results/${resultId}`);
  } catch (error: any) {
    throw new Error('Bạn không có quyền xoá tài nguyên này !');
  }
};


