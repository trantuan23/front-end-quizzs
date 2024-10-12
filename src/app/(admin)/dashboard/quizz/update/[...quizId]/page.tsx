import UpdateQuizForm from "@/components/admin/quizz/updatequizz";


const UpdateAdminQuizzPage = ({ params }: { params: { quizId: string } }) => {
    const { quizId } = params;
    return (
        <div>
            <UpdateQuizForm quizId={quizId}/>
        </div>
    );
}

export default UpdateAdminQuizzPage;
