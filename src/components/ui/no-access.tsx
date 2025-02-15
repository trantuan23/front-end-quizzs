"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const NoAccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">403 - Forbidden</h2>
        <p className="text-lg mb-6">Bạn không có quyền truy cập vào tài nguyên này.</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NoAccessPage;
