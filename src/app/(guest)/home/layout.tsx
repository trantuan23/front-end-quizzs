import Navbar from "@/components/home/navbar";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navbar/>
        {children}
      </div>
  );
};

export default HomeLayout;
