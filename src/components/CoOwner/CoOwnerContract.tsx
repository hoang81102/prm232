// src/components/CoOwner/CoOwnerContract.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createContract,
  getContractByGroup,
  signContract,
  type Contract,
} from "../../api/contractApi";
import { getUserInfo } from "../../api/authApi";
import { getGroupById } from "../../api/groupApi";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Không rõ";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
};

const CoOwnerContract: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ groupId?: string }>();
  const userInfo = getUserInfo() as any | null;

  // ==== Resolve groupId (URL -> userInfo -> default 1) ====
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const groupId: number =
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  const currentUserId: number = (userInfo?.userId as number | undefined) ?? 0;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [signing, setSigning] = useState(false);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);

  // NEW: trạng thái mở/đóng form tạo hợp đồng mới
  const [showCreateForm, setShowCreateForm] = useState(false); // NEW

  const [newContent, setNewContent] = useState(
    `Nội dung hợp đồng đồng sở hữu xe của nhóm #${groupId}.\n\n` +
      `Các bên cam kết tuân thủ đầy đủ các điều khoản về việc sử dụng, bảo dưỡng, ` +
      `chia sẻ chi phí và trách nhiệm liên quan đến chiếc xe thuộc nhóm.`
  );

  // ==== LOAD CONTRACT ====
  const loadContract = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContractByGroup(groupId);
      setContract(data);
    } catch (err) {
      // toast đã xử lý trong api
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // ==== CHECK USER CÓ PHẢI ADMIN NHÓM KHÔNG ====
  const loadIsAdmin = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const g = await getGroupById(groupId);
      const me = g.members.find((m) => m.userId === currentUserId);
      setIsGroupAdmin(Boolean(me?.isAdmin));
    } catch (err) {
      console.error("CHECK GROUP ADMIN ERROR", err);
      setIsGroupAdmin(false);
    }
  }, [groupId, currentUserId]);

  useEffect(() => {
    void loadContract();
    void loadIsAdmin();
  }, [loadContract, loadIsAdmin]);

  // ==== STATUS & CURRENT USER SIGN ====
  const hasContract = !!contract;

  const currentSignature = contract?.signatures.find(
    (s) => s.userId === currentUserId
  );

  const allSigned =
    contract?.signatures.length &&
    contract.signatures.every((s) => s.hasSigned) === true;

  const someSigned =
    contract?.signatures.length &&
    contract.signatures.some((s) => s.hasSigned) === true;

  let statusLabel = "Chưa có hợp đồng";
  let statusColor = "bg-gray-100 text-gray-700";

  if (hasContract) {
    if (allSigned) {
      statusLabel = "Đã ký đầy đủ";
      statusColor = "bg-emerald-100 text-emerald-700";
    } else if (someSigned) {
      statusLabel = "Đang thu thập chữ ký";
      statusColor = "bg-blue-100 text-blue-700";
    } else {
      statusLabel = "Chưa có chữ ký nào";
      statusColor = "bg-yellow-100 text-yellow-700";
    }
  }

  const canSign = !!contract && !currentSignature?.hasSigned;

  // ==== HANDLE CREATE CONTRACT (CHỈ ADMIN) ====
  const handleCreate = async () => {
    if (!isGroupAdmin) {
      alert("Chỉ trưởng nhóm / admin nhóm mới có quyền tạo hợp đồng.");
      return;
    }
    if (!groupId) return;
    if (!newContent.trim()) {
      alert("Vui lòng nhập nội dung hợp đồng.");
      return;
    }

    try {
      setCreating(true);
      const created = await createContract({
        coOwnerGroupId: groupId,
        content: newContent,
      });
      setContract(created);
      setShowCreateForm(false); // NEW: đóng form sau khi tạo xong
    } finally {
      setCreating(false);
    }
  };

  // ==== HANDLE SIGN ====
  const handleSign = async () => {
    if (!contract) return;
    try {
      setSigning(true);
      await signContract(contract.contractId);
      await loadContract(); // reload trạng thái chữ ký
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header + nút quay lại */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hợp đồng đồng sở hữu
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Nhóm ID:{" "}
              <span className="font-semibold text-gray-800">#{groupId}</span>
            </p>
            <p className="text-xs text-gray-400">
              Bạn đang đăng nhập với User ID:{" "}
              <span className="font-mono">{currentUserId || "Không rõ"}</span> •
              Vai trò trong nhóm:{" "}
              <span className="font-semibold">
                {isGroupAdmin ? "Trưởng nhóm / Admin" : "Thành viên"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* NEW: nút tạo hợp đồng mới, chỉ admin thấy */}
            {isGroupAdmin && (
              <button
                type="button"
                onClick={() => setShowCreateForm((v) => !v)}
                className="inline-flex items-center rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-600"
              >
                {showCreateForm ? "Đóng form tạo mới" : "📄 Tạo hợp đồng mới"}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                navigate(`/CoOwner/grouppage/${groupId.toString()}`)
              }
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100"
            >
              ← Quay lại nhóm
            </button>
          </div>
        </div>

        {/* Card trạng thái */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Trạng thái hợp đồng của nhóm này:
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isGroupAdmin
                ? "Bạn là trưởng nhóm, có quyền tạo và theo dõi tình trạng ký."
                : "Bạn là thành viên, có thể xem và ký hợp đồng (khi trưởng nhóm đã tạo)."}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 px-5 py-4 text-sm text-gray-500 text-center">
            Đang tải thông tin hợp đồng...
          </div>
        )}

        {/* FORM TẠO HỢP ĐỒNG MỚI – chỉ hiện khi admin bật nút */}
        {isGroupAdmin && showCreateForm && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Tạo hợp đồng đồng sở hữu mới
            </h2>
            <p className="text-sm text-gray-500">
              Chỉ bạn (trưởng nhóm / admin) có quyền tạo hợp đồng. Sau khi tạo,
              các thành viên sẽ có thể xem và ký.
            </p>

            <textarea
              rows={8}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-600 disabled:opacity-60"
              >
                {creating ? "Đang tạo..." : "📄 Lưu hợp đồng"}
              </button>
            </div>
          </div>
        )}

        {/* Nếu đã có hợp đồng */}
        {!loading && hasContract && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Nội dung hợp đồng hiện tại
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Tạo lúc:{" "}
                  <span className="font-medium">
                    {formatDateTime(contract?.createdAt)}
                  </span>
                </p>
              </div>

              {canSign ? (
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={signing}
                  className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-xs md:text-sm font-medium text-white shadow hover:bg-emerald-600 disabled:opacity-60"
                >
                  {signing ? "Đang ký..." : "✍️ Ký xác nhận"}
                </button>
              ) : (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {currentSignature?.hasSigned
                    ? "Bạn đã ký hợp đồng này"
                    : "Không thể ký (chưa có thông tin người dùng)"}
                </span>
              )}
            </div>

            <div className="border rounded-xl bg-slate-50 px-4 py-3 max-h-[360px] overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
              {contract?.content}
            </div>

            {/* Bảng chữ ký */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Trạng thái chữ ký của các thành viên
              </h3>
              {contract?.signatures.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Chưa có danh sách chữ ký nào từ backend.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-3 py-2 text-left font-medium">
                          User ID
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Trạng thái
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Thời gian ký
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contract?.signatures.map((s) => (
                        <tr
                          key={s.userId}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 font-mono">{s.userId}</td>
                          <td className="px-3 py-2">
                            {s.hasSigned ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                ✅ Đã ký
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                                ⏳ Chưa ký
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {s.hasSigned ? formatDateTime(s.signedAt) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nếu CHƯA có hợp đồng và cũng chưa bật form mới */}
        {!loading && !hasContract && !showCreateForm && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Chưa có hợp đồng cho nhóm này
            </h2>

            {isGroupAdmin ? (
              <p className="text-sm text-gray-500">
                Bạn là <span className="font-semibold">trưởng nhóm</span>. Bấm{" "}
                <span className="font-semibold">“Tạo hợp đồng mới”</span> ở góc
                trên để soạn và tạo hợp đồng cho nhóm.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Hiện nhóm chưa có hợp đồng đồng sở hữu. Chỉ{" "}
                <span className="font-semibold">trưởng nhóm / admin nhóm</span>{" "}
                mới có quyền tạo hợp đồng. Vui lòng liên hệ trưởng nhóm nếu bạn
                cần xem hoặc ký hợp đồng.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoOwnerContract;
