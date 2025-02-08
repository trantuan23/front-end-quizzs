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
import { User } from "@/app/types/user.type";
import { Class } from "@/app/types/class.type";
import { Subject } from "@/app/types/subject.type";
import { fetchClasses } from "@/app/actions/classes/getclass";
import { fetchSubject } from "@/app/actions/subject.action";
import { Textarea } from "@/components/ui/textarea";

const UpdateQuizForm = ({ quizzId }: { quizzId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [article, setArticle] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [classList, setClassList] = useState<Class[]>([]);
  const [subjectId, setSubjectId] = useState<string>("");
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        const cla = await fetchClasses();
        const sub = await fetchSubject();

        const filteredUsers = users.filter(
          (user) => user.role.toLowerCase() === "teacher"
        );
        setUserList(filteredUsers);
        setClassList(cla.data);
        setSubjectList(sub);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizzId}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz data");

        const quizzData = await response.json();
        setTitle(quizzData.title);
        setDescription(quizzData.description);
        setTime(quizzData.time);
        setUserId(quizzData.user.user_id);
        setClassId(quizzData.class.class_id);
        setSubjectId(quizzData.subject.subject_id);
        setArticle(quizzData.article)

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
  }, [quizzId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedQuiz: UpdateQuizDto = {
      title,
      description,
      time,
      userId,
      classId,
      subjectId,
      article
      
    };

    try {
      await updateQuiz(quizzId, updatedQuiz);
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
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Cập nhật bài kiểm tra</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề bài kiểm tra
        </label>
        <Textarea
          placeholder="Nhập tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={6}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yêu cầu đề bài
        </label>
        <Textarea
          placeholder="Nhập yêu cầu đề bài"
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          rows={6}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả bài kiểm tra
        </label>
        <Textarea
          placeholder="Nhập đề bài  "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian làm bài
          </label>
          <Select
            value={time > 0 ? time.toString() : ""}
            onValueChange={(value) => setTime(Number(value))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value={(3 * 60).toString()}>3 phút</SelectItem>
              <SelectItem value={(15 * 60).toString()}>15 phút</SelectItem>
              <SelectItem value={(45 * 60).toString()}>45 phút</SelectItem>
              <SelectItem value={(60 * 60).toString()}>1 giờ</SelectItem>
              <SelectItem value={(90 * 60).toString()}>1 giờ 30 phút</SelectItem>
              <SelectItem value={(120 * 60).toString()}>2 giờ</SelectItem>
              <SelectItem value={(100 * 60).toString()}>100 phút</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giáo viên
          </label>
          <Select value={userId} onValueChange={setUserId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giáo viên" />
            </SelectTrigger>
            <SelectContent>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.username}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Không có giáo viên nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lớp học
          </label>
          <Select value={classId} onValueChange={setClassId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              {classList.length > 0 ? (
                classList.map((cls) => (
                  <SelectItem key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Không có lớp học nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Môn học
          </label>
          <Select value={subjectId} onValueChange={setSubjectId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn môn học" />
            </SelectTrigger>
            <SelectContent>
              {subjectList.length > 0 ? (
                subjectList.map((sub) => (
                  <SelectItem key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Không có môn học nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Cập nhật bài kiểm tra"}
      </Button>
    </form>
  );
};

export default UpdateQuizForm;
