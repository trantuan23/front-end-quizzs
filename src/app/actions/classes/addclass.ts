import axios from "axios";
import { Class } from "../../types/class.type";

export const addClass = async (classData: Omit<Class, "class_id">) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/classes`, classData, {
    withCredentials: true, 
  });
  
  return response;
};
