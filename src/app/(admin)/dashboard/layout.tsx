import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const DashBoardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white shadow-md rounded-lg transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
