import http from "http";
import type { ApiResponse } from "./types";

export function sendJson<T>(
    res: http.ServerResponse,
    payload: ApiResponse<T>
) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
}