"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const quizzSchema = z.object({
  title: z.string().min(3, { message: "Quiz title phải ít nhất 3 ký tự." }),
  description: z.string().optional(),
  timeLimit: z
    .enum(["1", "3", "15", "30", "45", "60", "90"], { invalid_type_error: "Vui lòng chọn thời gian hợp lệ" })
    .transform(Number),
});

type QuizzFormData = z.infer<typeof quizzSchema>;

const AddQuizzPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizzFormData>({
    resolver: zodResolver(quizzSchema),
  });

  const onSubmit = (data: QuizzFormData) => {
    // Xử lý khi submit form, ví dụ như gọi API để thêm quiz
    console.log("Quizz data:", data);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Thêm Quizz Mới</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Tên Quizz
              </label>
              <Input id="title" {...register("title")} placeholder="Nhập tên quizz" />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Mô tả
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Nhập mô tả cho quizz (tuỳ chọn)"
              />
            </div>

            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium">
                Thời gian giới hạn
              </label>
              <select
                id="timeLimit"
                {...register("timeLimit")}
                className="block w-full px-3 py-2 border rounded-md"
              >
                <option value="1">1 phút</option>
                <option value="3">3 phút</option>
                <option value="15">15 phút</option>
                <option value="30">30 phút</option>
                <option value="45">45 phút</option>
                <option value="60">1 giờ</option>
                <option value="90">1 giờ 30 phút</option>
              </select>
              {errors.timeLimit && (
                <p className="text-sm text-red-500">{errors.timeLimit.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Thêm Quizz</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddQuizzPage;
