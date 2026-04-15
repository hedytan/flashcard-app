# Flashcard Learning App

## Project Title
Flashcard Learning App

## Project Overview
This project is a single-page dynamic web application designed to help students create, organise, review, edit, and delete study flashcards in one place. The website solves the problem of keeping study notes structured and easy to revise by allowing users to manage flashcards through a clean and interactive interface.

The application behaves like a single-page application (SPA) because all major interactions happen within the same page. Users can add, update, delete, search, and reveal flashcards dynamically without navigating to a new HTML page.

## Problem the Website Solves
Students often need a simple way to organise short study notes and review them efficiently. Traditional notes can become cluttered and difficult to manage. This website provides a more structured way to store revision content by turning study notes into flashcards with categories, search functionality, and CRUD operations connected to a database.

## Technical Stack
### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Database
- MySQL

### Communication Between Frontend and Backend
- REST API
- Fetch API
- JSON data exchange

## Features
- Add a new flashcard
- View all flashcards on one page
- Edit an existing flashcard
- Delete a flashcard
- Show and hide flashcard answers
- Assign a category to each flashcard
- Search flashcards by question or category
- Display loading state while fetching data
- Display success and error feedback messages
- Confirmation prompt before deleting flashcards
- Store all flashcard data in MySQL

## SPA Behaviour
The application behaves like a single-page application because it only uses one main HTML page. Instead of loading different pages from the server, JavaScript dynamically updates the page content by rendering flashcards, updating search results, and refreshing data after CRUD operations.

## Business Logic
The business logic of this application is based on the workflow of managing study flashcards:
- Users create flashcards by entering a question, category, and answer
- Users can review all flashcards in one page
- Users can search for flashcards by keyword or category
- Users can edit flashcards when the content changes
- Users can delete flashcards when they are no longer needed
- Users can reveal answers only when needed to simulate a simple revision activity

This workflow reflects a realistic learning tool rather than a purely technical CRUD demonstration.

## User Experience and Interface Design
The user interface is designed to be clean, simple, and easy to navigate. The page uses a card-based layout, clear section hierarchy, labelled form fields, category selection, search functionality, and colour-coded action buttons. Feedback messages and loading states are included to improve the interaction flow and make the application feel smoother and more responsive.

## Database Structure
This project uses a MySQL database called `flashcard_app` and a table called `flashcards`.

### Table: `flashcards`
- `id` – integer, auto increment, primary key
- `question` – varchar(255), not null
- `answer` – text, not null
- `category` – varchar(100), not null, default value `General`

## CRUD Operations

### Create
Users can add a new flashcard through the form.

### Read
Users can view all flashcards displayed on the page.

### Update
Users can edit the content of an existing flashcard.

### Delete
Users can remove a flashcard from both the interface and the database.

## Folder Structure
FLASHCARD APP
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend
│   ├── index.html
│   ├── style.css
│   └── app.js
├── flashcard_app.sql
└── README.md

## Challenges Overcome
One challenge in this project was getting the frontend and backend to communicate properly using FastAPI and JavaScript fetch requests. I also had to solve several setup issues, including port conflicts, MySQL connection problems, and database authentication errors. Another challenge was making sure that add, edit, and delete actions changed both the page and the MySQL database correctly. After that, I worked on improving the project by adding category support, search, loading messages, and delete confirmation. These steps made the website more complete and helped it feel more like a real single-page web application.