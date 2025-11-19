import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createBooking,
  getMyBookings,
  type Booking,
} from "../../api/bookingsApi";
import { getVehiclesByGroup, type Vehicle } from "../../api/vehiclesApi";

/** ================== TYPES ================== */
type UserId = string;
type SlotId = string; // e.g. "2025-12-01#AM"
type SlotPeriod = "AM" | "PM"; // Sáng / Chiều

type SlotBooking = {
  slotId: SlotId;
  userId: UserId;
  userName: string;
  date: string; // YYYY-MM-DD
  period: SlotPeriod;
  vehicle: string;
};

type WeekBookings = Record<SlotId, SlotBooking | undefined>;

type WeeklyScheduleProps = {
  currentUserId?: UserId;
  currentUserName?: string;
  groupId?: number; // lấy DS xe theo nhóm
};

/** ================== CONFIG / HASHCODE ================== */
const USER_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-lime-500",
];
function colorForUser(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) sum += userId.charCodeAt(i);
  return USER_COLORS[sum % USER_COLORS.length];
}

/** ================== DATE HELPERS ================== */
function toStartOfWeekMonday(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayHeader(d: Date) {
  const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const idx = (d.getDay() + 6) % 7;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dayNames[idx]} ${dd}/${mm}`;
}

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slotIdFor(date: Date, period: SlotPeriod): SlotId {
  return `${isoDate(date)}#${period}`;
}

/** ================== MAP BOOKING -> UI SLOT ================== */
function bookingToSlotBooking(
  apiBooking: Booking,
  currentUserId: string,
  currentUserName: string,
  vehicles: Vehicle[]
): SlotBooking {
  const start = new Date(apiBooking.startTime);
  const dateStr = isoDate(start);
  const hour = start.getHours();
  const period: SlotPeriod = hour < 12 ? "AM" : "PM";
  const slotId = slotIdFor(start, period);

  const vInfo = vehicles.find((v) => v.vehicleId === apiBooking.vehicleId);
  const vehicleLabel = vInfo
    ? `${vInfo.make} ${vInfo.model} - ${vInfo.licensePlate}`
    : `Xe #${apiBooking.vehicleId}`;

  return {
    slotId,
    userId: String(apiBooking.userId ?? currentUserId),
    userName: currentUserName,
    date: dateStr,
    period,
    vehicle: vehicleLabel,
  };
}

/** ================== COMPONENT ================== */
const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  currentUserId,
  currentUserName,
  groupId,
}) => {
  // nếu không truyền từ ngoài vào thì vẫn có default
  const _currentUserId = currentUserId ?? "u-demo";
  const _currentUserName = currentUserName ?? "Demo User";
  const _groupId = groupId ?? 1;

  const [weekStart, setWeekStart] = useState<Date>(() =>
    toStartOfWeekMonday(new Date())
  );

  // danh sách xe thật từ DB
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // booking lấy từ API (của user hiện tại)
  const [allSlots, setAllSlots] = useState<SlotBooking[]>([]);
  const [bookings, setBookings] = useState<WeekBookings>({});

  const days: Date[] = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const periods: SlotPeriod[] = useMemo(() => ["AM", "PM"], []);

  /** ==== GỌI API LẤY DS XE THEO GROUP ==== */
  useEffect(() => {
    async function loadVehicles() {
      try {
        const list = await getVehiclesByGroup(_groupId);
        setVehicles(list);
      } catch (e) {
        console.error("LOAD VEHICLES ERROR", e);
      }
    }

    loadVehicles();
  }, [_groupId]);

  /** ==== GỌI API LẤY LỊCH SỬ BOOKING (mine) ==== */
  const reloadFromApi = useCallback(async () => {
    try {
      const apiBookings = await getMyBookings(); // Booking[]
      const slots = apiBookings.map((b) =>
        bookingToSlotBooking(b, _currentUserId, _currentUserName, vehicles)
      );
      setAllSlots(slots);
    } catch (e) {
      console.error("LOAD BOOKINGS ERROR", e);
    }
  }, [_currentUserId, _currentUserName, vehicles]);

  useEffect(() => {
    void reloadFromApi();
  }, [reloadFromApi]);

  // Build lại map bookings cho tuần đang xem
  useEffect(() => {
    const map: WeekBookings = {};
    const weekEnd = addDays(weekStart, 7);

    for (const s of allSlots) {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      if (d >= weekStart && d < weekEnd) {
        map[s.slotId] = s;
      }
    }
    setBookings(map);
  }, [allSlots, weekStart]);

  /** ==== FORM ĐẶT XE (chỉ nhập thời gian) ==== */
  const [showForm, setShowForm] = useState(false);
  const [newBooking, setNewBooking] = useState<{
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

  const handleCreateBooking = async () => {
    if (
      !newBooking.date ||
      !newBooking.startTime ||
      !newBooking.endTime ||
      !newBooking.vehicleId
    ) {
      alert("Vui lòng chọn đầy đủ: Ngày, giờ bắt đầu, giờ kết thúc và xe");
      return;
    }

    // ghép date + time -> ISO string giống swagger
    const start = new Date(`${newBooking.date}T${newBooking.startTime}:00`);
    const end = new Date(`${newBooking.date}T${newBooking.endTime}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Thời gian không hợp lệ");
      return;
    }
    if (end <= start) {
      alert("Giờ kết thúc phải sau giờ bắt đầu");
      return;
    }

    const created = await createBooking({
      vehicleId: newBooking.vehicleId as number,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    if (created) {
      const slot = bookingToSlotBooking(
        created,
        _currentUserId,
        _currentUserName,
        vehicles
      );
      setAllSlots((prev) => [...prev, slot]);
      alert("Đặt xe thành công!");
    }

    setShowForm(false);
    setNewBooking({
      date: "",
      startTime: "",
      endTime: "",
      vehicleId: "",
    });
  };

  /** ==== DANH SÁCH BUỔI TRONG TUẦN ==== */
  const currentWeekBookings: SlotBooking[] = useMemo(() => {
    const arr = Object.values(bookings).filter((b): b is SlotBooking =>
      Boolean(b)
    );
    arr.sort((a, b) => {
      if (a.date === b.date) {
        const order = (p: SlotPeriod) => (p === "AM" ? 0 : 1);
        return order(a.period) - order(b.period);
      }
      return a.date.localeCompare(b.date);
    });
    return arr;
  }, [bookings]);

  const totalSessions = currentWeekBookings.length;
  const morningSessions = currentWeekBookings.filter(
    (b) => b.period === "AM"
  ).length;
  const afternoonSessions = currentWeekBookings.filter(
    (b) => b.period === "PM"
  ).length;

  /** ==== ĐIỀU HƯỚNG TUẦN ==== */
  const goPrevWeek = () => setWeekStart((d) => addDays(d, -7));
  const goNextWeek = () => setWeekStart((d) => addDays(d, 7));
  const goThisWeek = () => setWeekStart(toStartOfWeekMonday(new Date()));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Đặt xe &amp; lịch sử sử dụng
          </h1>
          <p className="text-sm text-gray-600">
            Chọn <b>ngày</b> và <b>giờ bắt đầu / kết thúc</b> để đặt xe. Dữ liệu
            sẽ được hiển thị theo tuần.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2 text-sm font-medium text-white shadow hover:brightness-105"
        >
          <span className="mr-2">➕</span>
          Đặt xe mới
        </button>
      </div>

      {/* Form đặt xe */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Đặt xe theo khoảng thời gian
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              API yêu cầu các trường <code>vehicleId</code>,{" "}
              <code>startTime</code>, <code>endTime</code>.
            </p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ngày */}
              <div className="space-y-1.5">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày sử dụng <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Giờ bắt đầu */}
              <div className="space-y-1.5">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giờ bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={newBooking.startTime}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Giờ kết thúc */}
              <div className="space-y-1.5">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giờ kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  id="endTime"
                  type="time"
                  value={newBooking.endTime}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Chọn xe */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Xe <span className="text-red-500">*</span>
                </label>
                <select
                  value={newBooking.vehicleId || ""}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      vehicleId: e.target.value ? Number(e.target.value) : "",
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">-- Chọn xe --</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.make} {v.model} - {v.licensePlate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateBooking}
                className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600"
              >
                <span className="mr-2">✅</span>
                Đặt xe
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <span className="mr-2">❌</span>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Tổng số buổi trong tuần
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {totalSessions} buổi
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tuần bắt đầu từ{" "}
            <span className="font-medium">{isoDate(weekStart)}</span>.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Buổi Sáng trong tuần
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {morningSessions} buổi
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Suy ra từ các booking có giờ bắt đầu &lt; 12h.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Buổi Chiều trong tuần
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {afternoonSessions} buổi
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Suy ra từ các booking có giờ bắt đầu &ge; 12h.
          </p>
        </div>
      </div>

      {/* Danh sách buổi đã đăng ký trong tuần */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h2 className="text-lg font-semibold text-gray-800">
            Danh sách buổi đã đăng ký trong tuần
          </h2>
        </div>
        <div className="p-6">
          {currentWeekBookings.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-6">
              Chưa có buổi nào được đăng ký trong tuần này.
            </div>
          ) : (
            <div className="space-y-3">
              {currentWeekBookings.map((b) => (
                <div
                  key={b.slotId}
                  className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg">🚗</span>
                      <span className="font-semibold text-gray-800">
                        {b.vehicle}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {b.period === "AM" ? "🌅 Sáng" : "🌇 Chiều"}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="mr-3">📅 {b.date}</span>
                      <span>
                        👤 <span className="font-medium">{b.userName}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lịch tuần */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800">
              Lịch sử dụng theo tuần (Sáng / Chiều)
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Tuần bắt đầu:{" "}
              <span className="font-medium">{isoDate(weekStart)} (Thứ 2)</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={goPrevWeek}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Tuần trước
            </button>
            <button
              onClick={goThisWeek}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Tuần hiện tại
            </button>
            <button
              onClick={goNextWeek}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Tuần sau →
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-gray-200" />
              <span>Chưa có booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded ${colorForUser(
                  _currentUserId
                )}`}
              />
              <span>Khoảng thời gian bạn đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-gray-400" />
              <span>Khoảng thời gian thành viên khác đã đặt</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-[800px] w-full border-collapse table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-100 px-3 py-2 text-left text-xs font-semibold text-gray-600 w-24 border-b border-gray-200">
                    Buổi
                  </th>
                  {days.map((d) => (
                    <th
                      key={d.toISOString()}
                      className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b border-gray-200"
                    >
                      {formatDayHeader(d)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr key={p} className="border-t border-gray-200">
                    <td className="sticky left-0 z-10 bg-white px-3 py-2 text-sm text-gray-700 border-r border-gray-200 w-24">
                      {p === "AM" ? "Sáng" : "Chiều"}
                    </td>
                    {days.map((d) => {
                      const id = slotIdFor(d, p);
                      const slot = bookings[id];

                      let bg = "bg-white";
                      let textColor = "text-gray-300";
                      let borderExtra = "";

                      if (!slot) {
                        bg = "bg-white";
                        textColor = "text-gray-300";
                      } else if (
                        slot.userId === _currentUserId ||
                        slot.userName === _currentUserName // ⭐ nhận diện luôn slot của bạn
                      ) {
                        bg = `${colorForUser(_currentUserId)} text-white`;
                        textColor = "text-white";
                        borderExtra = "border border-white/60";
                      } else {
                        bg = "bg-gray-200";
                        textColor = "text-gray-800";
                      }

                      return (
                        <td
                          key={id}
                          className={`relative px-0 py-0 text-xs border-l border-gray-200 ${bg} ${borderExtra}`}
                        >
                          <div className="h-16 px-2 w-full flex flex-col justify-center">
                            {slot ? (
                              <>
                                <span
                                  className={`font-semibold truncate ${textColor}`}
                                >
                                  {slot.userName}
                                </span>
                                <span
                                  className={`truncate text-[11px] ${
                                    slot.userId === _currentUserId ||
                                    slot.userName === _currentUserName
                                      ? "text-white/90"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {slot.vehicle}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-300">Trống</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Lịch này dùng để xem nhanh các buổi Sáng / Chiều đã có đặt xe, dựa
            trên giờ bắt đầu của từng booking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
