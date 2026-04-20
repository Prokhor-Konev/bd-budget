export type ExecuteQueryRequest = {
    query: string;
};

export type ExecuteQueryResponse = Record<string, any>[];

export type GroupByField = 'ministry' | 'expense_item' | 'year' | 'month';

export interface OlapParams {
    ministryIds?: number[];
    expenseItemIds?: number[];
    yearFrom?: number;
    yearTo?: number;
    groupBy: GroupByField[];
}