# Batch Operations – Listing, Search & Pagination

## About the Project
This project is a Batch Operations web application developed as part of a company technical assessment.
It allows users to view batch records in a table, search batches by batch code or course name, filter records by status and centre, and navigate through records using pagination.

## Features
- Display batch records in a table.
- Search batches by batch code and course name.
- Filter batches by status and centre.
- View 5 records per page.
- Navigate using Previous, Next, and page number buttons.
- Display loading and error messages.
- Show a message when no matching records are found.
- Create Batch button (UI only).

## Technologies Used

**Frontend:**
- React.js
- Axios / Fetch API
- CSS / Tailwind CSS

**Backend:**
- Node.js
- Express.js
- JavaScript

**Data Storage:**
- Local JavaScript array (sample batch records).

## Project Structure

```text
project/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── data/
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── App.jsx
        └── main.jsx
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal to view the application.

*Note: Update the start commands according to the scripts in your package.json files.*

## API Endpoint

**Get Batch Records**

```http
GET /api/batches?page=1&limit=5&search=&status=&centre=
```

The API supports searching, filtering, and pagination.

## Note
This project was developed within the given time limit as part of a technical assessment. Some features may be incomplete.
