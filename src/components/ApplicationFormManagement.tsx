import React, { useEffect, useMemo, useState } from "react";
import {
  downloadDoc,
  listApplications,
  updateStatus,
} from "../mocks/applicationsStore";
import type {
  ApplicationStatus,
  StoredApplication,
} from "../mocks/applicationsStore";

type SortField = "createdAt" | "applicantName" | "email" | "phone" | "status";
type SortOrder = "asc" | "desc";

const ApplicationFormManagement: React.FC = () => {
  const [apps, setApps] = useState<StoredApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const reload = () => setApps(listApplications());

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy, sortOrder]);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return apps
      .filter((a) =>
        statusFilter === "all" ? true : a.status === statusFilter
      )
      .filter((a) =>
        [a.id, a.applicantName, a.email, a.phone, a.status, a.documentName]
          .join(" ")
          .toLowerCase()
          .includes(kw)
      )
      .sort((a, b) => {
        const aV = (a[sortBy] as string)?.toString().toLowerCase();
        const bV = (b[sortBy] as string)?.toString().toLowerCase();
        return sortOrder === "asc"
          ? aV.localeCompare(bV)
          : bV.localeCompare(aV);
      });
  }, [apps, search, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleApprove = (id: string) => {
    updateStatus(id, "approved");
    reload();
  };

  const handleReject = (id: string) => {
    updateStatus(id, "rejected");
    reload();
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-[#78B3CE] mb-2">
          Multi-member EV Rental — Applications
        </h1>
        <p className="text-gray-600 mb-4">
          Admin tiếp nhận đơn: tải xuống file .doc/.docx để xem, sau đó chấp
          nhận hoặc từ chối.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo ID, tên, email, phone, trạng thái, tên file…"
              className="w-full p-3 pl-10 border-2 border-[#C9E6F0] rounded-xl"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ApplicationStatus | "all")
            }
            className="p-3 border-2 border-[#C9E6F0] rounded-xl bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#78B3CE]">
            Applications ({filtered.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#C9E6F0]">
              <tr>
                {(
                  [
                    "createdAt",
                    "applicantName",
                    "email",
                    "phone",
                    "status",
                  ] as const
                ).map((field) => (
                  <th key={field} className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort(field)}
                      className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                    >
                      <span>{field === "createdAt" ? "Created" : field}</span>
                      <span className="text-xs">
                        {sortBy === field
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-6 py-3 text-left font-semibold text-[#78B3CE]">
                  File
                </th>
                <th className="px-6 py-3 text-left font-semibold text-[#78B3CE]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageItems.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-[#FBF8EF]`}
                >
                  <td className="px-6 py-3">{fmtDate(a.createdAt)}</td>
                  <td className="px-6 py-3">{a.applicantName}</td>
                  <td className="px-6 py-3">{a.email}</td>
                  <td className="px-6 py-3">{a.phone}</td>
                  <td className="px-6 py-3 capitalize">{a.status}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => downloadDoc(a)}
                      className="px-3 py-1 rounded-lg bg-white border border-[#78B3CE] text-[#78B3CE] hover:bg-[#C9E6F0]"
                      title={`Tải xuống ${a.documentName}`}
                    >
                      Download
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.documentName}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(a.id)}
                        className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Chưa có đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              Page {page} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded border text-sm disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 rounded text-sm ${
                    page === i + 1 ? "bg-[#F96E2A] text-white" : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded border text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationFormManagement;
