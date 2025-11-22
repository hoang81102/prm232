import type { AxiosError } from "axios";
import type { GroupSchema } from "../types/group";
// src/api/groupApi.ts
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

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
import type { GroupFormValues } from "../components/groups/GroupForm";

export const getGroups = async (): Promise<GroupSchema[]> => {
// =========================
// Payload tạo nhóm mới
// =========================
export interface CreateGroupMemberPayload {
  userId: number;
  sharePercent: number;
  isAdmin: boolean;
}

export interface CreateGroupPayload {
  groupName: string;
  initialMembers: CreateGroupMemberPayload[];
}

// =========================
// API: Tạo nhóm đồng sở hữu mới
// POST /groups/api/Groups
// =========================
export const createGroup = async (
  payload: CreateGroupPayload
): Promise<CoOwnerGroupDetail> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Groups`
    );
    const response = rawResponse as ApiResponseDetail<GroupSchema[]>;
    return response.data;
    const res = (await axiosClient.post(
      "/groups/api/Groups",
      payload
    )) as ApiResponse<CoOwnerGroupDetail>;

    const data =
      (res.data as CoOwnerGroupDetail) ?? (res as any).data ?? (res as any);

    toast.success(res.message || "Tạo nhóm đồng sở hữu thành công!");
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH GROUPS ERROR", error.response);
    console.error("CREATE GROUP ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message || "Failed to get groups!";
      (error.response?.data as any)?.message ||
      "Tạo nhóm đồng sở hữu thất bại!";
    toast.error(msg);

    throw err;
  }
};

export const getGroupById = async (groupId: number): Promise<GroupSchema> => {
// =========================
// API: Danh sách nhóm tôi tham gia
// GET /groups/api/Groups/my
// =========================
export const getMyGroups = async (): Promise<CoOwnerGroupSummary[]> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Groups/${groupId}`
    );
    const response = rawResponse as ApiResponseDetail<GroupSchema>;
    return response.data;
    const res = (await axiosClient.get("/groups/api/Groups/my")) as ApiResponse<
      CoOwnerGroupSummary[]
    >;

    const data =
      (res.data as CoOwnerGroupSummary[]) ?? (res as any).data ?? (res as any);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH GROUP ERROR", error.response);
    console.error("GET MY GROUPS ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message || "Failed to get group!";
      (error.response?.data as any)?.message ||
      "Không tải được danh sách nhóm của bạn.";
    toast.error(msg);

    throw err;
  }
};

export const createGroup = async (groupToCreate : GroupFormValues): Promise<GroupSchema> => {
// =========================
// API: Chi tiết một nhóm
// GET /groups/api/Groups/{groupId}
// =========================
export const getGroupById = async (
  groupId: number
): Promise<CoOwnerGroupDetail> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Groups`, groupToCreate
    );
    const response = rawResponse as ApiResponseDetail<GroupSchema>;
    return response.data;
    const res = (await axiosClient.get(
      `/groups/api/Groups/${groupId}`
    )) as ApiResponse<CoOwnerGroupDetail>;

    const data =
      (res.data as CoOwnerGroupDetail) ?? (res as any).data ?? (res as any);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("CREATE GROUP ERROR", error.response);
    console.error("GET GROUP DETAIL ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message || "Failed to create group!";
      (error.response?.data as any)?.message ||
      "Không tải được thông tin nhóm.";
    toast.error(msg);

    throw err;
  }
};


