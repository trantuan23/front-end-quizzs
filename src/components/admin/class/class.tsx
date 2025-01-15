"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetchClasses } from "../../../app/actions/classes/getclass";
import { deleteClass } from "@/app/actions/classes/deleteclass";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash, Copy, ArrowLeft, ArrowRight } from "lucide-react";
import { Class } from "@/app/types/class.type";

const ClassPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [classesPerPage] = useState<number>(4);
  const [classToDelete, setClassToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, total } = await fetchClasses(currentPage, classesPerPage);
      setClasses(data);
      setTotalPages(Math.ceil(total / classesPerPage));
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy dữ liệu lớp học.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete.id);
        toast({
          title: "Xoá thành công",
          description: `Lớp ${classToDelete.name} đã được xoá.`,
          variant: "default",
        });
        fetchData();

        const remainingClasses = classes.length - 1;
        if (remainingClasses === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        setClassToDelete(null);
      } catch (error) {
        console.error("Error deleting class:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xoá lớp học.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast({
        title: "Sao chép thành công",
        description: `ID lớp ${id} đã được sao chép !`,
        variant: "default",
      });
    }).catch((error) => {
      console.error("Error copying text:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép ID lớp.",
        variant: "destructive",
      });
    });
  };

  const filteredClasses = classes.filter((classData) =>
    classData.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4">
        <Input
          placeholder="Filter class name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mb-4 sm:mb-0"
        />
        <div className="ml-auto">
          <Link href="/dashboard/class/add">
            <Button className="ml-4">Add class</Button>
          </Link>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Class ID</th>
            <th className="border border-gray-300 px-4 py-2">Class Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classData) => (
              <tr key={classData.class_id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border border-gray-300 px-4 py-2">{classData.class_id}</td>
                <td className="border border-gray-300 px-4 py-2">{classData.class_name}</td>
                <td className="border border-gray-300 px-4 py-2 flex items-center">
                  <Link href={`/dashboard/class/update/${classData.class_id}`} className="mr-2 text-blue-500">
                    <Edit size={16} />
                  </Link>
                  <Button
                    onClick={() => handleCopy(classData.class_id)}
                    className="text-green-500 mr-2"
                    variant="ghost"
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    onClick={() => setClassToDelete({ id: classData.class_id, name: classData.class_name })}
                    className="text-red-500"
                    variant="ghost"
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center border border-gray-300 px-4 py-2">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {classToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá lớp {classToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setClassToDelete(null)} className="mr-2">Huỷ</Button>
              <Button onClick={handleDelete} className="text-red-500">Xoá</Button>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default ClassPage;
