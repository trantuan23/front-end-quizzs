import axios from "axios";

import { Result } from "../types/result.type";

export const fetchResults = async (): Promise<Result> => {
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

