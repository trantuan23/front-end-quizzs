import QuizQuestion from "@/components/home/quizquestion";

const TestQuizzPage = async ({ params }: { params: { quizzId: string } }) => {
  const { quizzId } = await params;

  if (!quizzId) {
    return <div>Quiz ID không hợp lệ.</div>;
  }

  return (
    <div>
      <QuizQuestion quizId={quizzId} />
    </div>
  );
};

export default TestQuizzPage;
