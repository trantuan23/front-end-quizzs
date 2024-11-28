import axios from 'axios';
import { Option } from '../types/option.type';

export const fetchOption = async (): Promise<Option[]> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/options`, {
          withCredentials: true,  
        });
      return response.data;
    } catch (error: any) {
      throw new Error('Không thể lấy danh sách');
    }
  };
  
  
export const createOption = async (newOption: Option): Promise<Option> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/options`, newOption);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      throw new Error(message);
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

export const updateOption = async (optionId: string, optionData: Option): Promise<Option> => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/options/${optionId}`, optionData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Cập nhật option thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

export const deleteOption = async (optionId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/options/${optionId}`);
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Xóa option thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Không thể xóa options.');
    }
  }
};



  