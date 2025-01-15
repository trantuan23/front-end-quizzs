import UpdateAnswersForm from "@/components/admin/answers/updateanswers";


const UpdateAdminAnswersPage = async ({ params }: { params: { answersId: string } }) => {
  const { answersId } = await params;
  return (
    <div>
      <UpdateAnswersForm answersId={answersId} />
    </div>
  );
};

export default UpdateAdminAnswersPage;
