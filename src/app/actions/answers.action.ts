  import axios from "axios";
  import { Answers } from "../types/answers.type";

  export const fetchAnswers = async (): Promise<Answers> => {
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

  export const addAnswers = async (answers: Answers[]): Promise<any> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/answers`,
        answers,
        {
          withCredentials: true, // Thêm nếu API yêu cầu xác thực
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding answers:", error?.response?.data || error.message);
      throw new Error("Thêm đáp án không thành công!");
    }
  };
  
  


  export async function updateAnswers(answerId: string, answerData: Omit<Answers, "answer_id">): Promise<{ status: number; data: { message: string } }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answers/${answerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answerData),
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

  




