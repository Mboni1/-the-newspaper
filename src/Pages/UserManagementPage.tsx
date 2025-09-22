import React, { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../Components/Pagination";

interface User {
  id: number;
  names: string;
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

  // Search + filter states
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const limit = 6;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const roleParam =
          filterRole !== "All Roles" ? filterRole.toLowerCase() : undefined;

        let res;
        if (searchQuery) {
          res = await api.get("/user/search/all", {
            params: {
              query: searchQuery,
              page,
              limit,
              ...(roleParam && { role: roleParam }),
            },
          });
        } else {
          res = await api.get("/user/all", {
            params: {
              page,
              limit,
              ...(roleParam && { role: roleParam }),
            },
          });
        }

        const data = res.data;

        if (Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalUsers(data.total || data.data.length);
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery, filterRole]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handleDelete = async (id: number, email: string) => {
    try {
      // call backend API with email
      await api.delete(`/user/${encodeURIComponent(email)}`);
      // update frontend state (remove by email or id)
      setUsers((prev) => prev.filter((u) => u.email !== email));

      setOpenMenu(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleSave = async (
    id: number,
    names: string,
    email: string,
    role: string
  ) => {
    try {
      const res = await api.patch(`/user/names/${id}`, {
        names,
        email,
        role,
      });

      const updatedUser = res.data;
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updatedUser } : u))
      );
      setEditingUser(null);
      setOpenMenu(null);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Toaster />
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

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
            value={searchInput}
            placeholder="Search users by name, email..."
            onChange={(e) => setSearchInput(e.target.value)}
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

      {loading ? (
        <p className="p-8 text-center">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="p-8 text-red-500 text-center">No users found.</p>
      ) : (
        <>
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
                  {users.map((u) => {
                    const fullName = `${u.firstName ?? ""} ${
                      u.lastName ?? ""
                    }`.trim();

                    return (
                      <tr key={u.id} className="border-t border-gray-300">
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
                              ${
                                u.role === "admin"
                                  ? "bg-red-100 text-red-600"
                                  : ""
                              }
                              ${
                                u.role === "user"
                                  ? "bg-blue-100 text-blue-500"
                                  : ""
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
                              setOpenMenu((prev) =>
                                prev === u.id ? null : u.id
                              )
                            }
                          >
                            <MoreVertical />
                          </button>

                          {openMenu === u.id && (
                            <div className="absolute right-8 top-full -mt-17 w-fit bg-white border rounded-md shadow-lg z-10">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-400"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(u.id, u.email)}
                                className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-400"
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

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Edit Form
interface EditFormProps {
  user: User;
  onClose: () => void;
  onSave: (id: number, names: string, email: string, role: string) => void;
}

const EditUserForm: React.FC<EditFormProps> = ({ user, onClose, onSave }) => {
  const [names, setNames] = useState(user.names);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, names, email, role);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Names</label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as User["role"])}
              className="w-full p-2 border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
