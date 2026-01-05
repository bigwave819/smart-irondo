import { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUsers } from "../lib/api";
import Modal from "../components/ui/model";
import { locations } from "../lib/location";

const Users = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);

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

    createUserMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      location: formData.location, // ✅ JSON OBJECT
    });
  };

  return (
    <DashboardLayout activeMenu="Users">
      <div className="w-full min-h-screen py-6 px-6">
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">List of Abanyerondo</h1>
              <p className="text-gray-400 text-sm">
                Browse and manage users
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create User
            </button>
          </div>

          {/* TABLE */}
          {isLoading && <p>Loading users...</p>}
          {isError && <p className="text-red-500">Failed to load users</p>}

          {!isLoading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{u.fullName}</td>
                      <td className="p-3">{u.phone}</td>
                      <td className="p-3 text-sm">
                        {u.location?.district}, {u.location?.sector},{" "}
                        {u.location?.cell}, {u.location?.village}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs
                            ${
                              u.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
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
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal isOpen={openModal} onClose={closeModal} title="Create User">
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="input-modal"
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />

          <input
            className="input-modal"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* DISTRICT */}
          <select
            className="input-modal"
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
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* SECTOR */}
          <select
            className="input-modal"
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
                <option key={s} value={s}>{s}</option>
              ))}
          </select>

          {/* CELL */}
          <select
            className="input-modal"
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
                <option key={c} value={c}>{c}</option>
              ))}
          </select>

          {/* VILLAGE */}
          <select
            className="input-modal"
            disabled={!formData.location.cell}
            value={formData.location.village}
            onChange={(e) => updateLocation("village", e.target.value)}
          >
            <option value="">Select Village</option>
            {formData.location.cell &&
              locations[formData.location.district][formData.location.sector][
                formData.location.cell
              ].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {createUserMutation.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
