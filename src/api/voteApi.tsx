// src/api/voteApi.tsx
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

/** ================== COMMON TYPES ================== */
export interface ApiResponse<T> {
  success: boolean;
  errorCode?: string | null;
  message?: string | null;
  data: T;
}

/** ================== DOMAIN TYPES ================== */
export type VoteStatus = "Open" | "Closed" | string;

export interface VoteChoice {
  userId: number;
  choice: string; // "Yes" / "No" / ...
  votedAt: string; // ISO datetime
}

export interface Vote {
  voteId: number;
  topic: string;
  description: string;
  status: VoteStatus;
  createdAt: string;
  totalYes: number;
  totalNo: number;
  choices?: VoteChoice[]; // cho phép undefined để code UI linh hoạt
}

/** ================== REQUEST PAYLOADS ================== */

export interface CreateVoteRequest {
  coOwnerGroupId: number;
  topic: string;
  description: string;
}

export interface CastVoteRequest {
  agree: boolean;
}

/** ================== API FUNCTIONS ================== */

/**
 * Tạo cuộc bỏ phiếu mới.
 * POST /groups/api/Votes
 */
export async function createVote(payload: CreateVoteRequest): Promise<Vote> {
  try {
    const res = (await axiosClient.post(
      "/groups/api/Votes",
      payload
    )) as ApiResponse<Vote>;

    if (!res.success) {
      const msg = res.message ?? "Tạo bỏ phiếu thất bại!";
      toast.error(msg);
      throw new Error(msg);
    }

    toast.success(res.message ?? "Tạo bỏ phiếu thành công!");
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      (error.response?.data as any)?.message || "Tạo bỏ phiếu thất bại!";
    toast.error(msg);
    throw err;
  }
}

/**
 * Bỏ phiếu cho 1 vote.
 * POST /groups/api/Votes/{voteId}/cast
 * Backend trả về data: "OK"
 */
export async function castVote(
  voteId: number,
  agree: boolean
): Promise<string> {
  try {
    const body: CastVoteRequest = { agree };

    const res = (await axiosClient.post(
      `/groups/api/Votes/${voteId}/cast`,
      body
    )) as ApiResponse<string>;

    if (!res.success) {
      const msg = res.message ?? "Bỏ phiếu thất bại!";
      toast.error(msg);
      throw new Error(msg);
    }

    toast.success(res.message ?? "Bỏ phiếu thành công!");
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg = (error.response?.data as any)?.message || "Bỏ phiếu thất bại!";
    toast.error(msg);
    throw err;
  }
}

/**
 * Lấy danh sách cuộc bỏ phiếu của group.
 * GET /groups/api/Votes/group/{groupId}
 */
export async function getVotesByGroup(groupId: number): Promise<Vote[]> {
  try {
    const res = (await axiosClient.get(
      `/groups/api/Votes/group/${groupId}`
    )) as ApiResponse<Vote[]>;

    if (!res.success) {
      const msg = res.message ?? "Không lấy được danh sách bỏ phiếu!";
      toast.error(msg);
      return [];
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      (error.response?.data as any)?.message ||
      "Không lấy được danh sách bỏ phiếu!";
    toast.error(msg);
    return [];
  }
}

/**
 * Chi tiết + kết quả của 1 vote.
 * GET /groups/api/Votes/{voteId}
 */
export async function getVoteDetail(voteId: number): Promise<Vote> {
  try {
    const res = (await axiosClient.get(
      `/groups/api/Votes/${voteId}`
    )) as ApiResponse<Vote>;

    if (!res.success) {
      const msg = res.message ?? "Không lấy được chi tiết bỏ phiếu!";
      toast.error(msg);
      throw new Error(msg);
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      (error.response?.data as any)?.message ||
      "Không lấy được chi tiết bỏ phiếu!";
    toast.error(msg);
    throw err;
  }
}
