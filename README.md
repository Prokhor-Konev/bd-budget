# Лабораторная работа №3 по дисциплине "Базы данных"

Веб-приложение для выполнения SQL-запросов к базе данных PostgreSQL и многомерного анализа бюджетных данных министерств.

## Функциональность

- Просмотр и выполнение SQL-запросов из лабораторных работ №1 и №2
- Подсветка синтаксиса SQL с возможностью копирования
- OLAP-куб для анализа бюджетных данных с гибкой фильтрацией и группировкой
- Экспорт результатов в CSV
- Адаптивный интерфейс

## Технологии

**Frontend:**
- React 18
- TypeScript
- Vite
- Mantine UI
- React Router
- SCSS Modules

**Backend:**
- Node.js
- TypeScript
- PostgreSQL
- pg (node-postgres)

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Установка зависимостей
## ОБЯЗАТЕЛЬНОЕ НАЛИЧИЕ NODE.JS >= v.22.12.0
```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=budget
```

### 4. Инициализация базы данных

Выполните SQL-скрипты для создания таблиц, представлений и наполнения тестовыми данными:

```sql
-- Таблицы
CREATE TABLE ministries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  employees_count INT DEFAULT 0,
  minister TEXT
);

CREATE TABLE expense_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT
);

CREATE TABLE periods (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  month INT CHECK (month BETWEEN 1 AND 12)
);

CREATE TABLE ministries_budget (
  id SERIAL PRIMARY KEY,
  ministry_id INT REFERENCES ministries(id) ON DELETE CASCADE,
  expense_item_id INT REFERENCES expense_items(id),
  period_id INT REFERENCES periods(id),
  planned_expenses BIGINT,
  actual_expenses BIGINT
);

-- Представления
CREATE VIEW ministry_budget_view AS
SELECT 
  m.id AS ministry_id,
  m.name AS ministry_name,
  e.id AS expense_item_id,
  e.name AS expense_item_name,
  p.year,
  p.month,
  mb.planned_expenses,
  mb.actual_expenses,
  (mb.actual_expenses - mb.planned_expenses) AS deviation
FROM ministries_budget mb
JOIN ministries m ON mb.ministry_id = m.id
JOIN expense_items e ON mb.expense_item_id = e.id
JOIN periods p ON mb.period_id = p.id;

CREATE VIEW ministry_statistics AS
SELECT 
  m.id,
  m.name AS "Министерство",
  COUNT(mb.id) AS "Количество записей",
  COALESCE(AVG(mb.actual_expenses), 0) AS "Средние расходы",
  COALESCE(MAX(mb.actual_expenses), 0) AS "Максимальные расходы",
  COALESCE(MIN(mb.actual_expenses), 0) AS "Минимальные расходы",
  COALESCE(SUM(mb.planned_expenses), 0) AS "План всего",
  COALESCE(SUM(mb.actual_expenses), 0) AS "Факт всего"
FROM ministries m
LEFT JOIN ministries_budget mb ON m.id = mb.ministry_id
GROUP BY m.id, m.name;
```

### 5. Запуск приложения

**Режим разработки (клиент + сервер):**

```bash
npm start
```

Приложение будет доступно по адресу: http://localhost:5173

## API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/query` | Выполнение SQL-запроса (параметры: lab, id) |
| POST | `/olap` | Получение агрегированных данных OLAP |
| GET | `/dictionaries/ministries` | Список министерств |
| GET | `/dictionaries/expense-items` | Список статей расходов |

## Автор

Конев Прохор Андреевич, группа ИДБ-24-12

МГТУ "СТАНКИН", 2026