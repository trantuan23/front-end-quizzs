"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";
import { Subject } from "@/app/types/subject.type";
import { updateSubject } from "@/app/actions/subject.action";

const UpdateSubjectPage = ({ subjectId }: { subjectId: string }) => {
  const [subjectData, setSubjectData] = useState<Omit<Subject, "subject_id">>({
    subject_name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }
        const data = await response.json();
        console.log(data);
        
        setSubjectData({ subject_name: data.subject_name }); 
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu lớp học.",
          variant: "default",
        });
      }
    };

    fetchClassData();
  }, [subjectId]);

  const handleUpdateClass = async () => {
    if (!subjectData.subject_name) {
      toast({
        title: "Error",
        description: "Class name is required",
        variant: "default",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await updateSubject(subjectId, subjectData); 
      toast({
        title: "Thành công!",
        description: res.data.message,
        variant: "default",
      });
      router.push("/dashboard/subject");  // Sửa liên kết
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật lớp học. Lớp học có thể đã tồn tại.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cập nhật môn học</h2>
      <div className="mb-4">
        <Input
          placeholder="Nhập tên môn học"
          value={subjectData.subject_name}
          onChange={(e) =>
            setSubjectData({ ...subjectData, subject_name: e.target.value })
          }
        />
      </div>
      <div className="mt-4 justify-between space-x-7">
        <Button onClick={handleUpdateClass} disabled={loading}>
          {loading ? "Đang tải lên ..." : "Cập nhật"}
        </Button>
        <Link href="/dashboard/subject">
          <Button variant="destructive">Trở lại</Button>  {/* Đổi liên kết */}
        </Link>
      </div>
    </div>
  );
};

export default UpdateSubjectPage;
