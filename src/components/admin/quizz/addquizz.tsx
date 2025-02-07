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
import { User } from "@/app/types/user.type";
import { Subject } from "@/app/types/subject.type";
import { fetchClasses } from "@/app/actions/classes/getclass";
import { Class } from "@/app/types/class.type";
import { fetchSubject } from "@/app/actions/subject.action";

const AddQuizForm = () => {
  const [formData, setFormData] = useState<CreateQuizzrDto>({
    title: "",
    description: "",
    userId: "",
    classId: "",
    subjectId: "",
    article:"",
    time: 15 * 60,
  });
  const [userList, setUserList] = useState<User[]>([]);
  const [classList, setClassList] = useState<Class[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
 
  const router = useRouter();

  const fetchInitialData = async () => {
    try {
      const [users, classes, subjects] = await Promise.all([
        fetchUsers(),
        fetchClasses(),
        fetchSubject(),
      ]);

      setUserList(users.filter((user) => user.role === "teacher"));
      setClassList(classes.data);
      setSubjectList(subjects);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof CreateQuizzrDto, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createQuiz(formData);
      toast({
        title: "Thành công",
        description: `Quiz "${formData.title}" đã được thêm.`,
      });
      router.push("/dashboard/question/add");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi thêm quiz.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded">
       <h1 className="text-2xl font-bold mb-6 text-center">Thêm bài kiểm tra</h1>
      {/* Tiêu đề */}
      <div>
        <textarea
          name="title"
          placeholder="Tiêu đề bài kiểm tra"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded"
          rows={6}
          
        />
      </div>

       {/* Mô tả */}
       <div>
        <textarea
          name="description"
          placeholder="Yêu cầu đề bài"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded"
          rows={6}
          
        />
      </div>

      <div>
        <textarea
          name="article"
          placeholder="Đề bài"
          value={formData.article}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded"
          rows={6}
          
        />
      </div>

     

      {/* Thời gian */}
     {/* Thời gian */}
     <div>
    <Select
      value={formData.time.toString()} // Hiển thị giá trị hiện tại
      onValueChange={(value) => handleSelectChange("time", Number(value))}
      required
    >
      <SelectTrigger>
        <SelectValue
          placeholder="Chọn thời gian"
          defaultValue={(15 * 60).toString()} // Giá trị mặc định là 15 phút
        />
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


      {/* Môn học */}
      <div>
        <Select
          value={formData.subjectId}
          onValueChange={(value) => handleSelectChange("subjectId", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            {subjectList.map((subject) => (
              <SelectItem key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lớp học */}
      <div>
        <Select
          value={formData.classId}
          onValueChange={(value) => handleSelectChange("classId", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn lớp học" />
          </SelectTrigger>
          <SelectContent>
            {classList.map((clas) => (
              <SelectItem key={clas.class_id} value={clas.class_id}>
                {clas.class_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Giáo viên */}
      <div>
        <Select
          value={formData.userId}
          onValueChange={(value) => handleSelectChange("userId", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn giáo viên" />
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

      {/* Nút thêm */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Đang xử lý..." : "Thêm bài kiểm tra"}
      </Button>
    </form>
  );
};

export default AddQuizForm;
