"use client";
import {
  BackupFile,
  createBackup,
  fetchBackupFiles,
  restoreBackup,
} from "@/app/actions/backup.action";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [operation, setOperation] = useState<"backup" | "restore" | null>(null);

  useEffect(() => {
    loadBackupFiles();
  }, []);

  const loadBackupFiles = async () => {
    try {
      const response = await fetchBackupFiles();
      setBackups(response || []);
    } catch (error) {
      toast({
        title: "Thất bại !",
        description: "Không thể lấy danh sách file backup !",
        variant: "destructive",
      });
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    setOperation("backup");
    setProgress(0);

    try {
      for (let i = 10; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress(i);
      }

      await createBackup();
      toast({ title: "Thành công !", description: "Sao lưu thành công.", variant: "default" });
      loadBackupFiles();
    } catch (error) {
      toast({ title: "Thất bại !", description: "Sao lưu thất bại !", variant: "destructive" });
    }

    setLoading(false);
    setProgress(null);
    setOperation(null);
  };

  const handleRestore = async (fileName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn khôi phục từ file ${fileName}?`)) return;
    setLoading(true);
    setOperation("restore");
    setProgress(0);

    try {
      for (let i = 10; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress(i);
      }

      await restoreBackup(`./src/filebackup/${fileName}`);
      toast({ title: "Thành công !", description: "Khôi phục dữ liệu thành công !", variant: "default" });
    } catch (error) {
      toast({ title: "Thất bại !", description: "Khôi phục dữ liệu thất bại !", variant: "destructive" });
    }

    setLoading(false);
    setProgress(null);
    setOperation(null);
  };

  return (
    <div className=" p-6 sm:pt-12 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-center mb-4 sm:mb-6">Quản lý Backup</h1>
        
        <div className="text-center mb-4">
          <Button onClick={handleBackup} disabled={loading} className="w-full sm:w-auto">
            {loading && operation === "backup" ? `Đang sao lưu... (${progress}%)` : "Sao lưu ngay"}
          </Button>
        </div>
        
        {loading && (
          <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        
        <h2 className="text-lg font-semibold mt-6">Danh sách Backup</h2>
        <ul className="mt-2 space-y-2">
          {backups.length > 0 ? (
            backups.map((file, index) => (
              <li key={index} className="flex flex-col sm:flex-row justify-between items-center border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="text-center sm:text-left">
                  <span className="font-medium text-blue-600">{file.fileName}</span>
                  <p className="text-sm text-gray-500">Ngày tạo: {new Date(file.createdAt).toLocaleString()}</p>
                </div>
                <Button onClick={() => handleRestore(file.fileName)} disabled={loading} variant="outline" className="mt-2 sm:mt-0 w-full sm:w-auto">
                  {loading && operation === "restore" ? `Khôi phục... (${progress}%)` : "Khôi phục"}
                </Button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có file backup nào.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
