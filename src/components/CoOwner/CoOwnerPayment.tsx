// src/components/CoOwner/CoOwnerPayment.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo } from "../../api/authApi";

// =========================
// VNPAY CONFIG – CẦN SỬA LẠI CHO HỢP LÝ
// =========================
const VNPAY_TMN_CODE = "YOUR_VNP_TMN_CODE"; // Thay bằng mã Website/TmnCode của bạn
const VNPAY_HASH_SECRET = "YOUR_VNP_HASH_SECRET"; // ⚠️ Nên để ở BE, đây chỉ là demo
const VNPAY_PAYMENT_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Sandbox

// =========================
// Helpers
// =========================

// Chuyển ArrayBuffer -> hex string (uppercase)
const toHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

// Tính HMAC SHA512 bằng Web Crypto
const hmacSHA512 = async (secret: string, data: string): Promise<string> => {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toHex(signature);
};

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface CoOwnerPaymentProps {
  groupId?: number;
}

const CoOwnerPayment: React.FC<CoOwnerPaymentProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const params = useParams<{ groupId?: string }>();
  const userInfo = getUserInfo() as any | null;

  // ==== Resolve groupId (prop -> URL -> userInfo) ====
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const _groupId: number =
    groupId ??
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  // FORM PAYMENT
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creatingUrl, setCreatingUrl] = useState(false);
  const [lastPaymentUrl, setLastPaymentUrl] = useState<string | null>(null);

  const parsedAmount = Number(amount || 0);

  // =========================
  // HANDLE: Tạo URL thanh toán VNPAY
  // =========================
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parsedAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (!VNPAY_TMN_CODE || !VNPAY_HASH_SECRET) {
      alert(
        "Chưa cấu hình VNPAY_TMN_CODE / VNPAY_HASH_SECRET. Vui lòng cấu hình trước."
      );
      return;
    }

    try {
      setCreatingUrl(true);

      // vnp_Amount tính theo đơn vị "đồng * 100"
      const vnp_Amount = parsedAmount * 100;

      const vnp_TxnRef = `${Date.now()}`; // Mã đơn hàng, cần unique
      const vnp_IpAddr = "127.0.0.1"; // Demo. Thực tế nên lấy từ server.
      const vnp_CreateDate = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .slice(0, 14); // yyyyMMddHHmmss

      const returnUrl = `${window.location.origin}/CoOwner/payments/vnpay-return`;

      // Params theo chuẩn VNPAY
      const params: Record<string, string> = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: VNPAY_TMN_CODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef,
        vnp_OrderInfo:
          description.trim() ||
          `Thanh toán chi phí nhóm ${_groupId} - đơn #${vnp_TxnRef}`,
        vnp_OrderType: "other",
        vnp_Amount: String(vnp_Amount),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr,
        vnp_CreateDate,
        // Custom: thêm thông tin group, user nếu muốn
        vnp_ExtraData: JSON.stringify({
          groupId: _groupId,
          userId: userInfo?.userId,
        }),
      };

      // Sắp xếp key tăng dần
      const sortedKeys = Object.keys(params).sort();

      // Chuỗi dùng để ký (hashData)
      const signData = sortedKeys
        .map((key) => {
          const value = params[key];
          // encode giống chuẩn URL, thay space bằng +
          return (
            encodeURIComponent(key) +
            "=" +
            encodeURIComponent(value).replace(/%20/g, "+")
          );
        })
        .join("&");

      // Tính HMAC SHA512
      const secureHash = await hmacSHA512(VNPAY_HASH_SECRET, signData);

      // Tạo query string để redirect
      const queryString = `${signData}&vnp_SecureHash=${secureHash}`;
      const paymentUrl = `${VNPAY_PAYMENT_URL}?${queryString}`;

      setLastPaymentUrl(paymentUrl);

      // Redirect sang VNPAY
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("CREATE VNPAY URL ERROR", err);
      alert("Không tạo được URL thanh toán VNPAY. Kiểm tra console log.");
    } finally {
      setCreatingUrl(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Nút quay lại nhóm */}
      <button
        type="button"
        onClick={() => navigate(`/CoOwner/grouppage/${_groupId}`)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 
                   px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm 
                   hover:bg-gray-100 transition"
      >
        <span className="text-lg">⬅️</span>
        Quay lại nhóm
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Thanh toán &amp; Chi phí nhóm
          </h1>
          <p className="text-sm text-gray-500">
            Tạo giao dịch thanh toán qua VNPAY cho các chi phí liên quan đến
            nhóm đồng sở hữu.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Đang thao tác cho <b>nhóm ID: {_groupId}</b>.
          </p>
        </div>
      </div>

      {/* Card thanh toán */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💰</span>
          <h2 className="text-lg font-semibold text-gray-800">
            Tạo giao dịch VNPAY
          </h2>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Nhập số tiền và nội dung cần thanh toán. Sau khi xác nhận, hệ thống sẽ
          chuyển bạn sang cổng VNPAY để hoàn tất giao dịch.
        </p>

        <form className="space-y-4" onSubmit={handleCreatePayment}>
          {/* Số tiền */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1000}
              step={1000}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ví dụ: 200000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {parsedAmount > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Số tiền:{" "}
                <span className="font-semibold">
                  {formatCurrency(parsedAmount)}
                </span>
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung thanh toán
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
              placeholder={`VD: Thanh toán phí bảo dưỡng xe, phí gửi xe, ... cho nhóm ${_groupId}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Info thêm */}
          <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-500">
            <p>
              <b>Lưu ý:</b> Đây chỉ là bước tạo URL thanh toán VNPAY. Kết quả
              giao dịch cuối cùng sẽ được VNPAY gọi về{" "}
              <span className="font-mono">vnp_ReturnUrl</span> và/hoặc server
              backend của bạn để xác nhận.
            </p>
          </div>

          <button
            type="submit"
            disabled={creatingUrl}
            className="w-full inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {creatingUrl
              ? "Đang tạo URL thanh toán..."
              : "Thanh toán với VNPAY"}
          </button>
        </form>

        {/* Hiển thị URL cuối cùng (debug / kiểm tra) */}
        {lastPaymentUrl && (
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              URL thanh toán vừa tạo (debug):
            </p>
            <p className="text-[11px] break-all text-gray-600">
              {lastPaymentUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoOwnerPayment;
