import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useReports } from "../lib/api";
import { Download } from 'lucide-react'

const Reports = () => {
  const {
    data: reports,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: useReports.getAllReports,
    select: (data) => data.reports,
  });
  return (
    <DashboardLayout activeMenu="Reports">
      <div className="w-full min-h-screen py-6 px-5">
        <div className="rounded-xl shadow-lg px-4 py-10">
          <div className="my-4">
            <h1 className="font-bold text-2xl">List of All Evidence</h1>
            <p className="text-gray-400 text-sm">here you browser every evidence ever uploaded</p>
          </div>
          {/* TABLE */}
          {isLoading && <p>Loading users...</p>}
          {isError && <p className="text-red-500">Failed to load users</p>}
          {!isLoading && reports.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">{item.reportType}</td>
                      <td className="p-3 text-sm">
                        {/* Accessing the nested location object */}
                        {`${item.location.district}, ${item.location.sector}`}
                      </td>
                      <td className="p-3">{item.status}</td>
                      <td className="p-3"><button className="bg-blue-100 cursor-pointer hover:bg-blue-300 duration-500 p-2 rounded-full"> <Download className="text-sm text-blue-800" /> </button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
