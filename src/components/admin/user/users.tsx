"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { User } from "@/app/types/user.type";
import {
  deleteUser,
  fetchUsers,
  IsActive,
  DeActivate,
} from "@/app/actions/user.actions";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 3;
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setTotalPages(Math.ceil(data.length / usersPerPage));
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Không thể lấy danh sách người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      toast({
        title: "Thành công",
        description: `Người dùng ${userToDelete.name} đã được xóa.`,
        variant: "default",
      });
      loadUsers();
      setUserToDelete(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Không thể xóa người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId: string , isActive: boolean) => {
    try {
      if (isActive) {
        await IsActive(userId);
        toast({
          title: "Thành công",
          description: `Tài khoản đã được kích hoạt.`,
          variant: "default",
        });
      } else {
        await DeActivate(userId);
        toast({
          title: "Thành công",
          description: `Tài khoản đã bị khoá.`,
          variant: "default",
        });
      }
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Không thể cập nhật trạng thái.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Link href="/dashboard/users/add">
          <Button className="flex items-center gap-2">Thêm mới</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">
                  Tên người dùng
                </th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Vai trò</th>
                <th className="border border-gray-300 px-4 py-2">Lớp</th>
                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.user_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.class?.class_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) =>
                          handleStatusChange(user.user_id, checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/dashboard/auth/update/${user.user_id}`}>
                        <Button
                          className="p-2 text-blue-600 hover:bg-blue-100 transition-all"
                          variant="ghost"
                        >
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          setUserToDelete({
                            id: user.user_id,
                            name: user.username,
                          })
                        }
                        className="p-2 text-red-600 hover:bg-red-100 transition-all"
                        variant="ghost"
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    Không có kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-center mt-4">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={
                      pageNumber === currentPage ? "secondary" : "outline"
                    }
                    onClick={() => setCurrentPage(pageNumber)}
                    className="mx-1"
                  >
                    {pageNumber}
                  </Button>
                )
              )}
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá người dùng {userToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setUserToDelete(null)}
                className="mr-2"
              >
                Huỷ
              </Button>
              <Button onClick={handleDelete} className="text-red-500">
                Xoá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
