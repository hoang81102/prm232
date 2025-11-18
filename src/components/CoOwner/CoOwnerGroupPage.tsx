import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ==========================
// Types
// ==========================
type GroupMember = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  ownershipPercentage: number;
};

type Group = {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdAt?: string;
  members: GroupMember[];
};

type CreateGroupPayload = {
  name: string;
  description?: string;
};

type UpdateGroupPayload = {
  name?: string;
  description?: string;
};

type InviteMemberPayload = {
  email?: string;
  phoneNumber?: string;
};

type OwnershipUpdateItem = {
  memberId: string;
  ownershipPercentage: number;
};

// ==========================
// DỮ LIỆU MẪU (hard-code)
// ==========================
const MOCK_GROUP: Group = {
  id: "group-001",
  name: "Nhóm Đồng Sở Hữu Xe HN-01",
  description: "Nhóm sử dụng chung 2 xe tại Hà Nội.",
  code: "HN-01-COOWN",
  createdAt: "2025-11-01T10:00:00Z",
  members: [
    {
      id: "m1",
      name: "Nguyễn A",
      email: "a@example.com",
      ownershipPercentage: 40,
    },
    {
      id: "m2",
      name: "Trần B",
      email: "b@example.com",
      ownershipPercentage: 35,
    },
    {
      id: "m3",
      name: "Lê C",
      phoneNumber: "0900123456",
      ownershipPercentage: 25,
    },
  ],
};

const CoOwnerGroupPage: React.FC = () => {
  const navigate = useNavigate();

  // "My group"
  const [group, setGroup] = useState<Group | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(false);

  // CREATE GROUP
  const [createForm, setCreateForm] = useState<CreateGroupPayload>({
    name: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  // UPDATE GROUP INFO
  const [updateForm, setUpdateForm] = useState<UpdateGroupPayload>({
    name: "",
    description: "",
  });
  const [updatingInfo, setUpdatingInfo] = useState(false);

  // INVITE MEMBER
  const [inviteForm, setInviteForm] = useState<InviteMemberPayload>({
    email: "",
    phoneNumber: "",
  });
  const [inviting, setInviting] = useState(false);

  // UPDATE OWNERSHIP
  const [ownershipEdits, setOwnershipEdits] = useState<OwnershipUpdateItem[]>(
    []
  );
  const [updatingOwnership, setUpdatingOwnership] = useState(false);

  // =======================
  // (Co-owner) GET MY GROUP – fake với MOCK_GROUP
  // =======================
  const fetchMyGroup = () => {
    setLoadingGroup(true);

    setTimeout(() => {
      const data = MOCK_GROUP;

      setGroup(data);

      setUpdateForm({
        name: data.name ?? "",
        description: data.description ?? "",
      });

      setOwnershipEdits(
        (data.members ?? []).map((m) => ({
          memberId: m.id,
          ownershipPercentage: m.ownershipPercentage,
        }))
      );

      setLoadingGroup(false);
    }, 500);
  };

  useEffect(() => {
    fetchMyGroup();
  }, []);

  // =======================
  // (Co-owner) CREATE GROUP – fake
  // =======================
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.name.trim()) {
      toast.warn("Vui lòng nhập tên nhóm.");
      return;
    }

    setCreating(true);

    setTimeout(() => {
      const newGroup: Group = {
        id: "group-new-001",
        name: createForm.name,
        description: createForm.description,
        code: "NEW-COOWN-001",
        createdAt: new Date().toISOString(),
        members: [
          {
            id: "owner-self",
            name: "Bạn (Co-owner)",
            email: "you@example.com",
            ownershipPercentage: 100,
          },
        ],
      };

      setGroup(newGroup);
      setUpdateForm({
        name: newGroup.name,
        description: newGroup.description,
      });
      setOwnershipEdits(
        newGroup.members.map((m) => ({
          memberId: m.id,
          ownershipPercentage: m.ownershipPercentage,
        }))
      );

      toast.success("Tạo nhóm (demo) thành công!");
      setCreating(false);
    }, 600);
  };

  // =======================
  // (Co-owner) UPDATE GROUP INFO – fake
  // =======================
  const handleUpdateGroupInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    if (!updateForm.name?.trim()) {
      toast.warn("Tên nhóm không được để trống.");
      return;
    }

    setUpdatingInfo(true);

    setTimeout(() => {
      const updated: Group = {
        ...group,
        name: updateForm.name ?? group.name,
        description: updateForm.description ?? group.description,
      };

      setGroup(updated);
      toast.success("Đã cập nhật thông tin nhóm (demo).");
      setUpdatingInfo(false);
    }, 500);
  };

  // =======================
  // (Co-owner) INVITE MEMBER – fake
  // =======================
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) {
      toast.warn("Bạn cần có nhóm trước khi mời thành viên.");
      return;
    }

    if (!inviteForm.email && !inviteForm.phoneNumber) {
      toast.warn("Nhập ít nhất email hoặc số điện thoại.");
      return;
    }

    setInviting(true);

    setTimeout(() => {
      console.log("Fake invite payload:", {
        groupId: group.id,
        ...inviteForm,
      });

      toast.success("Đã giả lập gửi lời mời thành viên.");
      setInviteForm({ email: "", phoneNumber: "" });
      setInviting(false);
    }, 500);
  };

  // =======================
  // (Co-owner) UPDATE OWNERSHIP – fake
  // =======================
  const handleOwnershipChange = (memberId: string, value: string) => {
    const num = Number(value);
    setOwnershipEdits((prev) =>
      prev.map((item) =>
        item.memberId === memberId
          ? {
              ...item,
              ownershipPercentage: isNaN(num) ? 0 : num,
            }
          : item
      )
    );
  };

  const handleUpdateOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    const total = ownershipEdits.reduce(
      (sum, item) => sum + (item.ownershipPercentage || 0),
      0
    );

    if (Math.round(total) !== 100) {
      toast.warn("Tổng % sở hữu phải đúng 100%.");
      return;
    }

    setUpdatingOwnership(true);

    setTimeout(() => {
      const newMembers: GroupMember[] = group.members.map((m) => {
        const edited = ownershipEdits.find((o) => o.memberId === m.id);
        return edited
          ? { ...m, ownershipPercentage: edited.ownershipPercentage }
          : m;
      });

      setGroup({ ...group, members: newMembers });
      toast.success("Đã cập nhật tỷ lệ sở hữu (demo).");
      setUpdatingOwnership(false);
    }, 600);
  };

  // =======================
  // Handler: chuyển tới Onboarding
  // =======================
  const handleGoToOnboarding = () => {
    navigate("/CoOwner/grouppage/onboarding");
  };

  // =======================
  // UI
  // =======================
  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-slate-800">
            Nhóm đồng sở hữu
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Quản lý nhóm đồng sở hữu xe: xem thông tin nhóm, chỉnh sửa, mời
            thành viên và điều chỉnh tỷ lệ sở hữu. Mọi thao tác hiện tại đang ở
            chế độ <span className="font-semibold">demo</span>.
          </p>
        </div>

        {/* Nút tạo nhóm mới → /CoOwner/Onboarding */}
        <button
          onClick={handleGoToOnboarding}
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200"
        >
          <span className="mr-2 text-lg">➕</span>
          <span>Tạo nhóm mới</span>
        </button>
      </div>

      {/* Tip banner nhỏ */}
      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div className="text-sm text-orange-800">
          <p className="font-semibold">Mẹo nhỏ</p>
          <p>
            Khi đã làm xong UI, bạn chỉ cần thay phần
            <span className="font-mono px-1">setTimeout</span> bằng gọi API thật
            của hệ thống.
          </p>
        </div>
      </div>

      {/* Top: Group info + Create / Update */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <h2 className="text-lg font-semibold text-slate-800">
                {loadingGroup
                  ? "Đang tải nhóm..."
                  : group
                  ? "Nhóm của bạn"
                  : "Bạn chưa có nhóm"}
              </h2>
            </div>

            <button
              className="inline-flex items-center text-[11px] px-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
              onClick={fetchMyGroup}
            >
              🔄
              <span className="ml-1 font-medium">Tải lại (GET MY GROUP)</span>
            </button>
          </div>

          {loadingGroup ? (
            <p className="text-sm text-slate-500">Đang tải dữ liệu demo...</p>
          ) : group ? (
            <>
              <div className="mb-5 rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Tên nhóm
                    </p>
                    <p className="text-xl font-semibold text-slate-900">
                      {group.name}
                    </p>
                  </div>

                  {group.code && (
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Mã nhóm</p>
                      <p className="font-mono text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg inline-block">
                        {group.code}
                      </p>
                    </div>
                  )}
                </div>

                {group.description && (
                  <p className="mt-2 text-sm text-slate-700">
                    {group.description}
                  </p>
                )}

                {group.createdAt && (
                  <p className="mt-1 text-xs text-slate-400">
                    Tạo ngày:{" "}
                    {new Date(group.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Thành viên ({group.members.length})
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-500">
                    Demo dữ liệu mẫu
                  </span>
                </div>
                <div className="space-y-2">
                  {group.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {m.name || "Thành viên"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {m.email || m.phoneNumber || "Không có liên hệ"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {m.ownershipPercentage}%
                        </p>
                        <p className="text-xs text-slate-500">Tỷ lệ sở hữu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Bạn chưa thuộc nhóm nào. Có thể bấm{" "}
              <span className="font-semibold">“Tạo nhóm mới”</span> ở góc trên
              phải để vào bước onboarding, hoặc dùng form bên phải để xem demo
              tạo nhóm.
            </div>
          )}
        </div>

        {/* Right: Create / Update group */}
        <div className="space-y-4">
          {/* CREATE GROUP (chỉ hiện khi chưa có group) */}
          {!group && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✨</span>
                <h2 className="text-lg font-semibold text-slate-800">
                  Tạo nhóm mới (demo)
                </h2>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Đây là form demo. Khi có API thật, bạn chỉ cần gọi endpoint
                (Co-owner) CREATE GROUP ở đây.
              </p>

              <form className="space-y-3" onSubmit={handleCreateGroup}>
                <div>
                  <label className="text-sm text-slate-700 block mb-1">
                    Tên nhóm *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Nhóm đồng sở hữu xe HN..."
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700 block mb-1">
                    Mô tả
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3}
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả ngắn về nhóm..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {creating ? "Đang tạo nhóm..." : "Tạo nhóm demo"}
                </button>
              </form>
            </div>
          )}

          {/* UPDATE GROUP INFO */}
          {group && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📝</span>
                <h2 className="text-lg font-semibold text-slate-800">
                  Cập nhật thông tin nhóm (demo)
                </h2>
              </div>

              <form className="space-y-3" onSubmit={handleUpdateGroupInfo}>
                <div>
                  <label className="text-sm text-slate-700 block mb-1">
                    Tên nhóm *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={updateForm.name}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700 block mb-1">
                    Mô tả
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3}
                    value={updateForm.description}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingInfo}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  {updatingInfo
                    ? "Đang lưu thay đổi..."
                    : "Lưu thay đổi (demo)"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Invite + Ownership */}
      {group && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INVITE MEMBER */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📨</span>
              <h2 className="text-lg font-semibold text-slate-800">
                Mời thành viên (demo)
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleInviteMember}>
              <div>
                <label className="text-sm text-slate-700 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700 block mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={inviteForm.phoneNumber}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="09xxxxxxxx"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Chỉ cần điền <b>email</b> hoặc <b>số điện thoại</b>.
                </p>
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {inviting ? "Đang gửi lời mời..." : "Gửi lời mời (demo)"}
              </button>
            </form>
          </div>

          {/* UPDATE OWNERSHIP */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <h2 className="text-lg font-semibold text-slate-800">
                Cập nhật tỷ lệ sở hữu (demo)
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleUpdateOwnership}>
              <div className="space-y-2">
                {group.members.map((m) => {
                  const current = ownershipEdits.find(
                    (o) => o.memberId === m.id
                  );
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {m.name || "Thành viên"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {m.email || m.phoneNumber || ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
                          value={current?.ownershipPercentage ?? 0}
                          onChange={(e) =>
                            handleOwnershipChange(m.id, e.target.value)
                          }
                        />
                        <span className="text-sm text-slate-700">%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500">
                Tổng % tất cả thành viên phải đúng{" "}
                <span className="font-semibold">100%</span>.
              </p>

              <button
                type="submit"
                disabled={updatingOwnership}
                className="w-full inline-flex items-center justify-center rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 disabled:opacity-60"
              >
                {updatingOwnership ? "Đang cập nhật..." : "Lưu thay đổi (demo)"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoOwnerGroupPage;
