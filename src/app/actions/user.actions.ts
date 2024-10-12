import axios from 'axios';
import { CreateUserDto, UpdateUserDto, User } from '../types/user.type';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return response.data;
  } catch (error: any) {
    throw new Error('Không thể lấy danh sách người dùng.');
  }
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, userData);
    return response.data;
    
    
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      throw new Error(message);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình tạo người dùng.');
    }
  }
};

export const updateUser = async (userId: string, userData: UpdateUserDto): Promise<User> => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Cập nhật người dùng thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình cập nhật người dùng.');
    }
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Xóa người dùng thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Không thể xóa người dùng.');
    }
  }
};
