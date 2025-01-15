import UpdateQuizForm from "@/components/admin/quizz/updatequizz";


const UpdateAdminQuizzPage = async ({ params }: { params: { quizId: string } }) => {
    const { quizId } = await params;
    return (
        <div>
            <UpdateQuizForm quizzId={quizId}/>
        </div>
    );
}

export default UpdateAdminQuizzPage;
