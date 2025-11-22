import type { AxiosError } from "axios";
// src/api/contractApi.ts
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";

// =========================
// Kiểu response chung
// =========================
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  errorCode?: string | number | null;
  data: T;
  [key: string]: any;
}

// =========================
// Kiểu dữ liệu Contract
// =========================
export interface ContractSignature {
  userId: number;
  hasSigned: boolean;
  signedAt: string | null;
}

export interface GenerateContractPayload {
  coOwnerGroupId: number;
  content: string;
}

export interface Contract {
  contractId: number;
  coOwnerGroupId: number;
  content: string;
  createdAt: string | null;
  signatures: ContractSignature[];
}

// =========================
// Payload tạo hợp đồng
// =========================
export interface CreateContractPayload {
  coOwnerGroupId: number;
  content: string;
}

export const generateContract = async (
  payload: GenerateContractPayload
): Promise<boolean> => {
  try {
    await axiosClient.post(`/groups/api/Contracts/generate`, payload);
    toast.success("Upload hợp đồng thành công!");
    return true;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("UPLOAD CONTRACT ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Upload hợp đồng thất bại!";
    toast.error(msg);
    return false;
  }
};

// =========================
// 🟦 LẤY HỢP ĐỒNG CỦA NHÓM
// GET /groups/api/Contracts/group/{groupId}
// =========================
export const getContractByGroup = async (
  groupId: number
): Promise<Contract | null> => {
  try {
    const res = (await axiosClient.get(
      `/groups/api/Contracts/group/${groupId}`
    )) as ApiResponse<Contract | null>;

    const data = (res.data as Contract) ?? (res as any).data ?? null;

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET CONTRACT BY GROUP ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message || "Không tải được hợp đồng.";
    toast.error(msg);

    throw err;
  }
};

// =========================
// 🖊️ KÝ HỢP ĐỒNG
// POST /groups/api/Contracts/{contractId}/sign
// =========================
// Response bạn gửi:
// {
//   "success": true,
//   "errorCode": null,
//   "message": "Ký hợp đồng thành công",
//   "data": "OK"
// }
// =========================
export const signContract = async (contractId: number): Promise<string> => {
  try {
    const res = (await axiosClient.post(
      `/groups/api/Contracts/${contractId}/sign`
    )) as ApiResponse<string>;

    const msg = res.message || "Đã ký hợp đồng!";
    toast.success(msg);

    // Backend trả về data = "OK"
    return res.data ?? "OK";
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("SIGN CONTRACT ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message || "Ký hợp đồng thất bại!";
    toast.error(msg);

    throw err;
  }
};
