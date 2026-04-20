import http from "http";
import dotenv from "dotenv";
import { createEndpoint } from "./core/createEnpoint";
import { queryService } from "./services/queryService";
import { olapService } from "./services/olapService";
import { getExpenseItems, getMinistries } from "./services/dictionaryService";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }
});

createEndpoint(server, "/query", queryService);
createEndpoint(server, "/olap", olapService);
createEndpoint(server, "/dictionaries/ministries", getMinistries);
createEndpoint(server, "/dictionaries/expense-items", getExpenseItems);

server.listen(PORT, () => {
    console.log(`[SERVER] http://localhost:${PORT}`);
});