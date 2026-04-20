import type { ApiResponse } from "../../server/core/types";
import { api } from "./configs/client";
import type { ExecuteQueryResponse } from "./configs/types";

export const executeQuery = async (lab: number, id: number): Promise<ApiResponse<ExecuteQueryResponse>> => {
    const res = await api.post("/query", undefined, { params: { lab, id } });
    return res.data;
};