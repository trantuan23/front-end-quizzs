import ReviewQuizz from "@/components/home/review";

const ReviewPage = async ({ params }: { params: { reviewId: string } }) => {
    const { reviewId } = await  params;
    return (
        <ReviewQuizz reviewId= {reviewId}/>
    );
}

export default ReviewPage;
