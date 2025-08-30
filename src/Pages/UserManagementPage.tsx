import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Support" | "Moderator";
  status: "Active" | "Inactive";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://nearme-bn.onrender.com/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json();
        console.log("Fetched users:", responseData);

        // ✅ adjust based on API structure
        if (Array.isArray(responseData.data)) {
          setUsers(responseData.data);
        } else {
          console.error("Unexpected API response format", responseData);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="p-8">Loading users...</p>;
  if (users.length === 0)
    return <p className="p-8 text-red-500">No users found.</p>;

  return (
    <div className="p-4 sm:p-6 pt-20 bg-gray-50 min-h-screen">
      {/* Back link */}
      <a
        href="/dashboard"
        className="text-blue-600 text-sm flex items-center mb-4"
      >
        ← Back to Dashboard
      </a>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage and view all platform users and their roles.
      </p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
          />
        </div>

        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base w-full sm:w-auto">
          <option>All Roles</option>
          <option>Admin</option>
          <option>Support</option>
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
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {u.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {u.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium
                        ${u.role === "Admin" ? "bg-red-100 text-red-600" : ""}
                        ${
                          u.role === "Support"
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${
                          u.role === "Moderator"
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
                          u.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button className="text-gray-500 hover:text-gray-800">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 p-3 text-xs sm:text-sm text-gray-500">
          <p>Showing {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
