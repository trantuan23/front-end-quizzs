import axios from "axios";
import { Answers } from "../types/answers.type";

export const fetchAnswers = async (): Promise<Answers[]> => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/answers`, {
          withCredentials: true,  
        });
        return res.data;
    } catch (error: any) {
        console.error("Error fetching subjects:", error?.response?.data || error.message);
        throw new Error("Lấy danh sách không thành công!");
    }
};

export const addAnswers = async (subjectData: Omit<Answers, "subject_id">) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/answers`, subjectData, {
          withCredentials: true,  
        });
        return response.data;  
    } catch (error: any) {
        console.error("Error adding subject:", error?.response?.data || error.message);
        throw new Error("Thêm môn học không thành công!");
    }
};

export async function updateAnswers(subjectId: string, subjectData: Omit<Answers, "subject_id">): Promise<{ status: number; data: { message: string } }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answers/${subjectId}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      });
      
  
      return {
        status: response.status,
        data: await response.json(),
      };
    } catch (error) {
      console.error("Error updating class:", error);
      throw new Error("Could not update class");
    }
  }


  export async function deleteAnswers(subjectId: string): Promise<{ status: number; data: { message: string } }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Kiểm tra xem phản hồi có dữ liệu không trước khi phân tích JSON
      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: "Deleted successfully" }; // Đặt một giá trị mặc định nếu phản hồi không có JSON hợp lệ
      }
  
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("Error deleting class:", error);
      throw new Error("Could not delete class");
    }
  }
  



