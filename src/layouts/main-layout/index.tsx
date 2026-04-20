import type React from "react";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Navbar } from "@components/navbar";
import s from "./styles.module.scss";

export const MainLayout: React.FC = () => {
    return (
        <AppShell
            header={{ height: 66 }}
            padding="md"
        >
            <AppShell.Header withBorder={false}>
                <Navbar />
            </AppShell.Header>

            <AppShell.Main className={s.main}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};