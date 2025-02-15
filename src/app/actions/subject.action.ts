import axios from "axios";
import { Subject } from "../types/subject.type";

export const fetchSubject = async (): Promise<Subject[]> => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, {
          withCredentials: true,  
        });
        return res.data;
    } catch (error: any) {
        console.error("Error fetching subjects:", error?.response?.data || error.message);
        throw new Error("Lấy danh sách không thành công!");
    }
};


export const addSubject = async (subjectData: Omit<Subject, "subject_id">) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, subjectData, {
          withCredentials: true,  
        });
        return response.data;  
    } catch (error: any) {
        throw new Error("Thêm môn học không thành công!");
    }
};


export async function updateSubject(subjectId: string, subjectData: Omit<Subject, "subject_id">): Promise<{ status: number; data: { message: string } }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`, {
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


  export async function deleteSubject(subjectId: string): Promise<{ status: number; data: { message: string } }> {
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
  



