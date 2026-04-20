import React from 'react';
import { Paper, Avatar, Text, Group, Stack, Divider, Badge } from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconSchool,
    IconCode,
    IconDatabase,
    IconBrandGithub,
    IconBrandTelegram,
    IconCalendar
} from '@tabler/icons-react';
import s from './styles.module.scss';
import avatarPhoto from '@assets/avatar.jpg';

export const AboutPage: React.FC = () => {
    return (
        <div className={s.page}>
            <div className={s.header}>
                <div className={s.info}>
                    <div className={s.title}>Об авторе</div>
                    <div className={s.desc}>
                        Информация о разработчике данного веб-приложения
                    </div>
                </div>
            </div>

            <div className={s.content}>
                <Paper withBorder radius="md" className={s.card}>
                    <div className={s.profile}>
                        <Avatar
                            src={avatarPhoto}
                            size={128}
                            radius="md"
                            className={s.avatar}
                        >
                            <IconUser size={64} />
                        </Avatar>

                        <div className={s.profileInfo}>
                            <Text className={s.name}>Конев Прохор Андреевич</Text>
                            <Text className={s.group}>Группа ИДБ-24-12</Text>

                            <Group gap="xs" mt="md">
                                <Badge
                                    size="lg"
                                    variant="light"
                                    color='var(--accent)'
                                    leftSection={<IconSchool size={16} />}
                                >
                                    МГТУ "СТАНКИН"
                                </Badge>
                                <Badge
                                    size="lg"
                                    variant="light"
                                    color='var(--accent)'
                                    leftSection={<IconCode size={16} />}
                                >
                                    Прикладная информатика
                                </Badge>
                            </Group>
                        </div>
                    </div>

                    <Divider my="lg" />

                    <Stack gap="md">
                        <Text className={s.sectionTitle}>Контактная информация</Text>

                        <div className={s.contactItem}>
                            <IconMail size={24} className={s.icon} />
                            <div>
                                <Text className={s.label}>Email</Text>
                                <Text className={s.value}>Prokhor_Konev14@mail.ru</Text>
                            </div>
                        </div>

                        <div className={s.contactItem}>
                            <IconBrandTelegram size={24} className={s.icon} />
                            <div>
                                <Text className={s.label}>Telegram</Text>
                                <Text className={s.value}>@ProkhorKonev</Text>
                            </div>
                        </div>

                        <div className={s.contactItem}>
                            <IconBrandGithub size={24} className={s.icon} />
                            <div>
                                <Text className={s.label}>GitHub</Text>
                                <Text className={s.value}>github.com/Prokhor-Konev</Text>
                            </div>
                        </div>
                    </Stack>

                    <Divider my="lg" />

                    <Stack gap="md">
                        <Text className={s.sectionTitle}>О проекте</Text>

                        <div className={s.projectInfo}>
                            <div className={s.projectItem}>
                                <IconCalendar size={16} className={s.icon} />
                                <Text>Дата выполнения: 19 апреля 2026 года</Text>
                            </div>

                            <div className={s.projectItem}>
                                <IconDatabase size={16} className={s.icon} />
                                <Text>Лабораторная работа №3 по дисциплине "Базы данных"</Text>
                            </div>
                        </div>

                        <Text className={s.description}>
                            Веб-приложение разработано в рамках выполнения лабораторной работы
                            по дисциплине "Базы данных". Реализован функционал выполнения SQL-запросов
                            к базе данных PostgreSQL, а также OLAP-куб для многомерного анализа
                            бюджетных данных министерств.
                        </Text>

                        <Text className={s.techStack}>
                            <strong>Технологический стек:</strong> React, TypeScript, Vite,
                            Mantine UI, Node.js, PostgreSQL, SCSS Modules, Pg, Axios, Dotenv, Http.
                        </Text>
                    </Stack>
                </Paper>
            </div>
        </div>
    );
};