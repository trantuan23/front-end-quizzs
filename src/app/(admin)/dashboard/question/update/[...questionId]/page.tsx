import Updatequestion from "@/components/admin/question/updatequestion";

const UpdateQuestionPage = ({ params }: { params: { questionId: string } }) => {
  const { questionId } = params;
  return (
    <div>
      <Updatequestion questionId={questionId} />
    </div>
  );
};

export default UpdateQuestionPage;
