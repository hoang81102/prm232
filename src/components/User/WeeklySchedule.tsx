import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** ================== TYPES ================== */
type UserId = string;
type SlotId = string; // e.g. "2025-12-01#AM"
type SlotPeriod = "AM" | "PM"; // Sáng / Chiều
type PeriodChoice = "" | SlotPeriod | "FULL"; // thêm CẢ NGÀY

type SlotBooking = {
  slotId: SlotId;
  userId: UserId;
  userName: string;
  date: string; // YYYY-MM-DD
  period: SlotPeriod; // AM hoặc PM (FULL sẽ tạo 2 slot)
  vehicle: string;
  purpose?: string;
};

type WeekBookings = Record<SlotId, SlotBooking | undefined>;

type WeeklyScheduleProps = {
  groupId?: string;
  currentUserId?: UserId;
  currentUserName?: string;
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

/** ================== STORAGE (localStorage) ================== */
function weekKey(groupId: string, weekStart: Date) {
  return `WEEKLY_SCHEDULE__${groupId}__${isoDate(weekStart)}`;
}

function loadWeek(groupId: string, weekStart: Date): WeekBookings {
  try {
    const raw = localStorage.getItem(weekKey(groupId, weekStart));
    return raw ? (JSON.parse(raw) as WeekBookings) : {};
  } catch {
    return {};
  }
}

function saveWeek(groupId: string, weekStart: Date, data: WeekBookings) {
  localStorage.setItem(weekKey(groupId, weekStart), JSON.stringify(data));
}

/** ================== MOCK XE ================== */
const vehicles = [
  { id: 1, name: "Tesla Model 3", plate: "HN-123" },
  { id: 2, name: "VinFast VF8", plate: "HN-456" },
  { id: 3, name: "BYD Atto 3", plate: "HN-789" },
];

/** ================== COMPONENT ================== */
const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  groupId,
  currentUserId,
  currentUserName,
}) => {
  const _groupId = groupId ?? "GROUP-DEMO";
  const _currentUserId = currentUserId ?? "u-demo";
  const _currentUserName = currentUserName ?? "Demo User";

  // tuần đang xem
  const [weekStart, setWeekStart] = useState<Date>(() =>
    toStartOfWeekMonday(new Date())
  );
  const [bookings, setBookings] = useState<WeekBookings>({});
  const pollRef = useRef<number | null>(null);

  const reload = useCallback(() => {
    const data = loadWeek(_groupId, weekStart);
    setBookings(data);
  }, [_groupId, weekStart]);

  useEffect(() => {
    reload();
  }, [reload]);

  // lắng nghe tab khác
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === weekKey(_groupId, weekStart)) {
        reload();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [_groupId, weekStart, reload]);

  // poll nhẹ
  useEffect(() => {
    pollRef.current = window.setInterval(() => {
      reload();
    }, 2000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [reload]);

  const days: Date[] = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const periods: SlotPeriod[] = useMemo(() => ["AM", "PM"], []);

  /** ==== FORM ĐĂNG KÝ (SÁNG / CHIỀU / CẢ NGÀY) ==== */
  const [showForm, setShowForm] = useState(false);
  const [newBooking, setNewBooking] = useState<{
    date: string;
    period: PeriodChoice; // "", "AM", "PM", "FULL"
    vehicle: string;
    purpose: string;
  }>({
    date: "",
    period: "",
    vehicle: "",
    purpose: "",
  });

  const handleCreateBooking = () => {
    if (!newBooking.date || !newBooking.period || !newBooking.vehicle) {
      alert("Vui lòng chọn đầy đủ: Ngày, Buổi và Xe");
      return;
    }

    const dateObj = new Date(newBooking.date);
    if (isNaN(dateObj.getTime())) {
      alert("Ngày không hợp lệ");
      return;
    }

    const weekStartForDate = toStartOfWeekMonday(dateObj);
    const weekData = loadWeek(_groupId, weekStartForDate);

    const makeSlotBooking = (period: SlotPeriod): SlotBooking => ({
      slotId: slotIdFor(dateObj, period),
      userId: _currentUserId,
      userName: _currentUserName,
      date: isoDate(dateObj),
      period,
      vehicle: newBooking.vehicle,
      purpose: newBooking.purpose || undefined,
    });

    if (newBooking.period === "AM" || newBooking.period === "PM") {
      const slotId = slotIdFor(dateObj, newBooking.period);
      if (weekData[slotId]) {
        alert("Buổi này trong ngày đó đã có người đăng ký rồi.");
        return;
      }
      const updated = {
        ...weekData,
        [slotId]: makeSlotBooking(newBooking.period),
      };
      saveWeek(_groupId, weekStartForDate, updated);
      setWeekStart(weekStartForDate);
      setBookings(updated);
      alert("Đăng ký thành công!");
    } else if (newBooking.period === "FULL") {
      const amId = slotIdFor(dateObj, "AM");
      const pmId = slotIdFor(dateObj, "PM");
      if (weekData[amId] || weekData[pmId]) {
        alert(
          "Không thể đăng ký cả ngày vì đã có người đăng ký Sáng hoặc Chiều."
        );
        return;
      }
      const updated: WeekBookings = {
        ...weekData,
        [amId]: makeSlotBooking("AM"),
        [pmId]: makeSlotBooking("PM"),
      };
      saveWeek(_groupId, weekStartForDate, updated);
      setWeekStart(weekStartForDate);
      setBookings(updated);
      alert("Đăng ký cả ngày thành công!");
    }

    setShowForm(false);
    setNewBooking({
      date: "",
      period: "",
      vehicle: "",
      purpose: "",
    });
  };

  /** ==== DANH SÁCH BUỔI ĐĂNG KÝ TRONG TUẦN ==== */
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
            Đăng ký &amp; Lịch sử dụng xe
          </h1>
          <p className="text-sm text-gray-600">
            Đăng ký theo{" "}
            <span className="font-semibold">buổi Sáng / Chiều / Cả ngày</span>{" "}
            và xem lịch sử dụng theo tuần.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2 text-sm font-medium text-white shadow hover:brightness-105"
        >
          <span className="mr-2">➕</span>
          Đăng ký buổi mới
        </button>
      </div>

      {/* Form đăng ký */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Đăng ký sử dụng xe theo buổi
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Chọn ngày, buổi (Sáng / Chiều / Cả ngày) và xe bạn muốn sử dụng.
            </p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Buổi */}
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-gray-700">
                  Buổi <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewBooking((prev) => ({ ...prev, period: "AM" }))
                    }
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                      newBooking.period === "AM"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    🌅 Sáng
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewBooking((prev) => ({ ...prev, period: "PM" }))
                    }
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                      newBooking.period === "PM"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    🌇 Chiều
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewBooking((prev) => ({ ...prev, period: "FULL" }))
                    }
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                      newBooking.period === "FULL"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    📆 Cả ngày
                  </button>
                </div>
              </div>

              {/* Chọn xe */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn xe <span className="text-red-500">*</span>
                </label>
                <select
                  value={newBooking.vehicle}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      vehicle: e.target.value,
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">-- Chọn xe --</option>
                  {vehicles.map((v) => (
                    <option
                      key={v.id}
                      value={`${v.name} - ${v.plate}`}
                    >{`${v.name} - ${v.plate}`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mục đích */}
            <div className="space-y-1.5">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700"
              >
                Mục đích sử dụng (không bắt buộc)
              </label>
              <textarea
                id="purpose"
                rows={3}
                value={newBooking.purpose}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
                placeholder="VD: Đi làm, đón khách, đi công tác..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 border border-blue-100">
              <strong>Lưu ý:</strong> Mỗi buổi (Sáng / Chiều) trong một ngày chỉ
              có thể được đăng ký bởi một người. Nếu đã có người đăng ký, bạn sẽ
              không thể chọn buổi đó. Chọn <b>Cả ngày</b> sẽ chiếm cả Sáng &amp;
              Chiều.
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateBooking}
                className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600"
              >
                <span className="mr-2">✅</span>
                Đăng ký buổi này
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
            Tính cho tuần bắt đầu từ{" "}
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
            Đã đăng ký vào các buổi 🌅 Sáng.
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
            Đã đăng ký vào các buổi 🌇 Chiều.
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
                    {b.purpose && (
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Mục đích:</span>{" "}
                        {b.purpose}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lịch tuần: chỉ hiển thị, không cho click đăng ký */}
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
              <span>Chưa có ai đăng ký</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded ${colorForUser(
                  _currentUserId
                )}`}
              />
              <span>Buổi do bạn đăng ký</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-gray-400" />
              <span>Buổi do thành viên khác đăng ký</span>
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
                      } else if (slot.userId === _currentUserId) {
                        bg = `${colorForUser(_currentUserId)} text-white`;
                        textColor = "text-white";
                        borderExtra = "border border-white/60";
                      } else {
                        bg = "bg-gray-200 text-gray-700";
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
                                    slot.userId === _currentUserId
                                      ? "text-white/90"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {slot.vehicle}
                                </span>
                                {slot.purpose && (
                                  <span className="mt-0.5 text-[10px] text-gray-700/80 line-clamp-1">
                                    {slot.purpose}
                                  </span>
                                )}
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
            Lịch này chỉ dùng để xem. Để đăng ký buổi mới, hãy dùng nút{" "}
            <span className="font-semibold">"Đăng ký buổi mới"</span> phía trên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
