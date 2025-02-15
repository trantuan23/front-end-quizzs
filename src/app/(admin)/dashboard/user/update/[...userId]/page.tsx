import UpdateUserForm from '@/components/admin/user/update';
import React from 'react';

const UpdateAdminUserPage = async ({ params }: { params: { userId: string } }) => {
    const { userId } = await  params;
    return (
        <div>
            <UpdateUserForm userId={userId}/>
        </div>
    );
}

export default UpdateAdminUserPage;
