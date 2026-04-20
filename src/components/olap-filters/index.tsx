import React, { useEffect, useState, useMemo } from 'react';
import { MultiSelect, Select, Button, Paper, Text } from '@mantine/core';
import { fetchMinistries, fetchExpenseItems, type Ministry, type ExpenseItem } from '@api/dictionaries';
import type { OlapParams, GroupByField } from '@api/configs/types';
import { olapConfig } from '@config';
import s from './styles.module.scss';

type Props = {
    onApply: (filters: OlapParams) => void;
    loading?: boolean;
}

export const OlapFilters: React.FC<Props> = ({ onApply, loading }) => {
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    const [reportType, setReportType] = useState<string>('custom');
    const [selectedMinistries, setSelectedMinistries] = useState<number[]>([]);
    const [selectedExpenseItems, setSelectedExpenseItems] = useState<number[]>([]);
    const [yearFrom, setYearFrom] = useState<string | null>(null);
    const [yearTo, setYearTo] = useState<string | null>(null);
    const [groupBy, setGroupBy] = useState<GroupByField[]>(['ministry', 'expense_item', 'year']);
    const [loadingDicts, setLoadingDicts] = useState(true);
    const [error, setError] = useState<string>('');

    const config = useMemo(() => olapConfig.find(c => c.type === reportType)!, [reportType]);

    const yearsOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => (2020 + i).toString()), []);
    const groupByOptions: Array<{ value: GroupByField; label: string }> = [
        { value: 'ministry', label: 'Министерство' },
        { value: 'expense_item', label: 'Статья расходов' },
        { value: 'year', label: 'Год' },
        { value: 'month', label: 'Месяц' },
    ];
    const reportOptions = useMemo(() => olapConfig.map(c => ({ value: c.type, label: c.label })), []);
    const ministryOptions = useMemo(() => ministries.map(m => ({ value: m.id.toString(), label: m.name })), [ministries]);
    const expenseOptions = useMemo(() => expenseItems.map(e => ({ value: e.id.toString(), label: e.name })), [expenseItems]);

    const allHidden = useMemo(() => Object.values(config.fields).every(f => !f.show), [config])

    useEffect(() => {
        const loadDictionaries = async () => {
            try {
                setLoadingDicts(true);
                const [ministriesRes, itemsRes] = await Promise.all([
                    fetchMinistries(),
                    fetchExpenseItems()
                ]);

                if ('data' in ministriesRes) setMinistries(ministriesRes.data);

                if ('data' in itemsRes) setExpenseItems(itemsRes.data);
            } catch (error) {
                console.error('Failed to load dictionaries:', error);
            } finally {
                setLoadingDicts(false);
            }
        };

        loadDictionaries();
    }, []);

    useEffect(() => {
        setError('');
        setGroupBy(config.defaultGroupBy as GroupByField[]);

        // Очистка полей, которые скрыты
        if (!config.fields.ministries.show) {
            setSelectedMinistries([]);
        }
        if (!config.fields.expenseItems.show) {
            setSelectedExpenseItems([]);
        }
        if (!config.fields.years.show) {
            setYearFrom(null);
            setYearTo(null);
        }
    }, [config]);

    const handleMinistriesChange = (values: string[]) => {
        const ids = values.map(v => parseInt(v));
        if (!config.fields.ministries.multiple && ids.length > 1) {
            setSelectedMinistries([ids[ids.length - 1]]);
        } else {
            setSelectedMinistries(ids);
        }
    };

    const handleExpenseItemsChange = (values: string[]) => {
        const ids = values.map(v => parseInt(v));
        if (!config.fields.expenseItems.multiple && ids.length > 1) {
            setSelectedExpenseItems([ids[ids.length - 1]]);
        } else {
            setSelectedExpenseItems(ids);
        }
    };

    const validateFilters = (): boolean => {
        if (config.fields.ministries.required && selectedMinistries.length === 0) {
            setError('Выберите министерство');
            return false;
        }
        if (config.fields.expenseItems.required && selectedExpenseItems.length === 0) {
            setError('Выберите статью расходов');
            return false;
        }
        if (config.fields.groupBy.show && groupBy.length === 0) {
            setError('Выберите измерение для группировки');
            return false;
        }
        setError('');
        return true;
    };

    const handleApply = () => {
        if (!validateFilters()) return;

        onApply({
            ministryIds: selectedMinistries.length > 0 ? selectedMinistries : undefined,
            expenseItemIds: selectedExpenseItems.length > 0 ? selectedExpenseItems : undefined,
            yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
            yearTo: yearTo ? parseInt(yearTo) : undefined,
            groupBy: groupBy,
        });
    };

    const getMinistriesPlaceholder = () => {
        if (config.fields.ministries.required) return "Выберите министерство";
        if (!config.fields.ministries.multiple) return "Выберите одно министерство";
        return "Все министерства";
    };

    const getExpenseItemsPlaceholder = () => {
        if (config.fields.expenseItems.required) return "Выберите статью";
        if (!config.fields.expenseItems.multiple) return "Выберите одну статью";
        return "Все статьи";
    };

    return (
        <Paper withBorder radius="md" className={s.filters}>
            <div className={s.field}>
                <Select
                    label="Тип отчета"
                    placeholder="Выберите тип отчета"
                    data={reportOptions}
                    value={reportType}
                    onChange={(value) => value && setReportType(value)}
                    disabled={loadingDicts || loading}
                    searchable
                />
            </div>

            <Text size="sm" c="dimmed">{config.description}</Text>

            {!allHidden
                ? <div className={s.divider} />
                : null
            }

            {config.fields.ministries.show && (
                <div className={s.field}>
                    <MultiSelect
                        label="Министерства"
                        placeholder={getMinistriesPlaceholder()}
                        data={ministryOptions}
                        value={selectedMinistries.map(id => id.toString())}
                        onChange={handleMinistriesChange}
                        clearable
                        searchable
                        disabled={loadingDicts || loading}
                        maxValues={config.fields.ministries.multiple ? undefined : 1}
                    />
                </div>
            )}

            {config.fields.expenseItems.show && (
                <div className={s.field}>
                    <MultiSelect
                        label="Статьи расходов"
                        placeholder={getExpenseItemsPlaceholder()}
                        data={expenseOptions}
                        value={selectedExpenseItems.map(id => id.toString())}
                        onChange={handleExpenseItemsChange}
                        clearable
                        searchable
                        disabled={loadingDicts || loading}
                        maxValues={config.fields.expenseItems.multiple ? undefined : 1}
                    />
                </div>
            )}

            {config.fields.years.show && (
                <>
                    <div className={s.field}>
                        <Select
                            label="Год от"
                            placeholder="Любой год"
                            data={yearsOptions}
                            value={yearFrom}
                            onChange={setYearFrom}
                            clearable
                            disabled={loading}
                            searchable
                        />
                    </div>
                    <div className={s.field}>
                        <Select
                            label="Год до"
                            placeholder="Любой год"
                            data={yearsOptions}
                            value={yearTo}
                            onChange={setYearTo}
                            clearable
                            disabled={loading}
                            searchable
                        />
                    </div>
                </>
            )}

            {config.fields.groupBy.show && (
                <>
                    <div className={s.divider} />
                    <div className={s.field}>
                        <MultiSelect
                            label="Группировка"
                            placeholder="Выберите измерения"
                            data={groupByOptions}
                            value={groupBy}
                            onChange={(values) => setGroupBy(values as GroupByField[])}
                            clearable={false}
                            disabled={loading}
                        />
                        <Text size="xs" className={s.hint}>
                            Выберите одно или несколько измерений
                        </Text>
                    </div>
                </>
            )}

            {error && (
                <Text className={s.error}>
                    {error}
                </Text>
            )}

            <Button
                onClick={handleApply}
                loading={loading}
                disabled={loadingDicts}
                fullWidth
                className={s.applyButton}
            >
                Показать отчет
            </Button>
        </Paper>
    );
};