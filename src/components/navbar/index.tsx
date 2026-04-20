import type React from "react";
import { useNavigate } from "react-router-dom";
import s from "./styles.module.scss";

export const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={s.container}>
            <div className={s.navbar}>
                <div className={s["navbar-title"]}>
                    Лабораторная работа №3
                </div>

                <div className={s["navbar-links"]}>
                    <div onClick={() => navigate("/")}>Главная</div>
                    <div onClick={() => navigate("/query/1")}>Лабораторная работа №1</div>
                    <div onClick={() => navigate("/query/2")}>Лабораторная работа №2</div>
                    <div onClick={() => navigate("/olap")}>OLAP</div>
                    <div onClick={() => navigate("/about")}>Об авторе</div>
                </div>
            </div>
            <hr className={s.divider} />
        </div>
    );
};