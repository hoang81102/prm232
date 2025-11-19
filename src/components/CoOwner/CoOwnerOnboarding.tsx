import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type GroupAction = "create" | "join";

interface Step {
  id: number;
  title: string;
  icon: string;
  desc: string;
}

interface FormDataState {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  address: string;
  // Step 2
  idNumber: string;
  idIssueDate: string;
  driverLicense: string;
  // Step 3
  groupAction: GroupAction;
  groupName: string;
  groupCode: string;
  // Step 4
  ownershipPercent: string;
  initialPayment: string;
  // Step 5
  termsAccepted: boolean;
}

const steps: Step[] = [
  { id: 1, title: "Thông tin cá nhân", icon: "👤", desc: "Họ tên, liên hệ" },
  { id: 2, title: "Xác thực giấy tờ", icon: "📄", desc: "CMND/CCCD, GPLX" },
  { id: 3, title: "Tạo/Gia nhập nhóm", icon: "👥", desc: "Nhóm đồng sở hữu" },
  { id: 4, title: "Thiết lập sở hữu", icon: "💰", desc: "Tỷ lệ & chi phí" },
  { id: 5, title: "Ký hợp đồng", icon: "✍️", desc: "Xác nhận điều khoản" },
];

const CoOwnerOnboarding: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>({
    // Step 1
    fullName: "",
    phone: "",
    email: "",
    address: "",
    // Step 2
    idNumber: "",
    idIssueDate: "",
    driverLicense: "",
    // Step 3
    groupAction: "create",
    groupName: "",
    groupCode: "",
    // Step 4
    ownershipPercent: "20",
    initialPayment: "",
    // Step 5
    termsAccepted: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = (): void => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = (): void => {
    alert(
      "Hoàn thành onboarding! (demo)\n\nDữ liệu gửi lên BE sẽ là:\n" +
        JSON.stringify(formData, null, 2)
    );
  };

  const handleBackToGroup = (): void => {
    // 👇 chỉnh lại path nếu GroupPage của bạn khác
    navigate("/CoOwner/grouppage");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Onboarding Co-owner
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Hoàn thành các bước dưới đây để trở thành{" "}
              <span className="font-semibold">thành viên đồng sở hữu xe</span>.
              Thời gian chỉ khoảng vài phút.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Nút quay lại GroupPage */}
            <button
              type="button"
              onClick={handleBackToGroup}
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              <span className="mr-1 text-sm">←</span>
              Về trang nhóm
            </button>

            {/* Info step nhỏ */}
            <div className="rounded-2xl bg-white border border-slate-100 px-4 py-2 text-xs text-slate-500 shadow-sm">
              <p>
                <span className="font-semibold text-slate-700">
                  Bước {currentStep}/{steps.length}
                </span>{" "}
                – {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress + Stepper */}
        <div className="rounded-2xl bg-white border border-slate-100 px-4 py-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <div key={step.id} className="relative flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm transition-all duration-200",
                        isActive || isDone
                          ? "border-orange-500 bg-orange-500 text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-400"
                      )}
                    >
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    <p className="mt-2 max-w-[90px] text-center text-[11px] font-medium text-slate-700">
                      {step.title}
                    </p>
                    <p className="mt-0.5 max-w-[90px] text-center text-[10px] text-slate-400">
                      {step.desc}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-5 left-[60%] right-[-40%] h-0.5 rounded-full transition-colors duration-200",
                        isDone ? "bg-orange-500" : "bg-slate-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card container */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-md overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span>{steps[currentStep - 1].icon}</span>
                <span>
                  Bước {currentStep}: {steps[currentStep - 1].title}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Điền thông tin chính xác để việc xét duyệt diễn ra nhanh hơn.
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Họ và tên *
                    </label>
                    <input
                      id="fullName"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Số điện thoại *
                    </label>
                    <input
                      id="phone"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="0912345678"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Địa chỉ
                    </label>
                    <textarea
                      id="address"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Số nhà, đường, quận, thành phố"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500">
                  💡 Nên dùng{" "}
                  <span className="font-semibold">
                    email & số điện thoại đang sử dụng
                  </span>{" "}
                  để dễ nhận thông báo lịch xe, chi phí, nhắc nhở…
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="idNumber"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Số CMND/CCCD *
                    </label>
                    <input
                      id="idNumber"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.idNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idNumber: e.target.value,
                        })
                      }
                      placeholder="001234567890"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="idIssueDate"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Ngày cấp
                    </label>
                    <input
                      id="idIssueDate"
                      type="date"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.idIssueDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idIssueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="driverLicense"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Số GPLX *
                  </label>
                  <input
                    id="driverLicense"
                    className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    value={formData.driverLicense}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driverLicense: e.target.value,
                      })
                    }
                    placeholder="B1-001234567"
                  />
                </div>

                <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">
                    📸 Tải lên ảnh CMND/CCCD mặt trước & mặt sau, cùng với GPLX
                    để hệ thống xác thực nhanh hơn.
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    <span className="mr-2">📂</span>
                    Chọn file (demo)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Bạn muốn làm gì?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center space-x-3 rounded-2xl border px-3 py-3 text-sm shadow-sm hover:border-orange-400 hover:bg-orange-50/50">
                      <input
                        type="radio"
                        name="groupAction"
                        value="create"
                        checked={formData.groupAction === "create"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupAction: e.target.value as GroupAction,
                          })
                        }
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          Tạo nhóm mới
                        </p>
                        <p className="text-xs text-slate-500">
                          Bạn là người khởi tạo nhóm đồng sở hữu.
                        </p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center space-x-3 rounded-2xl border px-3 py-3 text-sm shadow-sm hover:border-orange-400 hover:bg-orange-50/50">
                      <input
                        type="radio"
                        name="groupAction"
                        value="join"
                        checked={formData.groupAction === "join"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupAction: e.target.value as GroupAction,
                          })
                        }
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          Gia nhập nhóm có sẵn
                        </p>
                        <p className="text-xs text-slate-500">
                          Dùng mã mời mà chủ nhóm đã gửi cho bạn.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.groupAction === "create" ? (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Tên nhóm *
                    </label>
                    <input
                      id="groupName"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.groupName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          groupName: e.target.value,
                        })
                      }
                      placeholder="Nhóm EV Hà Nội 2025"
                    />
                    <p className="text-xs text-slate-500">
                      Ví dụ: <i>Nhóm EV Gia Định</i>, <i>Nhóm ĐH Bách Khoa</i>…
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="groupCode"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Mã mời nhóm *
                    </label>
                    <input
                      id="groupCode"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.groupCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          groupCode: e.target.value,
                        })
                      }
                      placeholder="ABC123XYZ"
                    />
                    <p className="text-xs text-slate-500">
                      Mã này do chủ nhóm hoặc ban quản lý gửi cho bạn.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ownershipPercent"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Tỷ lệ sở hữu (%) *
                    </label>
                    <input
                      id="ownershipPercent"
                      type="number"
                      min={1}
                      max={100}
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.ownershipPercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ownershipPercent: e.target.value,
                        })
                      }
                      placeholder="20"
                    />
                    <p className="text-xs text-slate-500">
                      Ảnh hưởng đến chi phí cố định & quyền sử dụng.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="initialPayment"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Khoản thanh toán ban đầu
                    </label>
                    <input
                      id="initialPayment"
                      className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={formData.initialPayment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initialPayment: e.target.value,
                        })
                      }
                      placeholder="50,000,000 VNĐ"
                    />
                    <p className="text-xs text-slate-500">
                      Đây là khoản góp vốn ban đầu (nếu có).
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3">
                  <h4 className="mb-1 text-sm font-semibold text-orange-900">
                    Cách chia chi phí (tham khảo):
                  </h4>
                  <ul className="space-y-1 text-sm text-orange-900/90">
                    <li>• Chi phí cố định: Chia theo tỷ lệ sở hữu.</li>
                    <li>
                      • Chi phí vận hành (sạc, phí đường…): Theo mức sử dụng.
                    </li>
                    <li>
                      • Chi phí bảo trì: Chia đều hoặc theo thỏa thuận của nhóm.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <h4 className="mb-4 text-base font-bold text-slate-900">
                    HỢP ĐỒNG ĐỒNG SỞ HỮU XE ĐIỆN (BẢN TÓM TẮT)
                  </h4>
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">
                    Hôm nay, ngày {new Date().toLocaleDateString("vi-VN")},
                    chúng tôi:
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">
                    <strong>BÊN A:</strong> Nhóm đồng sở hữu xe điện.
                    <br />
                    <strong>BÊN B:</strong>{" "}
                    {formData.fullName || "[Tên của bạn]"}.
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">
                    <strong>THỎA THUẬN CHUNG:</strong>
                    <br />
                    1. Bên B tham gia đồng sở hữu với tỷ lệ{" "}
                    <strong>{formData.ownershipPercent || "…"}%</strong>.
                    <br />
                    2. Bên B có quyền sử dụng xe theo lịch được phân bổ.
                    <br />
                    3. Chi phí vận hành được chia theo tỷ lệ sở hữu và/hoặc mức
                    sử dụng thực tế.
                    <br />
                    4. Các quyết định quan trọng cần sự đồng thuận của các thành
                    viên theo quy chế nhóm.
                    <br />
                    5. Hợp đồng có hiệu lực kể từ ngày ký và được điều chỉnh khi
                    các bên thống nhất.
                    <br />
                    ...
                  </p>
                  <p className="text-sm italic text-slate-500">
                    [Bản hợp đồng chi tiết sẽ được hiển thị và ký số sau khi bạn
                    hoàn tất onboarding.]
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termsAccepted: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-relaxed text-slate-700"
                  >
                    Tôi đã đọc và đồng ý với các điều khoản trong hợp đồng đồng
                    sở hữu xe điện. Tôi cam kết tuân thủ quy định và chịu trách
                    nhiệm với phần sở hữu của mình.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={cn(
                    "inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
                    currentStep === 1
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="mr-2 text-base">←</span>
                  Quay lại bước trước
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    Tiếp theo
                    <span className="ml-2 text-base">→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={!formData.termsAccepted}
                    className={cn(
                      "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
                      formData.termsAccepted
                        ? "bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                    )}
                  >
                    <span className="mr-2 text-base">✅</span>
                    Hoàn thành onboarding
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** mini clsx */
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export default CoOwnerOnboarding;
