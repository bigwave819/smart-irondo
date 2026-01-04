import { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { useUsers } from "../lib/api";
import Modal from "../components/ui/model";

const Users = () => {
  const [openModal, setOpenModal] = useState(false);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: useUsers.getAllUsers,
  });

  return (
    <DashboardLayout activeMenu="Users">
      <div className="w-full min-h-screen py-6 px-6">
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                List of all Abanyerondo
              </h1>
              <p className="text-gray-400 text-sm">
                Browse and manage abanyerondo users
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </div>

          {/* TABLE */}
          {isLoading && <p>Loading users...</p>}
          {isError && <p className="text-red-500">Failed to load users</p>}

          {!isLoading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-500">
                    <th className="p-3">#</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">
                        {user.fullName}
                      </td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Create New User"
      >
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full border rounded-lg px-4 py-2"
          />
          <select className="w-full border rounded-lg px-4 py-2">
            <option>User</option>
            <option>Admin</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
