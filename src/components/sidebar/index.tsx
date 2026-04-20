import type React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { queryConfig } from "../../config";
import { useMemo } from "react";
import s from "./styles.module.scss";

export const Sidebar: React.FC = () => {
    const { lab, id } = useParams();
    const navigate = useNavigate();

    const queries = useMemo(() => {
        return queryConfig.filter(q => q.lab === Number(lab));
    }, [lab]);

    return (
        <div className={s.sidebar}>
            {queries.map(q => (
                <div
                    key={q.id}
                    className={`${s["sidebar-item"]} ${Number(id) === q.id ? s.active : ""
                        }`}
                    onClick={() => navigate(`/query/${lab}/${q.id}`)}
                >
                    {q.title}
                </div>
            ))}
        </div>
    );
};