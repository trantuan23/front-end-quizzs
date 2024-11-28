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
import { fetchUsers } from "@/app/actions/user.actions";
import { createQuiz } from "@/app/actions/quizz.action";
import { CreateQuizzrDto } from "@/app/types/quizz.type";

const AddQuizForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userList, setUserList] = useState<
    { user_id: string; username: string; role: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        const teachers = data.filter((user) => user.role === "teacher");
        setUserList(teachers);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newQuiz: CreateQuizzrDto = { title, description, time, userId };
    try {
      await createQuiz(newQuiz);
      toast({
        title: "Thêm thành công",
        description: `Quiz "${title}" đã được thêm.`,
        variant: "default",
      });
      router.push("/dashboard/quizz");
    } catch (error: any) {
      const errorMessage = error.message || "Có lỗi không xác định xảy ra.";
      toast({
        title: "Lỗi",
        description: errorMessage,
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
          placeholder="Tiêu đề quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Select
          value={time ? time.toString() : ""}
          onValueChange={(value) => setTime(Number(value))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={(15 * 60).toString()}>15 phút</SelectItem>
            <SelectItem value={(45 * 60).toString()}>45 phút</SelectItem>
            <SelectItem value={(60 * 60).toString()}>1 giờ</SelectItem>
            <SelectItem value={(90 * 60).toString()}>1 giờ 30 phút</SelectItem>
            <SelectItem value={(120 * 60).toString()}>2 giờ</SelectItem>
            <SelectItem value={(100 * 60).toString()}>100 phút</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Select value={userId} onValueChange={setUserId} required>
          <SelectTrigger>
            <SelectValue placeholder="Giáo viên cho đề" />
          </SelectTrigger>
          <SelectContent>
            {userList.map((user) => (
              <SelectItem key={user.user_id} value={user.user_id}>
                {user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm quiz"}
      </Button>
    </form>
  );
};

export default AddQuizForm;
