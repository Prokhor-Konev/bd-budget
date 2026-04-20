import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AppRouter } from "./app-router";
import "./styles.scss";
import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/code-highlight/styles.layer.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MantineProvider>
        <AppRouter />
    </MantineProvider>
);