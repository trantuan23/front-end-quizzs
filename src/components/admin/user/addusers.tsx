"use client";
import React, { useEffect, useState } from "react";
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
import { createUser } from "@/app/actions/user.actions";
import { getClasses } from "@/app/actions/classes/getclass";

const AddUserForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [classId, setClassId] = useState<string | null>(null); // Thay đổi giá trị khởi tạo là null
  const [classList, setClasses] = useState<
    { class_id: string; class_name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const newUser: CreateUserDto = { username, email, password, role,classId };
  
    try {
       await createUser(newUser);
      toast({
        title: "Thêm thành công",
        description: `Người dùng ${username} đã được thêm.`,
        variant: "default",
      });
      router.push("/dashboard/user");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <Input
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Select
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
            <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chỉ hiển thị mục chọn lớp nếu role là STUDENT */}
      {role === UserRole.STUDENT && (
        <div className="mb-4">
          <Select value={classId ?? "none"} onValueChange={(value) => setClassId(value === "none" ? null : value)}>
            <SelectTrigger>
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
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm người dùng"}
      </Button>
    </form>
  );
};

export default AddUserForm;
