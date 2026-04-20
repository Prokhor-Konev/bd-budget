import type React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Tooltip } from '@mantine/core';
import { SqlHighlight } from '@components/sql-highlight';
import { queryConfig } from '@config';
import { executeQuery } from '@api/execute-query';
import { ResultTable } from '@components/result-table';
import { useEffect, useMemo, useState } from 'react';
import s from './styles.module.scss';
import type { ExecuteQueryResponse } from '@api/configs/types';
import { IconDownload, IconPlayerPlay, IconTable } from '@tabler/icons-react';

export const QueryPage: React.FC = () => {
    const navigate = useNavigate();
    const { lab, id } = useParams();
    const [data, setData] = useState<ExecuteQueryResponse>([]);
    const [loading, setLoading] = useState<'pending' | 'idle' | 'fulfilled' | 'rejected'>('idle');
    const [error, setError] = useState('');

    const query = useMemo(() => {
        if (!lab) return;
        if (!id) {
            const query = queryConfig.filter(q => q.lab === Number(lab))[0];
            navigate(`${query.id}`);
            return;
        }
        return queryConfig.find(q => q.lab === Number(lab) && q.id === Number(id));
    }, [lab, id]);

    useEffect(() => {
        setData([]);
        setLoading('idle')
    }, [query])

    const handleExecute = async () => {
        if (!query) return;
        try {
            setLoading('pending');
            const res = await executeQuery(query.lab, query.id);
            if ('data' in res) {
                setData(res.data);
            } else {
                setLoading('rejected');
                setError(`${res.code}: ${res.message}. ${res.error.message}`);
                return;
            }
            setLoading('fulfilled');
        } catch (e: any) {
            setLoading('rejected');
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
        link.setAttribute('download', `query_result_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!query) return null;

    return (
        <div className={s.page}>
            <div className={s.header}>
                <div className={s.info}>
                    <div className={s.title}>{query.title}</div>
                    <div className={s.desc}>{query.description}</div>
                </div>

                <div className={s.actions}>
                    {data.length > 0 && (
                        <Tooltip label="Экспорт в CSV" withArrow>
                            <Button
                                className={s['export-button']}
                                variant="subtle"
                                onClick={exportToCSV}
                                leftSection={<IconDownload size={16} />}
                            >
                                CSV
                            </Button>
                        </Tooltip>
                    )}
                    <Button
                        onClick={handleExecute}
                        loading={loading === 'pending'}
                        className={`${s['execute-btn']} ${loading && s.loading}`}
                        leftSection={<IconPlayerPlay size={16}/>}
                    >
                        Выполнить
                    </Button>
                </div>
            </div>

            <div className={s.code}>
                <SqlHighlight code={query.query} language="sql" />
            </div>

            <div className={s['result-section']}>
                <div className={s['result-header']}>
                    <div className={s['header-left']}>
                        <IconTable size={16} />
                        <span>Результаты</span>
                    </div>
                    {loading === 'fulfilled' && (
                        <Badge
                            size="md"
                            variant="light"
                            color={'var(--accent)'}
                        >
                            Всего записей: {data.length}
                        </Badge>
                    )}
                </div>
                <div className={s.result}>
                    {loading === 'fulfilled'
                        ? <ResultTable data={data} />
                        : null
                    }
                    {loading === 'rejected'
                        ? <Alert variant="light" color={'var(--danger)'} title={error} />
                        : null
                    }
                    {loading === 'idle'
                        ? <Alert
                            variant="light"
                            color="var(--accent)"
                            title="Нет данных для отображения"
                        >
                            Нажмите "Выполнить" для исполнения запроса
                        </Alert>
                        : null
                    }
                </div>
            </div>
        </div>
    );
};