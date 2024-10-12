import UpdateClassPage from "@/components/admin/class/update";
import React from "react";

const UpdateAdminClassPage = ({ params }: { params: { classId: string } }) => {
  const { classId } = params;
  return (
    <div>
      <UpdateClassPage classId={classId} />
    </div>
  );
};

export default UpdateAdminClassPage;
