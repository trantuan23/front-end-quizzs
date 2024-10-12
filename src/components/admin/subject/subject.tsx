"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { Subject } from "@/app/types/subject.type";
import { deleteSubject, fetchSubject } from "@/app/actions/subject.action";

const SubjectPage = () => {
  const [sub, setSub] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [subjectToDelete, setSubjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 3; 
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchSubject();
      setSub(data);
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


  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;
  
    setDeleting(true);
    try {
      await deleteSubject(subjectToDelete.id);
  
      toast({
        title: "Thành công!",
        description: `Môn học ${subjectToDelete.name} đã được xóa.`,
        variant: "default",
      });
  
      
      setSub((prevSub) => prevSub.filter((item) => item.subject_id !== subjectToDelete.id));
  
      setSubjectToDelete(null); 
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa môn học.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };
  
  
  

  const filteredUsers = sub.filter(sub =>
    sub.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) 
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
        <Link href="/dashboard/subject/add">
          <Button className="flex items-center gap-2">
            Thêm mới
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Tên môn học</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((item) => (
                  <tr key={item.subject_id} className="hover:bg-gray-100 transition-colors">
                    <td className="border border-gray-300 px-4 py-2">{item.subject_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.subject_name}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      <Link href={`/dashboard/subject/update/${item.subject_id}`}>
                        <Button className="p-2 text-blue-600 hover:bg-blue-100 transition-all" variant="ghost">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setSubjectToDelete({ id: item.subject_id, name: item.subject_name })}
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
                  <td colSpan={5} className="text-center border border-gray-300 px-4 py-2">
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
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "secondary" : "outline"}
                  onClick={() => setCurrentPage(pageNumber)}
                  className="mx-1"
                >
                  {pageNumber}
                </Button>
              ))}
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

      {subjectToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá môn học {subjectToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setSubjectToDelete(null)}
                className="mr-2"
              >
                Huỷ
              </Button>
              <Button onClick={handleDeleteSubject} className="text-red-500">
                Xoá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
