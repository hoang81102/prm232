import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import type { ApiResponseDetail } from "./vehicleApi";
import { toast } from "react-toastify";


export interface GenerateContractPayload {
  coOwnerGroupId: number;
  content: string;
}

export const generateContract = async (payload: GenerateContractPayload): Promise<boolean> => {
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