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
import { UpdateQuizDto } from "@/app/types/quizz.type";
import { updateQuiz } from "@/app/actions/quizz.action";
import { fetchUsers } from "@/app/actions/user.actions";

const UpdateQuizForm = ({ quizId }: { quizId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userList, setUserList] = useState<
    { user_id: string; username: string; role: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();

        // Chỉ lọc người dùng với vai trò là 'teacher'
        const filteredUsers = users.filter(
          (user) => user.role.toLowerCase() === "teacher"
        );
        setUserList(filteredUsers);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz data");

        const quizzData = await response.json();
        setTitle(quizzData.title);
        setDescription(quizzData.description);
        setTime(quizzData.time);
        
        setUserId(quizzData.user.user_id);

        setDataLoaded(true);
      } catch (error) {
        console.error(error);
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu quiz.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [quizId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedQuiz: UpdateQuizDto = {
      title,
      description,
      time,
      userId,
    };

    try {
      await updateQuiz(quizId, updatedQuiz);
      toast({
        title: "Cập nhật thành công",
        description: `Quiz "${title}" đã được cập nhật.`,
        variant: "default",
      });
      router.push("/dashboard/quizz");
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật quiz.",
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
          value={time > 0 ? time.toString() : ""} // Kiểm tra giá trị của time
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
            {userList.length > 0 ? (
              userList.map((item) => (
                <SelectItem key={item.user_id} value={item.user_id}>
                  {item.username}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                Không có người dùng nào
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Cập nhật quiz"}
      </Button>
    </form>
  );
};

export default UpdateQuizForm;
