import axiosInstance from "@/lib/axiosInstance";

export interface BackupFile {
  fileName: string;
  createdAt: string; // ISO format

}

export const fetchBackupFiles = async (): Promise<BackupFile[]> => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/backup/list`);
    return response.data.files;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách backup:', error);
    return [];
  }
};
  
  export const createBackup = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/backup/create`);
      return response.data.message;
    } catch (error) {
      console.error('Backup thất bại:', error);
      throw new Error('Backup thất bại.');
    }
  };
  
  export const restoreBackup = async (backupFile: string): Promise<string> => {
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/backup/restore`, { backupFile });
      return response.data.message;
    } catch (error) {
      console.error('Khôi phục thất bại:', error);
      throw new Error('Khôi phục thất bại.');
    }
  };
  
  