import React, { useEffect, useMemo, useState } from "react";
import {
  createBooking,
  getMyBookings,
  getVehicleCalendar,
  type Booking,
} from "../../api/bookingsApi";
import { getVehiclesByGroup, type Vehicle } from "../../api/vehiclesApi";
import { getMyGroups, type CoOwnerGroupSummary } from "../../api/groupApi";

type Props = {
  groupId?: number; // nếu truyền thì dùng làm nhóm mặc định
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
};

const toInputDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const WeeklySchedule: React.FC<Props> = ({ groupId }) => {
  /** ====== STATE NHÓM ====== */
  const [groups, setGroups] = useState<CoOwnerGroupSummary[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(() =>
    typeof groupId === "number" ? groupId : null
  );

  /** ====== STATE XE THEO NHÓM (dùng cho select, lịch xe chi tiết) ====== */
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Map tên xe chỉ cho NHÓM đang chọn
  const vehicleLabelMap = useMemo(
    () =>
      vehicles.reduce<Record<number, string>>((acc, v) => {
        acc[v.vehicleId] = `${v.make} ${v.model} - ${v.licensePlate}`;
        return acc;
      }, {}),
    [vehicles]
  );

  /** ====== CACHE TÊN TẤT CẢ XE CỦA MỌI NHÓM ====== */
  const [vehicleNameMap, setVehicleNameMap] = useState<Record<number, string>>(
    {}
  );

  const mergeVehiclesToCache = (list: Vehicle[]) => {
    setVehicleNameMap((prev) => {
      const next = { ...prev };
      list.forEach((v) => {
        next[v.vehicleId] = `${v.make} ${v.model} - ${v.licensePlate}`;
      });
      return next;
    });
  };

  /** ====== FORM ĐẶT XE ====== */
  const [bookingForm, setBookingForm] = useState<{
    date: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    vehicleId: number | "";
  }>({
    date: "",
    startTime: "",
    endTime: "",
    vehicleId: "",
  });
  const [creating, setCreating] = useState(false);

  /** ====== LỊCH CỦA TÔI ====== */
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loadingMyBookings, setLoadingMyBookings] = useState(false);

  /** ====== LỊCH XE ====== */
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [vehicleBookings, setVehicleBookings] = useState<Booking[]>([]);
  const [loadingVehicleCalendar, setLoadingVehicleCalendar] = useState(false);

  const [calendarRange, setCalendarRange] = useState<{
    from: string;
    to: string;
  }>(() => {
    const today = new Date();
    const next7 = new Date();
    next7.setDate(today.getDate() + 7);
    return {
      from: toInputDate(today),
      to: toInputDate(next7),
    };
  });

  /** ====== LOAD DS NHÓM CỦA TÔI + PRELOAD TÊN XE CHO MỌI NHÓM ====== */
  useEffect(() => {
    async function loadGroups() {
      try {
        setLoadingGroups(true);
        const list = await getMyGroups();
        setGroups(list);

        // nếu chưa có selectedGroupId thì set mặc định là nhóm đầu tiên
        if (!selectedGroupId && list.length > 0) {
          setSelectedGroupId(list[0].coOwnerGroupId);
        }

        // preload xe của TẤT CẢ nhóm để bảng "Lịch của tôi" luôn có tên xe
        if (list.length > 0) {
          const allVehiclesArrays = await Promise.all(
            list.map((g) => getVehiclesByGroup(g.coOwnerGroupId))
          );
          const allVehicles = allVehiclesArrays.flat();
          mergeVehiclesToCache(allVehicles);
        }
      } catch (e) {
        console.error("LOAD GROUPS ERROR", e);
      } finally {
        setLoadingGroups(false);
      }
    }
    void loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ====== KHI ĐỔI NHÓM: RESET XE & FORM XE ====== */
  useEffect(() => {
    setVehicles([]);
    setSelectedVehicleId(null);
    setBookingForm((prev) => ({ ...prev, vehicleId: "" }));
  }, [selectedGroupId]);

  /** ====== LOAD DS XE THEO NHÓM (CHO DROPDOWN + LỊCH XE CHI TIẾT) ====== */
  useEffect(() => {
    if (selectedGroupId == null) return;

    const gid: number = Number(selectedGroupId);

    async function loadVehicles() {
      try {
        const list = await getVehiclesByGroup(gid);
        setVehicles(list);
        // đồng thời merge vào cache global
        mergeVehiclesToCache(list);
      } catch (e) {
        console.error("LOAD VEHICLES ERROR", e);
      }
    }

    void loadVehicles();
  }, [selectedGroupId]);

  /** ====== LOAD LỊCH CỦA TÔI ====== */
  const reloadMyBookings = async () => {
    try {
      setLoadingMyBookings(true);
      const list = await getMyBookings();
      setMyBookings(list);
    } catch (e) {
      console.error("GET MY BOOKINGS ERROR", e);
    } finally {
      setLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    void reloadMyBookings();
  }, []);

  /** ====== LOAD LỊCH XE THEO vehicleId + khoảng thời gian ====== */
  const reloadVehicleCalendar = async () => {
    if (!selectedVehicleId) return;
    try {
      setLoadingVehicleCalendar(true);

      const fromIso = calendarRange.from
        ? new Date(`${calendarRange.from}T00:00:00`).toISOString()
        : undefined;
      const toIso = calendarRange.to
        ? new Date(`${calendarRange.to}T23:59:59`).toISOString()
        : undefined;

      const list = await getVehicleCalendar(selectedVehicleId, {
        from: fromIso,
        to: toIso,
      });
      setVehicleBookings(list);
    } catch (e) {
      console.error("GET VEHICLE CALENDAR ERROR", e);
    } finally {
      setLoadingVehicleCalendar(false);
    }
  };

  useEffect(() => {
    void reloadVehicleCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicleId]);

  /** ====== HANDLE CREATE BOOKING ====== */
  const handleCreateBooking = async () => {
    if (!selectedGroupId) {
      alert("Vui lòng chọn nhóm trước khi đặt xe.");
      return;
    }

    if (
      !bookingForm.date ||
      !bookingForm.startTime ||
      !bookingForm.endTime ||
      !bookingForm.vehicleId
    ) {
      alert("Vui lòng điền đủ ngày, giờ bắt đầu, giờ kết thúc và xe.");
      return;
    }

    const start = new Date(`${bookingForm.date}T${bookingForm.startTime}:00`);
    const end = new Date(`${bookingForm.date}T${bookingForm.endTime}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Thời gian không hợp lệ.");
      return;
    }
    if (end <= start) {
      alert("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }

    try {
      setCreating(true);
      const created = await createBooking({
        vehicleId: bookingForm.vehicleId as number,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      if (created) {
        setMyBookings((prev) => [created, ...prev]);
        setSelectedVehicleId(created.vehicleId);
        await reloadVehicleCalendar();

        setBookingForm({
          date: "",
          startTime: "",
          endTime: "",
          vehicleId: "",
        });
      }
    } finally {
      setCreating(false);
    }
  };

  /** ====== RENDER ====== */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Quản lý đặt xe công ty
          </h1>
          <p className="text-sm text-gray-600">
            1. Đặt lịch xe • 2. Xem lịch của tôi • 3. Xem lịch chi tiết của xe
            đã đặt
          </p>
        </div>

        {/* Chọn nhóm */}
        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-xs text-gray-500">
            Đang tham gia: {groups.length} nhóm
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Nhóm:</span>
            <select
              value={selectedGroupId ?? ""}
              onChange={(e) =>
                setSelectedGroupId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs md:text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">
                {loadingGroups ? "Đang tải nhóm..." : "-- Chọn nhóm --"}
              </option>
              {groups.map((g) => (
                <option key={g.coOwnerGroupId} value={g.coOwnerGroupId}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. FORM ĐẶT LỊCH XE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            1️⃣ Đặt lịch xe
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Chọn nhóm, ngày, giờ bắt đầu/kết thúc và xe để tạo booking mới.
          </p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {!selectedGroupId ? (
            <div className="text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              Vui lòng chọn <span className="font-semibold">nhóm</span> ở góc
              trên bên phải trước khi đặt xe.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Ngày */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sử dụng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {/* Giờ bắt đầu */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {/* Giờ kết thúc */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={bookingForm.endTime}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {/* Xe */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookingForm.vehicleId || ""}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        vehicleId: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">
                      {vehicles.length === 0
                        ? "Không có xe trong nhóm"
                        : "-- Chọn xe --"}
                    </option>
                    {vehicles.map((v) => (
                      <option key={v.vehicleId} value={v.vehicleId}>
                        {v.make} {v.model} - {v.licensePlate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={creating || !selectedGroupId}
                  onClick={handleCreateBooking}
                  className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 disabled:opacity-60"
                >
                  {creating ? "Đang đặt..." : "✅ Đặt xe"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. LỊCH CỦA TÔI */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg font-semibold text-gray-800">
              2️⃣ Lịch đặt xe của tôi
            </h2>
          </div>

          <button
            onClick={reloadMyBookings}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
          >
            <span>🔄</span> Tải lại
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loadingMyBookings ? (
            <div className="text-sm text-gray-500">Đang tải lịch của bạn…</div>
          ) : myBookings.length === 0 ? (
            <div className="text-sm text-gray-500">
              Bạn chưa có lịch đặt xe nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left font-medium">Xe</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Thời gian
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Mã booking
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Trạng thái
                    </th>
                   
                  </tr>
                </thead>

                <tbody>
                  {myBookings.map((b) => {
                    const now = new Date().getTime();
                    const start = new Date(b.startTime).getTime();
                    const end = new Date(b.endTime).getTime();

                    const status =
                      now < start
                        ? "Sắp tới"
                        : now >= start && now <= end
                        ? "Đang sử dụng"
                        : "Đã kết thúc";

                    const statusColor =
                      status === "Sắp tới"
                        ? "bg-blue-100 text-blue-700"
                        : status === "Đang sử dụng"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600";

                    const vehicleName =
                      vehicleNameMap[b.vehicleId] || "Không rõ";

                    return (
                      <tr
                        key={b.bookingId}
                        className="border-b last:border-0 hover:bg-orange-50 transition"
                      >
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {vehicleName}
                        </td>

                        <td className="px-4 py-2 text-gray-700">
                          <div className="flex flex-col">
                            <span>📌 {formatDateTime(b.startTime)}</span>
                            <span>⏳ {formatDateTime(b.endTime)}</span>
                          </div>
                        </td>

                        <td className="px-4 py-2 text-gray-500 font-medium">
                          #{b.bookingId}
                        </td>

                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                          >
                            {status}
                          </span>
                        </td>

                       
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 3. LỊCH CỦA XE ĐÃ ĐẶT */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚗</span>
              <h2 className="text-lg font-semibold text-gray-800">
                3️⃣ Lịch chi tiết của xe đã đặt
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Chọn xe (hoặc bấm “Xem lịch xe này” ở bảng trên) và khoảng thời
              gian để xem mọi booking của xe đó.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={selectedVehicleId ?? ""}
              onChange={(e) =>
                setSelectedVehicleId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs md:text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">-- Chọn xe --</option>
              {vehicles.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.make} {v.model} - {v.licensePlate}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={calendarRange.from}
              onChange={(e) =>
                setCalendarRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs md:text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />

            <span className="text-xs text-gray-500">→</span>

            <input
              type="date"
              value={calendarRange.to}
              onChange={(e) =>
                setCalendarRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs md:text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />

            <button
              type="button"
              onClick={reloadVehicleCalendar}
              disabled={!selectedVehicleId}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs md:text-sm font-medium text-white shadow hover:bg-orange-600 disabled:opacity-60"
            >
              Xem lịch xe
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedVehicleId ? (
            <div className="text-sm text-gray-500">
              Chưa chọn xe. Hãy chọn một xe bên trên hoặc bấm “Xem lịch xe này”
              ở phần “Lịch của tôi”.
            </div>
          ) : loadingVehicleCalendar ? (
            <div className="text-sm text-gray-500">Đang tải lịch của xe…</div>
          ) : vehicleBookings.length === 0 ? (
            <div className="text-sm text-gray-500">
              Không có booking nào của xe trong khoảng thời gian đã chọn.
            </div>
          ) : (
            <div className="space-y-3">
              {vehicleBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {vehicleLabelMap[b.vehicleId] ||
                        vehicleNameMap[b.vehicleId] ||
                        ""}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ⏰ {formatDateTime(b.startTime)} –{" "}
                      {formatDateTime(b.endTime)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 text-xs text-gray-500">
                    Booking ID: #{b.bookingId}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
