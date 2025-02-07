"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth.action";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Giả sử loginUser trả về { access_token, refresh_token }
      const { access_token} = await loginUser({ email, password });

      localStorage.setItem("access_token", access_token);

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
        variant: "default",
      });

      // Chuyển hướng đến dashboard sau khi đăng nhập thành công
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng nhập. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen pt-12">
      <div className="w-full max-w-md p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Đăng nhập</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Đăng ký ngay
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
