import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** ==== TYPES ==== */
type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: "Admin" | "Manager" | "User";
};

type SortField = keyof Pick<User, "username" | "email" | "phone" | "role">;
type SortOrder = "asc" | "desc";

/** ==== HARD CODE (thay cho gọi API) ==== */
const MOCK_DB = {
  "/api/users/all": [
    {
      id: "1",
      username: "alice",
      email: "alice@example.com",
      phone: "0901234567",
      address: "123 Nguyen Trai, HN",
      role: "Admin" as const,
    },
    {
      id: "2",
      username: "bob",
      email: "bob@example.com",
      phone: "0902222333",
      address: "456 Le Loi, HCM",
      role: "User" as const,
    },
    {
      id: "3",
      username: "charlie",
      email: "charlie@example.com",
      phone: "0908888999",
      address: "789 Tran Hung Dao, DN",
      role: "Manager" as const,
    },
    {
      id: "4",
      username: "daisy",
      email: "daisy@example.com",
      phone: "0905555777",
      address: "12 Hai Ba Trung, HN",
      role: "User" as const,
    },
    {
      id: "5",
      username: "edward",
      email: "edward@example.com",
      phone: "0904444666",
      address: "88 Vo Thi Sau, HCM",
      role: "User" as const,
    },
  ] satisfies User[],
} as const;

function mockFetch<T extends keyof typeof MOCK_DB>(key: T) {
  return Promise.resolve(MOCK_DB[key]);
}

/** ==== COMPONENT ==== */
const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("username");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await mockFetch("/api/users/all");
        setUsers(data);
      } catch {
        // im lặng khi lỗi (giữ behavior cũ)
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const filteredAndSortedUsers = users
    .filter((user) =>
      [user.username, user.email, user.phone, user.address, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy]?.toString().toLowerCase() ?? "";
      const bVal = b[sortBy]?.toString().toLowerCase() ?? "";

      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
  );

  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* ==== HEADER ==== */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#78B3CE] mb-2">
          User Account Management
        </h1>
        <p className="text-gray-600 mb-4">
          Detailed information of all users in the system.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-[#C9E6F0] rounded-xl"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="p-3 border-2 border-[#C9E6F0] rounded-xl bg-white"
          >
            <option value="username-asc">Username A-Z</option>
            <option value="username-desc">Username Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
            <option value="phone-asc">Phone Ascending</option>
            <option value="phone-desc">Phone Descending</option>
            <option value="role-asc">Role A-Z</option>
            <option value="role-desc">Role Z-A</option>
          </select>
        </div>
      </div>

      {/* ==== TABLE ==== */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#78B3CE]">
            User List ({filteredAndSortedUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full rounded-2xl overflow-hidden shadow border">
            <thead className="bg-[#C9E6F0]">
              <tr>
                {(["username", "email", "phone", "role"] as SortField[]).map(
                  (field) => (
                    <th key={field} className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort(field)}
                        className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                      >
                        <span>{field.toUpperCase()}</span>
                        <span className="text-xs">
                          {sortBy === field
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>
                  )
                )}
                <th className="px-6 py-4 text-left font-semibold text-[#78B3CE]">
                  Address
                </th>
                <th className="px-6 py-4 text-left font-semibold text-[#78B3CE]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-[#FBF8EF] transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/usermanagement/${user.id}`)
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#78B3CE] text-white text-sm hover:bg-[#5a93ac] shadow"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ==== PAGINATION ==== */}
        {filteredAndSortedUsers.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} / {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded ${
                    currentPage === i + 1
                      ? "bg-[#F96E2A] text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              Try changing the search keywords or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
