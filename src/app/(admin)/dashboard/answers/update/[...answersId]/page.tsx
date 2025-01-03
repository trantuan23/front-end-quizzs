import UpdateAnswersForm from "@/components/admin/answers/updateanswers";


const UpdateAdminAnswersPage = ({ params }: { params: { answersId: string } }) => {
  const { answersId } = params;
  return (
    <div>
      <UpdateAnswersForm answersId={answersId} />
    </div>
  );
};

export default UpdateAdminAnswersPage;
