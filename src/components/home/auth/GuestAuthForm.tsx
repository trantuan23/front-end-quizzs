"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginUser, signupUser } from "@/app/actions/auth.action";
import { UserRole } from "@/app/types/user.type";
import { getClasses } from "@/app/actions/classes/getclass";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [classId, setClassId] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    classId: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [classList, setClassList] = useState<
    { class_id: string; class_name: string }[]
  >([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClassList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Xử lý đăng nhập
        const { access_token,user_id, user_name, role } = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("access_token",access_token)
        dispatch(setUser({ userId: user_id, username: user_name , role: role }));
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
          variant: "default",
        });
        router.push("/")
      } else {
        // Xử lý đăng ký
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp.");
        }
        await signupUser({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          role: UserRole.STUDENT,
        });
        toast({
          title: "Đăng ký thành công ",
          description: "Vui lòng đăng nhập khi tài khoản đã được kích hoạt!",
          variant: "default",
        });
        setIsLogin(true); // Chuyển về chế độ đăng nhập
      }
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
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <Input
                type="text"
                name="username"
                placeholder="Tên người dùng"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

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

          {!isLogin && (
            <>
              <div className="mb-4">
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md">
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {classList.map((cls) => (
                      <SelectItem key={cls.class_id} value={cls.class_id}>
                        {cls.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
