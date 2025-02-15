"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth.action";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const AuthForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { access_token, user_id, user_name, role } = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      
      if (role !== "teacher" && role !== "admin") {
        throw new Error("Bạn không có quyền truy cập.");
      }
      
      localStorage.setItem("access_token", access_token);
      console.log(role);
      
      dispatch(setUser({ userId: user_id, username: user_name, role : role }));
      
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
        variant: "default",
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Đăng nhập trang quản trị 
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
