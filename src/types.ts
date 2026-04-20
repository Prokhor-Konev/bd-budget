export type QueryDTO = {
  id: number;
  lab: number;
  title: string;
  description?: string;
  query: string;
};

export type QueryConfigDTO = QueryDTO[];

export type OlapReportFields = {
  ministries: { show: boolean; multiple: boolean; required: boolean };
  expenseItems: { show: boolean; multiple: boolean; required: boolean };
  years: { show: boolean };
  groupBy: { show: boolean };
}

export type OlapReportConfig = {
  type: string;
  label: string;
  description: string;
  fields: OlapReportFields;
  defaultGroupBy: string[];
}

export type OlapConfigDTO = OlapReportConfig[];