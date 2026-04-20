import type React from "react";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@components/sidebar";

export const QueryLayout: React.FC = () => {
    return (
        <AppShell
            navbar={{ width: '35%', breakpoint: 'sm' }}
            padding={'md'}
            flex={1}
        >
            <AppShell.Navbar withBorder>
                <Sidebar />
            </AppShell.Navbar>
            <Outlet />
        </AppShell>
    );
};