import { db } from "../db";
import { queryConfig } from "../../src/config";
import { HttpError } from "../core/httpError";

export async function queryService(url: URL) {
    const lab = Number(url.searchParams.get("lab"));
    const id = Number(url.searchParams.get("id"));

    const query = queryConfig.find((q) => q.lab === lab && q.id === id);

    if (!query) throw new HttpError("Query not found", 404, "QUERY_NOT_FOUND");

    const result = await db.query(query.query);

    return result.rows;
}