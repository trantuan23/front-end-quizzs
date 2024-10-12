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
import { UpdateUserDto } from "@/app/types/user.type";
import { updateUser } from "@/app/actions/user.actions";
import { getClasses } from "@/app/actions/classes/getclass";

const UpdateUserForm = ({ userId }: { userId: string }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<any>("");
  const [classId, setClassId] = useState<string>("");
  const [classList, setClasses] = useState<
    { class_id: string; class_name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classes = await getClasses();
        setClasses(classes);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();

        setUsername(userData.username);
        setEmail(userData.email);
        setRole(userData.role);
        setClassId(userData.class ? userData.class.class_id : userData.class_id);

        setDataLoaded(true);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu người dùng.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedUser: UpdateUserDto = {
      username,
      email,
      classId,
      role,
      ...(password && { password }), // Chỉ thêm password nếu có thay đổi
    };

    try {
      await updateUser(userId, updatedUser);
      toast({
        title: "Cập nhật thành công",
        description: `Người dùng ${username} đã được cập nhật.`,
        variant: "default",
      });
      router.push("/dashboard/users");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) {
    return <div>Đang tải dữ liệu...</div>;
  }

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
          placeholder="Mật khẩu (để trống nếu không thay đổi)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Hiển thị vai trò hiện tại trong một input không thể chỉnh sửa */}
      <div className="mb-4">
        <Input
          placeholder="Vai trò"
          value={role}
          readOnly // Không cho phép thay đổi
        />
      </div>

      {/* Hiển thị lớp học chỉ khi vai trò là "STUDENT" */}
      {role === "STUDENT" && (
        <div className="mb-4">
          <Select value={classId} onValueChange={(value) => setClassId(value)}>
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
        {loading ? "Đang cập nhật..." : "Cập nhật người dùng"}
      </Button>
    </form>
  );
};

export default UpdateUserForm;
