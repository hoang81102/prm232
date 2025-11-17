// src/mocks/applicationsStore.ts
export type ApplicationStatus = "pending" | "approved" | "rejected";

export type StoredApplication = {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  groupSize: number;
  notes?: string;
  createdAt: string; // ISO
  status: ApplicationStatus;

  // File info
  documentName: string;
  documentMime: string; // e.g. application/msword | application/vnd.openxmlformats-officedocument.wordprocessingml.document
  documentBase64: string; // base64 (no data: prefix)
};

const STORAGE_KEY = "APP_MULTI_MEMBER_RENTAL";

function readAll(): StoredApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredApplication[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: StoredApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listApplications(): StoredApplication[] {
  return readAll();
}

export function addApplication(app: StoredApplication) {
  const items = readAll();
  items.unshift(app); // mới nhất lên đầu
  writeAll(items);
}

export function updateStatus(id: string, status: ApplicationStatus) {
  const items = readAll().map((a) => (a.id === id ? { ...a, status } : a));
  writeAll(items);
}

export async function fileToBase64(file: File): Promise<string> {
  // trả về chuỗi base64 không có prefix data:
  const arrayBuffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function downloadDoc(app: StoredApplication) {
  // tạo Blob từ base64 và trigger download
  const byteChars = atob(app.documentBase64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: app.documentMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = app.documentName || "application.docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
