# 💰 Lumincoin Finance

**Lumincoin Finance** — это веб-приложение для ведения и анализа личных финансов. Простой и удобный интерфейс позволяет добавлять, редактировать и удалять транзакции, отслеживать баланс и визуально анализировать структуру доходов и расходов с помощью диаграмм.

## 📌 О проекте

Проект разработан с целью углублённого изучения **JavaScript**, а далее был переписан на **TypeScript**, взаимодействия с DOM, компонентного подхода и организации frontend-архитектуры без использования фреймворков. Используется Bootstrap для сетки и стилизации, а также Chart.js для отображения диаграмм.

## 🛠️ Стек технологий

- **TypeScript**
- **HTML5 / SCSS / Bootstrap 5**
- **JavaScript (ES6+)**
- **Chart.js**
- **Webpack (сборка)**
- **Git / npm**
- **Figma (дизайн-макет)**

## ✨ Основной функционал

- ✅ **CRUD**-операции с транзакциями (добавление, редактирование, удаление)
- ✅ Распределение операций по категориям (доходы / расходы)
- ✅ Отображение **баланса**
- ✅ **Круговая диаграмма** по категориям через `Chart.js`
- ✅ Адаптивная вёрстка
- ✅ Простая фильтрация

## 🚀 Установка и запуск

```bash
git clone https://github.com/BazhenovDev/lumincoin_finance_ts.git
cd lumincoin_finance_ts
Установка npm пакетов backend:
cd backend
npm install
Устновка npm пакетов frontend:
cd ../frontend
npm install
```
- **Запуск backend сервера:**
```
Если находимся в папке frontend, то вернись в корень проекта и зайдите в папку backend:
cd ../backend
npm start

Если в корневой папке находимся:
cd backend
npm start
```
- **Запуск frontend приложения:**
```
Открыть новый терминал или вернись в корень проекта:
cd ../frontend
npm run dev

Если в корневой папке находимся:
cd frontend
npm run dev
```
- Frontend-приложение будет доступно на http://localhost:9003
- Для авторизации логин: test@itlogia.ru, пароль: 12345678Qq
- Либо зарегистрируйтесь в приложение, пароль должен содержать минимум 8 символов, минимум одну заглавную и одну строчную букву, минимум одну цифру или спецсимвол 

## 📷 Скриншоты
<img width="1470" alt="login" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/login.jpg">
<img width="1470" alt="main" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/main.jpg">
<img width="1470" alt="balance" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/balance.jpg">
<img width="1470" alt="operations" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/operations.jpg">
<img width="1470" alt="create" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/create.jpg">
<img width="1470" alt="edit" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/edit.jpg">
<img width="1470" alt="expenses" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/expenses.jpg">
<img width="1470" alt="income" src="https://github.com/BazhenovDev/lumincoin_finance_ts/blob/main/frontend/assets_gh/income.jpg">

