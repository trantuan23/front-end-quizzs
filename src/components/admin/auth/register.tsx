"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateUserDto, UserRole } from "@/app/types/user.type";
import { getClasses } from "@/app/actions/classes/getclass";
import { sigupUser } from "@/app/actions/auth.action";

const SignupForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role] = useState<UserRole>(UserRole.STUDENT);
  {
    /* Đặt role mặc định là Học viên */
  }
  const [classId, setClassId] = useState<string>("");
  const [classList, setClassList] = useState<
    { class_id: string; class_name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newUser: CreateUserDto = { username, email, password, role, classId };

    try {
      await sigupUser(newUser);
      toast({
        title: "Đăng ký thành công",
        description: `Người dùng ${username} đã được tạo.`,
        variant: "default",
      });
      router.push("/home/auth/login");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng ký người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Đăng ký tài khoản
        </h2>
        <div className="mb-4">
          <Input
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Hiển thị lớp học khi role là sinh viên */}
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-md"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
