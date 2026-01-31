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
      <div className="p-4 sm:p-6">
        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Uploaded Evidence
          </h1>
          <p className="text-sm text-gray-500">
            Review and download submitted evidence files
          </p>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading evidences…</span>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="text-red-500 text-center mt-10">
            Failed to load evidences
          </div>
        )}

        {/* ===== DESKTOP TABLE ===== */}
        {!isLoading && !isError && (
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
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

              <tbody>
                {evidences.map((item) => (
                  <tr
                    key={item.url}
                    className=" hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.uploaderName}
                    </td>

                    <td className="px-4 py-3 capitalize text-gray-600">
                      {item.type}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <img
                        src={item.url}
                        alt="Evidence"
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleDownload(
                            item.url,
                            `evidence-${item.uploaderName}-${item.reportId}`
                          )
                        }
                        className="px-4 py-2 text-xs font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}

                {evidences.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No evidence found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== MOBILE CARD VIEW ===== */}
        {!isLoading && !isError && (
          <div className="md:hidden space-y-4">
            {evidences.map((item) => (
              <div
                key={item.url}
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.url}
                    alt="Evidence"
                    className="w-20 h-20 rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.uploaderName}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.type}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleDownload(
                      item.url,
                      `evidence-${item.uploaderName}-${item.reportId}`
                    )
                  }
                  className="mt-4 w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Download Evidence
                </button>
              </div>
            ))}

            {evidences.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No evidence found
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Evidence;
