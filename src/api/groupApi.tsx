import type { AxiosError } from "axios";
import type { GroupSchema } from "../types/group";
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";
import type { GroupFormValues } from "../components/groups/GroupForm";

export const getGroups = async (): Promise<GroupSchema[]> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Groups`
    );
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

export const getGroupById = async (groupId: number): Promise<GroupSchema> => {
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

export const createGroup = async (groupToCreate : GroupFormValues): Promise<GroupSchema> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Groups`, groupToCreate
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


