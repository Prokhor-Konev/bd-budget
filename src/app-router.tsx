import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@layouts/main-layout';
import { QueryLayout } from '@layouts/query-layout';
import { HomePage } from '@pages/home';
import { QueryPage } from '@pages/query';
import { OlapPage } from '@pages/olap';
import { AboutPage } from '@pages/about';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/olap" element={<OlapPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/query/:lab" element={<QueryLayout />}>
                        <Route index element={<QueryPage />} />
                        <Route path=":id" element={<QueryPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};