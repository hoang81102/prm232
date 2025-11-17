import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { StoredApplication } from "../mocks/applicationsStore";
import { addApplication, fileToBase64 } from "../mocks/applicationsStore";

const ACCEPTED_MIME = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 5;

const ApplicantUploadForm: React.FC = () => {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [groupSize, setGroupSize] = useState<number>(2);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const onChooseFile = (f: File | null) => {
    setErrMsg(null);
    if (!f) return setFile(null);
    if (!ACCEPTED_MIME.includes(f.type)) {
      setErrMsg("Chỉ chấp nhận file .doc hoặc .docx");
      return setFile(null);
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrMsg(`Kích thước tối đa ${MAX_SIZE_MB}MB`);
      return setFile(null);
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);
    if (!applicantName || !email || !phone || !file) {
      setErrMsg("Vui lòng nhập đủ thông tin và chọn file .doc/.docx");
      return;
    }

    try {
      setSubmitting(true);
      const base64 = await fileToBase64(file);

      const app: StoredApplication = {
        id: `APP-${Date.now()}`,
        applicantName,
        email,
        phone,
        groupSize,
        notes,
        createdAt: new Date().toISOString(),
        status: "pending",
        documentName: file.name,
        documentMime: file.type,
        documentBase64: base64,
      };

      addApplication(app);
      setOkMsg("✅ Đã gửi đơn thành công! Admin sẽ tiếp nhận và xem file.");
      setApplicantName("");
      setEmail("");
      setPhone("");
      setGroupSize(2);
      setNotes("");
      setFile(null);
    } catch {
      setErrMsg("❌ Có lỗi khi xử lý file. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] relative">
      {/* Nút quay lại */}
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-[#78B3CE] bg-white px-3 py-2 text-[#78B3CE] hover:bg-[#C9E6F0] transition-colors"
        title="Quay lại trang chủ"
      >
        ← Trang chủ
      </Link>

      {/* Căn giữa toàn bộ */}
      <div className="min-h-screen grid place-items-center px-4">
        <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold text-[#78B3CE] mb-4 text-center">
            Gửi đơn đăng ký thuê xe đa thành viên
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Thông tin cơ bản */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Họ tên*</label>
                <input
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full mt-1 p-3 border-2 border-[#C9E6F0] rounded-xl"
                  placeholder="Nguyen Van A"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-3 border-2 border-[#C9E6F0] rounded-xl"
                  placeholder="a@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Số điện thoại*</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-3 border-2 border-[#C9E6F0] rounded-xl"
                  placeholder="090xxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Số thành viên nhóm</label>
                <input
                  type="number"
                  min={1}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value || "1"))}
                  className="w-full mt-1 p-3 border-2 border-[#C9E6F0] rounded-xl"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="text-sm text-gray-600">Ghi chú</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 p-3 border-2 border-[#C9E6F0] rounded-xl"
                rows={3}
              />
            </div>

            {/* Nút chọn tệp */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                File đơn (.doc/.docx)*
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer px-4 py-2 bg-[#78B3CE] text-white rounded-lg hover:bg-[#5ea3c4] transition-colors"
                >
                  Chọn tệp
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                {file && (
                  <span className="text-sm text-gray-700">
                    📄 {file.name}
                  </span>
                )}
              </div>
            </div>

            {/* Thông báo lỗi / thành công */}
            {errMsg && (
              <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                {errMsg}
              </div>
            )}
            {okMsg && (
              <div className="p-3 rounded bg-green-50 text-green-700 text-sm">
                {okMsg}
              </div>
            )}

            {/* Nút gửi */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl bg-[#78B3CE] text-white hover:bg-[#5ea3c4] disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Gửi đơn"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantUploadForm;
