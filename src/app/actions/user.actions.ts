import { CreateUserDto, UpdateUserDto, User } from '../types/user.type';
import axiosInstance from '@/lib/axiosInstance';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error: any) {
    throw new Error('Không thể lấy danh sách người dùng.');
  }
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await axiosInstance.post(`/users`, userData);
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
    const response = await axiosInstance.put(`/users/${userId}`, userData);
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

export const IsActive = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.post(`/users/approve/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Tài khoản đã được kích hoạt: ${message} (Code: ${code})`);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình cập nhật người dùng.');
    }
  }
};

export const DeActivate = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.post(`/users/deactivate/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Tài khoản đã được vô hiệu hóa: ${message} (Code: ${code})`);
    } else {
      throw new Error('Có lỗi xảy ra trong quá trình cập nhật người dùng.');
    }
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${userId}`); // Thay đổi thành `DELETE`
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { message, code } = error.response.data;
      throw new Error(`Xóa người dùng thất bại: ${message} (Code: ${code})`);
    } else {
      throw new Error('Không thể xóa người dùng.');
    }
  }
};
