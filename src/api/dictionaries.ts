import type { ApiResponse } from "../../server/core/types";
import { api } from "./configs/client";

export interface Ministry {
  id: number;
  name: string;
}

export interface ExpenseItem {
  id: number;
  name: string;
}

export const fetchMinistries = async (): Promise<ApiResponse<Ministry[]>> => {
  const res = await api.get("/dictionaries/ministries");
  return res.data;
};

export const fetchExpenseItems = async (): Promise<ApiResponse<ExpenseItem[]>> => {
  const res = await api.get("/dictionaries/expense-items");
  return res.data;
};