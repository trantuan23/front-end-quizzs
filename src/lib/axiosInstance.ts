import axios from "axios";

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Đổi thành API của bạn
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Thêm interceptor để tự động chèn token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để kiểm tra lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn! Đăng xuất...");

      // Xóa token và chuyển hướng về trang đăng nhập
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // Redirect ngay lập tức
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
