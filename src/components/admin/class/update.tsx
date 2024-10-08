"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassType } from "@/app/types/class.type";
import { useToast } from "@/hooks/use-toast";
import { updateClass } from "@/app/actions/classes/updateclass";

const UpdateClassPage = ({ classId }: { classId: string }) => {
  const [classData, setClassData] = useState<Omit<ClassType, "class_id">>({
    class_name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }
        const data = await response.json();
        setClassData({ class_name: data.data.class_name });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu lớp học.",
          variant: "default",
        });
      }
    };

    fetchClassData();
  }, [classId]);

  const handleUpdateClass = async () => {
    if (!classData.class_name) {
      toast({
        title: "Error",
        description: "Class name is required",
        variant: "default",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await updateClass(classId, classData);
      toast({
        title: "Thành công!",
        description: res.data.message,
        variant: "default",
      });
      router.push("/dashboard/class");
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
      <h2 className="text-2xl font-bold mb-4">Cập nhật lớp</h2>
      <div className="mb-4">
        <Input
          placeholder="Nhập tên lớp"
          value={classData.class_name}
          onChange={(e) =>
            setClassData({ ...classData, class_name: e.target.value })
          }
        />
      </div>
      <Button onClick={handleUpdateClass} disabled={loading}>
        {loading ? "Đang tải lên ..." : "Cập nhật"}
      </Button>
    </div>
  );
};

export default UpdateClassPage;
