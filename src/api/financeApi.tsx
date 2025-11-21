// src/api/financeApi.ts
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

// =========================
// Response chuẩn từ backend
// =========================
interface ApiResponse<T> {
  success: boolean;
  errorCode?: string | null;
  message?: string | null;
  data: T;
}

// =========================
// FUND MODELS
// =========================
export interface GroupFund {
  fundId: number;
  coOwnerGroupId: number;
  amount: number;
}

export interface FundHistoryEntry {
  changeAmount: number;
  reason: string;
  createdAt: string;
  changedByUserId: number;
}

export interface DepositPayload {
  coOwnerGroupId: number;
  amount: number;
  reason: string;
}

// =========================
// EXPENSE MODELS
// =========================
export interface ExpenseSharePayload {
  userId: number;
  amount: number;
}

export interface CreateExpensePayload {
  coOwnerGroupId: number;
  expenseType: string;
  totalAmount: number;
  description: string;
  shares: ExpenseSharePayload[];
}

export interface Expense {
  expenseId: number;
  coOwnerGroupId: number;
  expenseType: string;
  totalAmount: number;
  description: string;
  createdAt: string;
  createdByUserId: number;
  shares?: ExpenseSharePayload[];
}

// =========================
// Helpers
// =========================

const getErrorMessage = (err: unknown, fallback: string) => {
  const error = err as AxiosError<any>;
  return error?.response?.data?.message || fallback;
};

// ✔ unwrap nhận any để khỏi xung đột kiểu với AxiosResponse
const unwrap = <T,>(res: any): T => {
  const apiRes = res as ApiResponse<T>;
  return apiRes.data;
};

const getApiMessage = (res: any): string | undefined => {
  const apiRes = res as ApiResponse<unknown>;
  return apiRes.message ?? undefined;
};

// =========================
// API IMPLEMENTATION
// =========================

// 1) GET — current fund
export const getGroupFund = async (groupId: number): Promise<GroupFund> => {
  try {
    // không cần generic phức tạp, để any cho đơn giản
    const res = await axiosClient.get(`/finance/api/Funds/group/${groupId}`);
    return unwrap<GroupFund>(res);
  } catch (err) {
    toast.error(getErrorMessage(err, "Không tải được số dư quỹ!"));
    throw err;
  }
};

// 2) GET — fund history
export const getGroupFundHistory = async (
  groupId: number
): Promise<FundHistoryEntry[]> => {
  try {
    const res = await axiosClient.get(
      `/finance/api/Funds/group/${groupId}/history`
    );
    return unwrap<FundHistoryEntry[]>(res);
  } catch (err) {
    toast.error(getErrorMessage(err, "Không tải được lịch sử biến động quỹ!"));
    throw err;
  }
};

// 3) POST — deposit
export const depositToFund = async (
  payload: DepositPayload
): Promise<string> => {
  try {
    const res = await axiosClient.post(`/finance/api/Funds/deposit`, payload);
    toast.success(getApiMessage(res) || "Nạp quỹ thành công!");
    return unwrap<string>(res); // thường là "OK"
  } catch (err) {
    toast.error(getErrorMessage(err, "Nạp tiền thất bại!"));
    throw err;
  }
};

// 4) POST — create expense
export const createExpense = async (
  payload: CreateExpensePayload
): Promise<Expense> => {
  try {
    const res = await axiosClient.post(`/finance/api/Expenses`, payload);
    toast.success(getApiMessage(res) || "Tạo khoản chi thành công!");
    return unwrap<Expense>(res);
  } catch (err) {
    toast.error(getErrorMessage(err, "Tạo khoản chi thất bại!"));
    throw err;
  }
};
