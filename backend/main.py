from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Flashcard(BaseModel):
    question: str
    answer: str
    category: str

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.get("/")
def home():
    return {"message": "Flashcard API is running with MySQL!"}

@app.get("/flashcards")
def get_flashcards():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM flashcards ORDER BY id ASC")
    cards = cursor.fetchall()

    cursor.close()
    connection.close()

    return cards

@app.post("/flashcards")
def create_flashcard(card: Flashcard):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "INSERT INTO flashcards (question, answer, category) VALUES (%s, %s, %s)"
    values = (card.question, card.answer, card.category)

    cursor.execute(query, values)
    connection.commit()

    new_id = cursor.lastrowid

    cursor.execute("SELECT * FROM flashcards WHERE id = %s", (new_id,))
    new_card = cursor.fetchone()

    cursor.close()
    connection.close()

    return new_card

@app.put("/flashcards/{card_id}")
def update_flashcard(card_id: int, updated_card: Flashcard):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM flashcards WHERE id = %s", (card_id,))
    existing_card = cursor.fetchone()

    if not existing_card:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=404, detail="Flashcard not found")

    update_query = """
    UPDATE flashcards
    SET question = %s, answer = %s, category = %s
    WHERE id = %s
"""
    cursor.execute(
    update_query,
    (updated_card.question, updated_card.answer, updated_card.category, card_id)
)
    connection.commit()

    cursor.execute("SELECT * FROM flashcards WHERE id = %s", (card_id,))
    updated = cursor.fetchone()

    cursor.close()
    connection.close()

    return updated

@app.delete("/flashcards/{card_id}")
def delete_flashcard(card_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM flashcards WHERE id = %s", (card_id,))
    card = cursor.fetchone()

    if not card:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=404, detail="Flashcard not found")

    cursor.execute("DELETE FROM flashcards WHERE id = %s", (card_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return card