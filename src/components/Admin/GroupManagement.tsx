import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** ========= TYPES ========= */
type GroupStatus = "active" | "inactive" | "pending";

type Group = {
  id: string;
  name: string;
  code: string;
  members: number;
  vehicles: number;
  location: string;
  createdAt: string; // ISO date
  status: GroupStatus;
};

type SortField = "name" | "members" | "vehicles" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

/** ========= MOCK DATA (thay cho GET ALL GROUPS API) ========= */

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Nhóm EV Hà Nội 1",
    code: "HN-EV-01",
    members: 5,
    vehicles: 2,
    location: "Hà Nội",
    createdAt: "2025-01-10T09:00:00.000Z",
    status: "active",
  },
  {
    id: "g2",
    name: "Nhóm VinFast Sài Gòn",
    code: "SG-VF-01",
    members: 8,
    vehicles: 3,
    location: "TP. Hồ Chí Minh",
    createdAt: "2025-02-05T10:30:00.000Z",
    status: "active",
  },
  {
    id: "g3",
    name: "Nhóm EV Đà Nẵng",
    code: "DN-EV-01",
    members: 4,
    vehicles: 1,
    location: "Đà Nẵng",
    createdAt: "2025-03-20T14:15:00.000Z",
    status: "pending",
  },
  {
    id: "g4",
    name: "Nhóm Test Inactive",
    code: "TEST-99",
    members: 3,
    vehicles: 1,
    location: "Hà Nội",
    createdAt: "2024-12-01T08:00:00.000Z",
    status: "inactive",
  },
];

async function getAllGroups(): Promise<Group[]> {
  // sau này thay bằng gọi API thật
  return Promise.resolve(MOCK_GROUPS);
}

/** ========= COMPONENT ========= */

const GroupManagement: React.FC = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | GroupStatus>("all");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getAllGroups();
        setGroups(data);
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const filteredAndSortedGroups = groups
    .filter((g) => {
      if (statusFilter === "all") return true;
      return g.status === statusFilter;
    })
    .filter((g) => {
      const kw = searchTerm.toLowerCase();
      return (
        `${g.name} ${g.code} ${g.location} ${g.status}`
          .toLowerCase()
          .includes(kw) ||
        String(g.members).includes(kw) ||
        String(g.vehicles).includes(kw)
      );
    })
    .sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "members":
          aVal = a.members;
          bVal = b.members;
          break;
        case "vehicles":
          aVal = a.vehicles;
          bVal = b.vehicles;
          break;
        case "status":
          aVal = a.status.toLowerCase();
          bVal = b.status.toLowerCase();
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          aVal = 0;
          bVal = 0;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedGroups.length / itemsPerPage)
  );

  const paginatedGroups = filteredAndSortedGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const statusBadgeClass = (status: GroupStatus) => {
    if (status === "active") return "bg-emerald-100 text-emerald-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#78B3CE] mb-2">
          Group Management
        </h1>
        <p className="text-gray-600 mb-4">
          Danh sách tất cả các nhóm đồng sở hữu xe trong hệ thống.
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm theo tên nhóm, mã nhóm, địa điểm, trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-[#C9E6F0] rounded-xl"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Filter status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | GroupStatus)
            }
            className="p-3 border-2 border-[#C9E6F0] rounded-xl bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>

          {/* Sort select */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="p-3 border-2 border-[#C9E6F0] rounded-xl bg-white"
          >
            <option value="name-asc">Tên nhóm A-Z</option>
            <option value="name-desc">Tên nhóm Z-A</option>
            <option value="members-desc">Thành viên nhiều → ít</option>
            <option value="members-asc">Thành viên ít → nhiều</option>
            <option value="vehicles-desc">Số xe nhiều → ít</option>
            <option value="vehicles-asc">Số xe ít → nhiều</option>
            <option value="createdAt-desc">Mới tạo → cũ</option>
            <option value="createdAt-asc">Cũ → mới</option>
            <option value="status-asc">Trạng thái A-Z</option>
            <option value="status-desc">Trạng thái Z-A</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#78B3CE]">
            Group List ({filteredAndSortedGroups.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full rounded-2xl overflow-hidden shadow border">
            <thead className="bg-[#C9E6F0]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                  >
                    <span>TÊN NHÓM</span>
                    <span className="text-xs">
                      {sortBy === "name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>

                <th className="px-6 py-4 text-left font-semibold text-[#78B3CE]">
                  MÃ NHÓM
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("members")}
                    className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                  >
                    <span>THÀNH VIÊN</span>
                    <span className="text-xs">
                      {sortBy === "members"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("vehicles")}
                    className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                  >
                    <span>SỐ XE</span>
                    <span className="text-xs">
                      {sortBy === "vehicles"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                  >
                    <span>NGÀY TẠO</span>
                    <span className="text-xs">
                      {sortBy === "createdAt"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>

                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                  >
                    <span>TRẠNG THÁI</span>
                    <span className="text-xs">
                      {sortBy === "status"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>

                <th className="px-6 py-4 text-left font-semibold text-[#78B3CE]">
                  ĐỊA ĐIỂM
                </th>

                <th className="px-6 py-4 text-left font-semibold text-[#78B3CE]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedGroups.map((g, index) => (
                <tr
                  key={g.id}
                  className={`hover:bg-[#FBF8EF] transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {g.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      {g.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {g.members}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {g.vehicles}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(g.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                        g.status
                      )}`}
                    >
                      {g.status === "active"
                        ? "Đang hoạt động"
                        : g.status === "pending"
                        ? "Chờ duyệt"
                        : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {g.location}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/groups/${g.id}`)}
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

        {/* PAGINATION */}
        {filteredAndSortedGroups.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} / {totalPages}
            </div>

            <div className="flex items-center gap-2">
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

        {/* EMPTY STATE */}
        {filteredAndSortedGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhóm nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupManagement;
