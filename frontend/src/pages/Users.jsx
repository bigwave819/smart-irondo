import { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUsers } from "../lib/api";
import Modal from "../components/ui/model";
import { locations } from "../lib/location";

const Users = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: {
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });

  /* ================= FETCH USERS ================= */
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: useUsers.getAllUsers,
  });

  /* ================= CREATE USER ================= */
  const createUserMutation = useMutation({
    mutationFn: useUsers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
  });

  /* ================= HELPERS ================= */
  const closeModal = () => {
    setOpenModal(false);
    setFormData({
      fullName: "",
      phone: "",
      location: {
        district: "",
        sector: "",
        cell: "",
        village: "",
      },
    });
  };

  const updateLocation = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    createUserMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      location: formData.location,
    });
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.location?.district?.toLowerCase().includes(searchLower) ||
      user.location?.sector?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout activeMenu="Users">
      <div className="w-full min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Abanyerondo
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and view all registered users
                </p>
              </div>

              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add User
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* LOADING STATE */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-3"></div>
                  <p className="text-sm text-gray-500">Loading users...</p>
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {isError && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600 font-medium">Failed to load users</p>
                  <p className="text-xs text-gray-500 mt-1">Please try again later</p>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && !isError && filteredUsers.length === 0 && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {searchQuery ? "No users found" : "No users yet"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Get started by adding your first user"}
                  </p>
                </div>
              </div>
            )}

            {/* TABLE - DESKTOP */}
            {!isLoading && !isError && filteredUsers.length > 0 && (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {u.fullName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {u.fullName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{u.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {u.location?.village && `${u.location.village}, `}
                              {u.location?.cell && `${u.location.cell}, `}
                              {u.location?.sector && `${u.location.sector}, `}
                              {u.location?.district}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                u.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CARDS - MOBILE */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {u.fullName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {u.fullName}
                            </div>
                            <div className="text-sm text-gray-500">{u.phone}</div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="ml-13 text-sm text-gray-600">
                        <svg
                          className="inline w-4 h-4 mr-1 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {u.location?.village && `${u.location.village}, `}
                        {u.location?.cell && `${u.location.cell}, `}
                        {u.location?.sector && `${u.location.sector}, `}
                        {u.location?.district}
                      </div>
                    </div>
                  ))}
                </div>

                {/* RESULTS COUNT */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Showing {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal isOpen={openModal} onClose={closeModal} title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* LOCATION SECTION */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Location Details
            </label>
            
            <div className="space-y-3">
              {/* DISTRICT */}
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={formData.location.district}
                onChange={(e) => {
                  updateLocation("district", e.target.value);
                  updateLocation("sector", "");
                  updateLocation("cell", "");
                  updateLocation("village", "");
                }}
              >
                <option value="">Select District</option>
                {Object.keys(locations).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* SECTOR */}
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={!formData.location.district}
                value={formData.location.sector}
                onChange={(e) => {
                  updateLocation("sector", e.target.value);
                  updateLocation("cell", "");
                  updateLocation("village", "");
                }}
              >
                <option value="">Select Sector</option>
                {formData.location.district &&
                  Object.keys(locations[formData.location.district]).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>

              {/* CELL */}
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={!formData.location.sector}
                value={formData.location.cell}
                onChange={(e) => {
                  updateLocation("cell", e.target.value);
                  updateLocation("village", "");
                }}
              >
                <option value="">Select Cell</option>
                {formData.location.sector &&
                  Object.keys(
                    locations[formData.location.district][formData.location.sector]
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>

              {/* VILLAGE */}
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={!formData.location.cell}
                value={formData.location.village}
                onChange={(e) => updateLocation("village", e.target.value)}
              >
                <option value="">Select Village</option>
                {formData.location.cell &&
                  locations[formData.location.district][formData.location.sector][
                    formData.location.cell
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModal}
              disabled={createUserMutation.isLoading}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isLoading}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {createUserMutation.isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save User"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
