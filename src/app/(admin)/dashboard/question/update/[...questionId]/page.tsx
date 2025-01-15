import UpdateQuestionPage from "@/components/admin/question/updatequestion";


const UpdateAdminQuestionPage = async ({ params }: { params: { questionId:string } }) => {
  const { questionId } = await params;
  return (
    <div>
      <UpdateQuestionPage questionId={questionId} />
    </div>
  );
};

export default UpdateAdminQuestionPage;



