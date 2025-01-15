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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { fetchQuizzes } from "@/app/actions/quizz.action";
import { createQuestion } from "@/app/actions/question.action";
import { Question, QuestionType } from "@/app/types/question.type";
import { Quiz } from "@/app/types/quizz.type";
import { fetchQuestions } from "@/app/actions/question.action";
import { addAnswers } from "@/app/actions/answers.action";
import { Answers } from "@/app/types/answers.type";
const Add = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [classList, setClassList] = useState<Class[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.audio_guess
  );
  const [quizzId, setQuizId] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [quizList, setQuizList] = useState<Quiz[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Answers[]>(
    Array(4).fill({
      questionId: "",
      answer_text: "",
      is_conrrect: false,
      answer_id: "",
      questionts: "",
      data: null,
    })
  );
  const [isNoMoreQuestions, setIsNoMoreQuestions] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // state to control dialog visibility

  const getUsers = async () => {
    try {
      const data = await fetchUsers();
      const teachers = data.filter((user) => user.role === "teacher");
      setUserList(teachers);
    } catch (error) {
      console.error(error);
    }
  };

  const getClass = async () => {
    try {
      const clas = await fetchClasses();
      setClassList(clas.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubject = async () => {
    try {
      const sub = await fetchSubject();
      setSubjectList(sub);
    } catch (error) {
      console.log();
    }
  };

  const getQuizzes = async () => {
    try {
      const data = await fetchQuizzes();
      setQuizList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await fetchQuestions();

      const unansweredQuestions = response.data.filter(
        (question: any) => !question.answers || question.answers.length === 0
      );

      setQuestions(unansweredQuestions);

      if (unansweredQuestions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(unansweredQuestions[0].question_id);
      } else if (unansweredQuestions.length === 0) {
        setIsNoMoreQuestions(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
    }
  };

  const handleChange = (
    index: number,
    field: keyof Answers,
    value: boolean
  ) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];

      if (field === "is_conrrect") {
        // Đặt tất cả đáp án khác thành false, chỉ cho phép một đáp án đúng
        updatedOptions.forEach((opt, idx) => {
          updatedOptions[idx] = {
            ...opt,
            is_conrrect: idx === index ? value : false,
          };
        });
      } else {
        // Cập nhật các trường khác ngoài `is_conrrect`
        updatedOptions[index] = {
          ...updatedOptions[index],
          [field]: value,
        };
      }

      return updatedOptions;
    });
  };

  const handleSubmitAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedQuestion) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng chọn câu hỏi trước khi thêm đáp án.",
          variant: "destructive",
        });
        return;
      }

      if (options.every((option) => !option.answer_text.trim())) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng điền nội dung cho tất cả các đáp án.",
          variant: "destructive",
        });
        return;
      }

      if (options.filter((option) => option.is_conrrect).length === 0) {
        toast({
          title: "Lỗi!",
          description: "Vui lòng chọn ít nhất một đáp án đúng.",
          variant: "destructive",
        });
        return;
      }

      // Xử lý gửi dữ liệu
      const formattedAnswers = options.map((option, index) => ({
        questionId: selectedQuestion,
        answer_text: `${String.fromCharCode(65 + index)}. ${
          option.answer_text
        }`,
        is_conrrect: option.is_conrrect,
        data: null,
      }));

      const res = await addAnswers(formattedAnswers);

      toast({
        title: "Thành công!",
        description: res.message,
        variant: "default",
      });

      // Reset các đáp án
      setOptions(
        Array(4).fill({
          questionId: selectedQuestion,
          answer_text: "",
          is_conrrect: false,
        })
      );
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      return;
    }

    if (options.filter((option) => option.is_conrrect).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }

    if (isNoMoreQuestions) {
      setOpenDialog(true); // Hiển thị dialog nếu không còn câu hỏi
    } else {
      router.push("/dashboard/answers");
    }
  };

  const handleFinish = () => {
    // Kiểm tra xem tất cả các đáp án đã được nhập và có ít nhất một đáp án đúng
    if (options.every((option) => !option.answer_text.trim())) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền nội dung cho tất cả các đáp án.",
        variant: "destructive",
      });
      return;
    }

    if (options.filter((option) => option.is_conrrect).length === 0) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn ít nhất một đáp án đúng.",
        variant: "destructive",
      });
      return;
    }

    // Sau khi kiểm tra, cho phép chuyển trang
    handleSubmit(new Event("submit"));
    router.push("/dashboard/answers");
  };

  const handleDialogCancel = () => {
    setOpenDialog(false); // Close dialog without action
  };

  useEffect(() => {
    getClass();
    getUsers();
    getSubject();
    getQuizzes();
    loadQuestions;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newQuiz: CreateQuizzrDto = {
      title,
      description,
      time,
      userId,
      classId,
      subjectId,
    };
    try {
      await createQuiz(newQuiz);
      toast({
        title: "Thêm thành công",
        description: `Quiz "${title}" đã được thêm.`,
        variant: "default",
      });
      router.push("/dashboard/question/add");
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

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createQuestionDto: Partial<Question> = {
      question_text: questionText,
      question_type: questionType,
      quizzId: quizzId,
    };

    if (mediaUrl) {
      createQuestionDto.media_url = mediaUrl;
    }

    try {
      const response = await createQuestion(createQuestionDto as Question);
      toast({
        title: "Thêm câu hỏi thành công",
        description: `Câu hỏi "${response.data.question_text}" đã được thêm.`,
        variant: "default",
      });
      router.push("/dashboard/answers/add");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi không xác định xảy ra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <SelectItem value={(90 * 60).toString()}>
                1 giờ 30 phút
              </SelectItem>
              <SelectItem value={(120 * 60).toString()}>2 giờ</SelectItem>
              <SelectItem value={(100 * 60).toString()}>100 phút</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Select value={subjectId} onValueChange={setSubjectId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn môn học thực hiện bài kiểm tra" />
            </SelectTrigger>
            <SelectContent>
              {subjectList.map((sub) => (
                <SelectItem key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Select value={classId} onValueChange={setClassId} required>
            <SelectTrigger>
              <SelectValue placeholder="Lớp thực hiện bài kiểm tra" />
            </SelectTrigger>
            <SelectContent>
              {classList.map((cla) => (
                <SelectItem key={cla.class_id} value={cla.class_id}>
                  {cla.class_name}
                </SelectItem>
              ))}
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

      <form
        onSubmit={handleSubmitQuestion}
        className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
      >
        <h1 className="text-xl font-semibold text-center">
          Thêm Câu Hỏi cho bài kiểm tra
        </h1>

        {/* Chọn Quiz */}
        <div>
          <Select value={quizzId} onValueChange={setQuizId} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn quiz cho câu hỏi" />
            </SelectTrigger>
            <SelectContent>
              {quizList.map((quiz) => (
                <SelectItem key={quiz.quizz_id} value={quiz.quizz_id}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nội dung câu hỏi */}
        <div>
          <Input
            placeholder="Nội dung câu hỏi"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Loại câu hỏi */}
        <div>
          <Select
            value={questionType}
            onValueChange={(value) => setQuestionType(value as QuestionType)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại câu hỏi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuestionType.audio_guess}>
                Đoán âm thanh
              </SelectItem>
              <SelectItem value={QuestionType.multiple_choice}>
                Trắc nghiệm
              </SelectItem>
              <SelectItem value={QuestionType.drag_drop}>Kéo thả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URL Media */}
        {questionType === QuestionType.audio_guess && (
          <div>
            <Input
              placeholder="URL media (nếu có)"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        {/* Nút thêm */}
        <div className="flex justify-between gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full hover:bg-slate-400"
          >
            {loading ? "Đang thêm câu hỏi..." : "Tiếp tục và thêm câu hỏi "}
          </Button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Thêm đáp án cho câu hỏi
        </h2>

        <div className="mb-6">
          <label
            htmlFor="question-select"
            className="block text-gray-700 font-medium mb-2"
          >
            Chọn câu hỏi:
          </label>
          <select
            id="question-select"
            value={selectedQuestion || ""}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50"
          >
            {questions.length === 0 ? (
              <option disabled>No more questions to add answers</option>
            ) : (
              questions.map((question) => (
                <option key={question.question_id} value={question.question_id}>
                  {question.question_text}
                </option>
              ))
            )}
          </select>
        </div>

        {options.map((option, index) => (
          <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-700">
              Đáp án {String.fromCharCode(65 + index)}
            </h4>
            <Input
              placeholder={`Nhập nội dung đáp án ${String.fromCharCode(
                65 + index
              )}`}
              value={option.answer_text}
              onChange={(e) =>
                handleChange(index, "answer_text", e.target.value)
              }
              required
              className="mt-2 mb-4"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={option.is_conrrect}
                onChange={(e) =>
                  handleChange(index, "is_conrrect", e.target.checked)
                }
                className="mr-2"
              />

              <span className="text-gray-700">Đáp án đúng</span>
            </div>
          </div>
        ))}

        <div className="text-center">
          <Button
            type="button"
            onClick={handleContinue}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mr-2"
          >
            Tiếp tục
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Đang thêm..." : "Thêm đáp án"}
          </Button>

          <Button
            type="button"
            onClick={handleFinish}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg ml-2"
          >
            Kết thúc
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>Không còn câu hỏi</DialogHeader>
          <p className="mb-4">
            Không còn câu hỏi nào để thêm đáp án. Bạn có muốn quay lại trang
            thêm câu hỏi không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              Hủy bỏ
            </Button>
            <Button onClick={handleContinue}>Tiếp tục</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Add;
