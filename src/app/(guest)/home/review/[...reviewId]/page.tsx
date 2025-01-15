import ReviewQuizz from "@/components/home/review";

const ReviewPage = async ({ params }: { params: { reviewId: string } }) => {
    const { reviewId } = await  params;

  if (!reviewId) {
    return <div>Review ID không hợp lệ.</div>;
  }
    return (
        <ReviewQuizz reviewId= {reviewId}/>
    );
}

export default ReviewPage;
