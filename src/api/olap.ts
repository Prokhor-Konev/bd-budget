import type { ApiResponse } from "../../server/core/types";
import { api } from "./configs/client";
import type { ExecuteQueryResponse, OlapParams } from "./configs/types";

export const fetchOlapData = async (params: OlapParams): Promise<ApiResponse<ExecuteQueryResponse>> => {
  const searchParams = new URLSearchParams();
  
  if (params.ministryIds?.length) {
    searchParams.append('ministryIds', params.ministryIds.join(','));
  }
  if (params.expenseItemIds?.length) {
    searchParams.append('expenseItemIds', params.expenseItemIds.join(','));
  }
  if (params.yearFrom) {
    searchParams.append('yearFrom', params.yearFrom.toString());
  }
  if (params.yearTo) {
    searchParams.append('yearTo', params.yearTo.toString());
  }
  
  searchParams.append('groupBy', params.groupBy.join(','));
  
  const res = await api.post("/olap", undefined, { params: searchParams });
  return res.data;
};