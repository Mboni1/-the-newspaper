import React, { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status?: "Active" | "Inactive";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [openMenu, setOpenMenu] = useState<number | null>(null); // dropdown state

  const limit = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nearme-bn.onrender.com/user/all?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const responseData = await res.json();
        if (Array.isArray(responseData.data)) {
          setUsers(responseData.data);
          setTotalUsers(responseData.total || responseData.data.length);
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpenMenu(null);
  };

  const handleEdit = (id: number) => {
    alert(`Edit user ${id}`);
    setOpenMenu(null);
  };

  // ✅ filter users by search and role
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      filterRole === "All Roles" || u.role === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) return <p className="p-8">Loading users...</p>;
  if (users.length === 0)
    return <p className="p-8 text-red-500">No users found.</p>;

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage and view all platform users and their roles.
      </p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="relative w-full sm:w-3/4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>User</option>
          <option>Moderator</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100 text-gray-600 text-xs sm:text-sm uppercase">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const fullName = `${u.firstName ?? ""} ${
                  u.lastName ?? ""
                }`.trim();

                return (
                  <tr key={u.id} className="border-t">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                        {fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          {fullName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {u.email}
                        </p>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium
                          ${u.role === "admin" ? "bg-red-100 text-red-600" : ""}
                          ${
                            u.role === "user" ? "bg-blue-100 text-blue-600" : ""
                          }
                          ${
                            u.role === "moderator"
                              ? "bg-green-100 text-green-600"
                              : ""
                          }
                        `}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`flex items-center gap-1 text-xs sm:text-sm font-medium
                          ${
                            u.status === "Active"
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        `}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {u.status ?? "Inactive"}
                      </span>
                    </td>

                    <td className="p-3 text-right relative">
                      <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={() =>
                          setOpenMenu((prev) => (prev === u.id ? null : u.id))
                        }
                      >
                        <MoreVertical />
                      </button>

                      {/* Dropdown menu */}
                      {openMenu === u.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                          <button
                            onClick={() => handleEdit(u.id)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Pagination  */}
      <div className="flex justify-center mt-6 gap-4 p-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Prev.
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
