"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-700 py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} Tran Thanh Tuan
        </p>
      </div>
    </footer>
  );
}
