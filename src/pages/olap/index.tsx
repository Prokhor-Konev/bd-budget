import React, { useState } from 'react';
import { Alert, Button, Tooltip } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { OlapFilters } from '@components/olap-filters';
import { ResultTable } from '@components/result-table';
import { fetchOlapData } from '@api/olap';
import type { ExecuteQueryResponse, OlapParams } from '@api/configs/types';
import s from './styles.module.scss';

export const OlapPage: React.FC = () => {
    const [data, setData] = useState<ExecuteQueryResponse>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApplyFilters = async (filters: OlapParams) => {
        try {
            setLoading(true);
            setError('');

            const res = await fetchOlapData(filters);

            if ('data' in res) {
                setData(res.data);
            } else {
                setError(`${res.code}: ${res.message}. ${res.error.message}`);
            }
        } catch (e: any) {
            setError(e.message || 'Произошла ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!data.length) return;

        const headers = Object.keys(data[0]);

        const csvRows = [
            headers.map(header => `"${header}"`).join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined) return '""';
                    if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
                    if (typeof value === 'number') return value.toString();
                    return `"${value}"`;
                }).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `olap_report_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const totalPlanned = data.reduce((sum, row) => sum + (Number(row.total_planned) || 0), 0);
    const totalActual = data.reduce((sum, row) => sum + (Number(row.total_actual) || 0), 0);
    const deviationPercent = totalPlanned > 0
        ? ((totalActual / totalPlanned - 1) * 100).toFixed(2)
        : '0.00';

    return (
        <div className={s.page}>
            <div className={s.header}>
                <div className={s.info}>
                    <div className={s.title}>OLAP-Куб «БЮДЖЕТ»</div>
                    <div className={s.desc}>
                        Выберите тип отчета и настройте фильтры для анализа плановых и фактических расходов
                    </div>
                </div>
            </div>

            <div className={s.mainContent}>
                <div className={s.filtersSidebar}>
                    <OlapFilters onApply={handleApplyFilters} loading={loading} />
                </div>

                <div className={s.content}>
                    {error && (
                        <Alert variant="light" color="var(--danger)" title={error} />
                    )}

                    {!error && data.length > 0 && (
                        <>
                            <div className={s.stats}>
                                <div className={s.stat}>
                                    <span>Всего записей</span>
                                    <strong>{data.length}</strong>
                                </div>
                                <div className={s.stat}>
                                    <span>План всего</span>
                                    <strong>{totalPlanned.toLocaleString()} ₽</strong>
                                </div>
                                <div className={s.stat}>
                                    <span>Факт всего</span>
                                    <strong>{totalActual.toLocaleString()} ₽</strong>
                                </div>
                                <div className={s.stat}>
                                    <span>Отклонение</span>
                                    <strong style={{
                                        color: totalActual <= totalPlanned ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {deviationPercent}%
                                    </strong>
                                </div>

                                <Tooltip label="Экспорт в CSV" withArrow>
                                    <Button
                                        variant="subtle"
                                        size="compact-md"
                                        onClick={exportToCSV}
                                        className={s.exportButton}
                                        leftSection={<IconDownload size={16} />}
                                    >
                                        CSV
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className={s.result}>
                                <ResultTable data={data} />
                            </div>
                        </>
                    )}

                    {!error && !loading && data.length === 0 && (
                        <Alert
                            variant="light"
                            color="var(--accent)"
                            title="Нет данных для отображения"
                        >
                            Выберите параметры и нажмите "Показать отчет"
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};