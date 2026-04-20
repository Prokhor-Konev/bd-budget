import { db } from "../db";
import { HttpError } from "../core/httpError";

export interface OlapFilters {
    ministryIds?: number[];
    expenseItemIds?: number[];
    yearFrom?: number;
    yearTo?: number;
    groupBy: ('ministry' | 'expense_item' | 'year' | 'month')[];
}

export async function olapService(url: URL) {
    const ministryIds = url.searchParams.get('ministryIds')?.split(',').map(Number);
    const expenseItemIds = url.searchParams.get('expenseItemIds')?.split(',').map(Number);
    const yearFrom = url.searchParams.get('yearFrom') ? Number(url.searchParams.get('yearFrom')) : undefined;
    const yearTo = url.searchParams.get('yearTo') ? Number(url.searchParams.get('yearTo')) : undefined;
    const groupBy = url.searchParams.get('groupBy')?.split(',') as OlapFilters['groupBy'] || ['ministry', 'expense_item', 'year'];

    if (!groupBy.length) {
        throw new HttpError("groupBy is required", 400, "INVALID_PARAMS");
    }

    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (ministryIds?.length) {
        conditions.push(`m.id = ANY($${paramIndex})`);
        params.push(ministryIds);
        paramIndex++;
    }

    if (expenseItemIds?.length) {
        conditions.push(`ei.id = ANY($${paramIndex})`);
        params.push(expenseItemIds);
        paramIndex++;
    }

    if (yearFrom) {
        conditions.push(`p.year >= $${paramIndex}`);
        params.push(yearFrom);
        paramIndex++;
    }

    if (yearTo) {
        conditions.push(`p.year <= $${paramIndex}`);
        params.push(yearTo);
        paramIndex++;
    }

    const selectFields: string[] = [];
    const groupByFields: string[] = [];

    groupBy.forEach(field => {
        switch (field) {
            case 'ministry':
                selectFields.push('m.id as ministry_id', 'm.name as ministry_name');
                groupByFields.push('m.id', 'm.name');
                break;
            case 'expense_item':
                selectFields.push('ei.id as expense_item_id', 'ei.name as expense_item_name');
                groupByFields.push('ei.id', 'ei.name');
                break;
            case 'year':
                selectFields.push('p.year');
                groupByFields.push('p.year');
                break;
            case 'month':
                selectFields.push('p.month');
                groupByFields.push('p.month');
                break;
        }
    });

    const query = `
    SELECT 
      ${selectFields.join(', ')},
      SUM(mb.planned_expenses) as total_planned,
      SUM(mb.actual_expenses) as total_actual,
      SUM(mb.actual_expenses) - SUM(mb.planned_expenses) as deviation,
      CASE 
        WHEN SUM(mb.planned_expenses) > 0 
        THEN ROUND((SUM(mb.actual_expenses)::numeric / SUM(mb.planned_expenses)::numeric - 1) * 100, 2)
        ELSE NULL 
      END as deviation_percent
    FROM ministries_budget mb
    JOIN ministries m ON m.id = mb.ministry_id
    JOIN expense_items ei ON ei.id = mb.expense_item_id
    JOIN periods p ON p.id = mb.period_id
    WHERE ${conditions.join(' AND ')}
    GROUP BY ${groupByFields.join(', ')}
    ORDER BY ${groupByFields.join(', ')}
  `;

    const result = await db.query(query, params);
    return result.rows;
}