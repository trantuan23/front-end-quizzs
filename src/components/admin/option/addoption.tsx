"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Option } from "@/app/types/option.type";
import { useRouter } from "next/navigation";
import { createOption } from "@/app/actions/option.action";

const AddOptionForm = ({ questionId }: { questionId: string }) => {
  const [options, setOptions] = useState({
    A: { option_text: "", explanation: "", hint: "", is_correct: false },
    B: { option_text: "", explanation: "", hint: "", is_correct: false },
    C: { option_text: "", explanation: "", hint: "", is_correct: false },
    D: { option_text: "", explanation: "", hint: "", is_correct: false },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (key: string, field: string, value: string | boolean) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    
   }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      {["A", "B", "C", "D"].map((key) => (
        <div key={key} className="mb-4">
          <h4 className="font-semibold">Đáp án {key}</h4>
          <Input
            placeholder="Nội dung đáp án"
            
            onChange={(e) => handleChange(key, "option_text", e.target.value)}
            required
            className="mt-2 mb-2"
          />
          <Input
            placeholder="Giải thích"
            
            onChange={(e) => handleChange(key, "explanation", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Gợi ý"
            
            onChange={(e) => handleChange(key, "hint", e.target.value)}
            className="mb-2"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              
              onChange={(e) => handleChange(key, "is_correct", e.target.checked)}
              className="mr-2"
            />
            Đáp án đúng
          </label>
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm phương án"}
      </Button>
    </form>
  );
};

export default AddOptionForm;
