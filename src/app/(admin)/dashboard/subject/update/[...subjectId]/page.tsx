
import UpdateSubjectPage from "@/components/admin/subject/updatesubject";
import React from "react";

const UpdateAdminSubjectPage = ({ params }: { params: { subjectId: string } }) => {
  const { subjectId } = params;
  return (
    <div>
      <UpdateSubjectPage subjectId={subjectId} />
    </div>
  );
};

export default UpdateAdminSubjectPage;
