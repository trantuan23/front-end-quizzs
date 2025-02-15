"use client";
import { Checktoken } from "@/app/actions/auth.action";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserRole } from "@/app/types/user.type";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarVisible } = useSidebar();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.username);
  const userRole = useSelector((state:RootState)=>state.user.role);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // Kiểm tra nếu thiếu token hoặc user => Chuyển hướng đăng nhập
      if (!token || !user || !["admin", "teacher"].includes(userRole ?? "")) {
        setIsAuthenticated(false);
        router.push("/admin/auth/dang-nhap-trang-quan-tri");
        return;
      }
      try {
        const response = await Checktoken(token);
        console.log("Verify Token Response:", response);

        if (!response || !response.valid) {
          setIsTokenExpired(true);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Lỗi xác thực token:", error);
        setIsTokenExpired(true);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Lắng nghe thay đổi trong localStorage (token bị thay đổi)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "access_token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, router]);

  // Xử lý khi đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsTokenExpired(false);
    router.push("/admin/auth/dang-nhap-trang-quan-tri");
  };

  if (!isAuthenticated) return null; // Tránh render khi chưa xác thực

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Modal cảnh báo khi token hết hạn */}
      {isTokenExpired && (
        <Dialog open={isTokenExpired} onOpenChange={(open) => open && setIsTokenExpired(open)}>
          <DialogContent>
            <DialogTitle>Phiên đăng nhập hết hạn</DialogTitle>
            <DialogDescription>
              Mã token của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại để tiếp tục.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={handleLogout}>Đăng nhập lại</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Header */}
      <Header />

      {/* Main content */}
      <div className={`flex flex-1 transition-all duration-300 ${isSidebarVisible ? "ml-48" : "ml-0"}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-24 bg-white shadow-md rounded-lg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
