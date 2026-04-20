import type { OlapConfigDTO, QueryConfigDTO } from "@ts";
import rawConfig from "./assets/config.json";
import olapRawConfig from "./assets/olap-config.json";

export const queryConfig = rawConfig as QueryConfigDTO;
export const olapConfig = olapRawConfig as OlapConfigDTO;