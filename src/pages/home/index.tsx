import type React from 'react';
import { Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
    IconDatabase,
    IconCube,
    IconUser,
    IconChevronRight
} from '@tabler/icons-react';
import { queryConfig } from '../../config';
import s from './styles.module.scss';
import { useMemo } from 'react';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const lab1Queries = useMemo(() => queryConfig.filter(q => q.lab === 1), []);
    const lab2Queries = useMemo(() => queryConfig.filter(q => q.lab === 2), []);

    const goToQuery = (lab: number, id: number) => {
        navigate(`/query/${lab}/${id}`);
    };

    const goToLab = (lab: number) => {
        const first = queryConfig.find(q => q.lab === lab);
        if (first) navigate(`/query/${lab}/${first.id}`);
    };

    return (
        <div className={s.home}>
            <div className={s.welcome}>
                <h1 className={s['welcome-title']}>Базы данных</h1>
                <p className={s['welcome-desc']}>
                    Лабораторная работа №3 - МГТУ "СТАНКИН" - 2026
                </p>
            </div>

            <div className={s.grid}>
                <Card className={s.card} onClick={() => goToLab(1)}>
                    <div className={s['card-header']}>
                        <div className={s['card-icon']}>
                            <IconDatabase size={24} />
                        </div>
                        <IconChevronRight size={24} className={s['card-arrow']} />
                    </div>

                    <div className={s['card-content']}>
                        <div className={s.title}>Лабораторная работа №1</div>
                        <div className={s.desc}>Создание базы данных и таблиц</div>
                    </div>

                    <div className={s.queries}>
                        {lab1Queries.slice(0, 5).map(q => (
                            <button
                                key={q.id}
                                className={s['query-btn']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToQuery(1, q.id);
                                }}
                            >
                                {q.title}
                            </button>
                        ))}
                        {lab1Queries.length > 5 && (
                            <span className={s['more-badge']}>
                                +{lab1Queries.length - 5} запросов
                            </span>
                        )}
                    </div>
                </Card>

                <Card className={s.card} onClick={() => goToLab(2)}>
                    <div className={s['card-header']}>
                        <div className={s['card-icon']}>
                            <IconDatabase size={24} />
                        </div>
                        <IconChevronRight size={24} className={s['card-arrow']} />
                    </div>

                    <div className={s['card-content']}>
                        <div className={s.title}>Лабораторная работа №2</div>
                        <div className={s.desc}>Выборка и обработка данных</div>
                    </div>

                    <div className={s.queries}>
                        {lab2Queries.slice(0, 5).map(q => (
                            <button
                                key={q.id}
                                className={s['query-btn']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToQuery(2, q.id);
                                }}
                            >
                                {q.title}
                            </button>
                        ))}
                        {lab2Queries.length > 5 && (
                            <span className={s['more-badge']}>
                                +{lab2Queries.length - 5} запросов
                            </span>
                        )}
                    </div>
                </Card>

                <Card className={`${s.card} ${s['card-olap']}`} onClick={() => navigate('/olap')}>
                    <div className={s['card-header']}>
                        <div className={s['card-icon']}>
                            <IconCube size={24} />
                        </div>
                        <IconChevronRight size={24} className={s['card-arrow']} />
                    </div>

                    <div className={s['card-content']}>
                        <div className={s.title}>OLAP-куб</div>
                        <div className={s.desc}>Многомерный анализ бюджета</div>
                    </div>

                    <div className={s['olap-preview']}>
                        <span>Измерения: Министерства, Статьи, Периоды</span>
                        <span>Меры: План, Факт, Отклонения</span>
                    </div>
                </Card>

                <Card className={`${s.card} ${s['card-about']}`} onClick={() => navigate('/about')}>
                    <div className={s['card-header']}>
                        <div className={s['card-icon']}>
                            <IconUser size={24} />
                        </div>
                        <IconChevronRight size={24} className={s['card-arrow']} />
                    </div>

                    <div className={s['card-content']}>
                        <div className={s.title}>Об авторе</div>
                        <div className={s.desc}>Информация о разработчике</div>
                    </div>

                    <div className={s['about-preview']}>
                        <span>Конев Прохор Андреевич</span>
                        <span>Группа ИДБ-24-12</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};