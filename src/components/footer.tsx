

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 py-6 text-center w-full">
      <div className="container mx-auto">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} Tran Thanh Tuan
        </p>
      </div>
    </footer>
  );
}
