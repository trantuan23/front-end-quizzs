import DashboardCard from "@/components/dashboard-card";


const DashBoardPage = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <DashboardCard key={index} />
        ))}
      </div>
    </div>
  );
};



export default DashBoardPage;
