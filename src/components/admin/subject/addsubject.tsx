"use client";
import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Subject } from "@/app/types/subject.type";
import { addSubject } from "@/app/actions/subject.action";

const AddSubjectForm = () => {
  const [subjectData, setSubject] = useState<Omit<Subject, "subject_id">>({
    subject_name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!subjectData.subject_name) {
      toast({
        title: "Lỗi",
        description: "Tên môn học không được để trống",
        variant: "default",
      });
      return;
    }

    setLoading(true);

    try {
      await addSubject(subjectData);
      toast({
        title: "Thành công!",
        description: "Môn học đã được thêm thành công.",
        variant: "default",
      });

      router.push("/dashboard/subject");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Môn học đã tồn tại!",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <Input
          placeholder="Nhập tên môn học"
          value={subjectData.subject_name}
          onChange={(e) =>
            setSubject({ ...subjectData, subject_name: e.target.value })
          }
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm môn học"}
      </Button>
    </form>
  );
};

export default AddSubjectForm;
