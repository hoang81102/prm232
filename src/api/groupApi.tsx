import type { AxiosError } from "axios";
import type { GroupSchema } from "../types/group";
// src/api/groupApi.ts
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";

// =========================
// Kiểu response chung từ BE
// =========================
interface ApiResponse<T> {
  data: T;
  message?: string;
  [key: string]: any; // success, errorCode,...
}

// =========================
// Kiểu dữ liệu nhóm & member
// =========================
export interface CoOwnerGroupMember {
  userId: number;
  sharePercent: number;
  isAdmin: boolean;
}

export interface CoOwnerGroupSummary {
  coOwnerGroupId: number;
  groupName: string;
  contractId?: number | null;
  createdAt?: string | null;
}

export interface CoOwnerGroupDetail extends CoOwnerGroupSummary {
  members: CoOwnerGroupMember[];
}
export interface CreateGroupMemberPayload {
  userId: number;
  sharePercent: number;
  isAdmin: boolean;
}

export interface CreateGroupPayload {
  groupName: string;
  initialMembers: CreateGroupMemberPayload[];
}
import type { GroupFormValues } from "../components/groups/GroupForm";
import type { Vote } from "./voteApi";

export const getGroups = async (): Promise<GroupSchema[]> => {
  try {
    const rawResponse = await axiosClient.get(`/groups/api/Groups`);
    const response = rawResponse as ApiResponseDetail<GroupSchema[]>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH GROUPS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get groups!";
    toast.error(msg);
    throw err;
  }
};

export const createGroup = async (
  groupToCreate: GroupFormValues
): Promise<GroupSchema> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Groups`,
      groupToCreate
    );
    const response = rawResponse as ApiResponseDetail<GroupSchema>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("CREATE GROUP ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to create group!";
    toast.error(msg);
    throw err;
  }
};

export const getMyGroups = async (): Promise<CoOwnerGroupSummary[]> => {
  try {
    const res = (await axiosClient.get("/groups/api/Groups/my")) as ApiResponse<
      CoOwnerGroupSummary[]
    >;

    const data =
      (res.data as CoOwnerGroupSummary[]) ?? (res as any).data ?? (res as any);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET MY GROUPS ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không tải được danh sách nhóm của bạn.";
    toast.error(msg);

    throw err;
  }
};
// =========================
// API: Chi tiết một nhóm
// GET /groups/api/Groups/{groupId}
// =========================
export const getGroupById = async (
  groupId: number
): Promise<CoOwnerGroupDetail> => {
  try {
    const res = (await axiosClient.get(
      `/groups/api/Groups/${groupId}`
    )) as ApiResponse<CoOwnerGroupDetail>;

    const data =
      (res.data as CoOwnerGroupDetail) ?? (res as any).data ?? (res as any);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET GROUP DETAIL ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không tải được thông tin nhóm.";
    toast.error(msg);

    throw err;
  }
};

export const getGroupsById = async (groupId: number): Promise<GroupSchema> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Groups/${groupId}`
    );
    const response = rawResponse as ApiResponseDetail<GroupSchema>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH GROUP ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get group!";
    toast.error(msg);
    throw err;
  }
};

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
