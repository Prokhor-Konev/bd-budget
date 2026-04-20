import http from "http";
import { sendJson } from "./httpResponse";

export function createEndpoint(
    server: http.Server,
    path: string,
    handler: (url: URL) => Promise<any>
) {
    server.on("request", async (req, res) => {
        try {
            const url = new URL(req.url || "", "http://localhost");
            if (url.pathname !== path) return;
            const result = await handler(url);
            sendJson(res, {
                code: 200,
                message: "Успешно",
                data: result,
            });
        } catch (err: any) {
            sendJson(res, {
                code: err.statusCode || 500,
                message: 'Ошибка выполнения запроса',
                error: {
                    code: err.code || 'UNKNOWN_ERROR',
                    message: err.message || 'Unexpected error'
                }
            })
        }
    });
}