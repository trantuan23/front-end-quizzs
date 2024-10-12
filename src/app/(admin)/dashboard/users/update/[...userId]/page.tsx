import UpdateUserForm from '@/components/admin/user/update';
import React from 'react';

const UpdateAdminUserPage = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    return (
        <div>
            <UpdateUserForm userId={userId}/>
        </div>
    );
}

export default UpdateAdminUserPage;
