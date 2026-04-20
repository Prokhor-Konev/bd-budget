import { db } from "../db";

export async function getMinistries() {
    const result = await db.query('SELECT id, name FROM ministries ORDER BY name');
    return result.rows;
}

export async function getExpenseItems() {
    const result = await db.query('SELECT id, name FROM expense_items ORDER BY name');
    return result.rows;
}