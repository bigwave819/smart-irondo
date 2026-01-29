import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useEvidence } from "../lib/api";

const Evidence = () => {
  const {
    data: evidences = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["evidences"],
    queryFn: useEvidence.getAllEvidences,
    select: (data) => data.evidence,
  });

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Evidence">
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Loading evidences...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout activeMenu="Evidence">
        <div className="text-red-500 text-center mt-10">
          Failed to load evidences
        </div>
      </DashboardLayout>
    );
  }

  const handleDownload = async (url, filename = "evidence") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Evidence">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Uploaded Evidence</h1>

        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Uploader</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Preview</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="">
              {evidences.map((item) => (
                <tr key={item.url} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.uploaderName}</td>

                  <td className="px-4 py-3 capitalize">{item.type}</td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <img
                      src={item.url}
                      alt="Evidence"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="px-3 py-2 text-sm cursor-pointer rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() =>
                        handleDownload(
                          item.url,
                          `evidence-${item.uploaderName}-${item.reportId}`,
                        )
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}

              {evidences.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No evidence found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Evidence;
