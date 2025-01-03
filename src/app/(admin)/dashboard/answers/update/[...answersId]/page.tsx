import UpdateAnswersForm from "@/components/admin/answers/updateanswers";


const UpdateAdminAnswersPage = ({ params }: { params: { answerId: string } }) => {
  const { answerId } = params;
  return (
    <div>
      <UpdateAnswersForm answerId={answerId} />
    </div>
  );
};

export default UpdateAdminAnswersPage;
