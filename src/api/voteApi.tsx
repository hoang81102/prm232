import type { AxiosError } from "axios";
import type { CreateVotePayload, VoteSchema } from "../types/votes";
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";
import type { VoteFormValues } from "../components/votes/CreateVoteDialogForm";



export const createVote = async (voteCreate: VoteFormValues): Promise<VoteSchema> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Votes/`, voteCreate
    );
    const response = rawResponse as ApiResponseDetail<VoteSchema>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH ME ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get profile!";
    toast.error(msg);
    throw err;
  }
};

export const getVoteByGroupId = async (groupId: number): Promise<VoteSchema[]> => {
  try {
    const rawResponse = await axiosClient.get(`/groups/api/Votes/group/${groupId}`);
    const response = rawResponse as ApiResponseDetail<VoteSchema | VoteSchema[]>;

    if (!response.data) return [];

    // Nếu là mảng → trả thẳng, nếu là object → bọc vào mảng
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH ME ERROR", error.response);
    const msg = (error.response?.data as any)?.message || "Failed to get votes!";
    toast.error(msg);
    throw err;
  }
};

export const getVoteById = async (voteId: number): Promise<VoteSchema> => {
  try {
    const rawResponse = await axiosClient.get(`/groups/api/Votes/${voteId}`);
    const response = rawResponse as ApiResponseDetail<VoteSchema>;
   return response.data;
  } catch (err) { 
    const error = err as AxiosError<any>;
    console.error("FETCH ME ERROR", error.response);
    const msg = (error.response?.data as any)?.message || "Failed to get votes!";
    toast.error(msg);
    throw err;
  }
};
