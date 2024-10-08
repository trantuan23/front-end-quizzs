"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassType } from "@/app/types/class.type";
import { addClass } from "@/app/actions/classes/addclass";
import { useToast } from "@/hooks/use-toast";

const AddClassPage = () => {
  const [classData, setClassData] = useState<Omit<ClassType, "class_id">>({
    class_name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddClass = async () => {
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
      const res = await addClass(classData);
      toast({
        title: "Thành công!",
        description: res.data.message,
        variant: "default",
      });
      router.push("/dashboard/class");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lớp học đã tồn tại !",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm lớp</h2>
      <div className="mb-4">
        <Input
          placeholder="Nhập tên lớp"
          value={classData.class_name}
          onChange={(e) =>
            setClassData({ ...classData, class_name: e.target.value })
          }
        />
      </div>
      <Button onClick={handleAddClass} disabled={loading}>
        {loading ? "Đang tải lên ..." : "Tải lên"}
      </Button>
    </div>
  );
};

export default AddClassPage;
