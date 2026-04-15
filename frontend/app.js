const API_URL = "http://127.0.0.1:8010/flashcards";

const flashcardForm = document.getElementById("flashcard-form");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const categoryInput = document.getElementById("category");
const flashcardList = document.getElementById("flashcard-list");
const cardCount = document.getElementById("card-count");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const searchInput = document.getElementById("search-input");
const messageBox = document.getElementById("message-box");

let flashcards = [];
let editingId = null;

async function fetchFlashcards() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    flashcards = data;
    renderFlashcards();
  } catch (error) {
    flashcardList.innerHTML = `<p class="empty-message">Failed to load flashcards.</p>`;
    console.error("Error fetching flashcards:", error);
  }
}

function updateCardCount() {
  cardCount.textContent = `${flashcards.length} card${flashcards.length !== 1 ? "s" : ""}`;
}

function renderFlashcards() {
  flashcardList.innerHTML = "";

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredFlashcards = flashcards.filter((card) => {
    return (
      card.question.toLowerCase().includes(searchTerm) ||
      card.category.toLowerCase().includes(searchTerm)
    );
  });

  if (filteredFlashcards.length === 0) {
    flashcardList.innerHTML = `<p class="empty-message">No matching flashcards found.</p>`;
    cardCount.textContent = `0 cards`;
    return;
  }

  filteredFlashcards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("flashcard");

    cardElement.innerHTML = `
      <h3>${card.question}</h3>
      <p><strong>Category:</strong> ${card.category}</p>
      <p class="answer">${card.answer}</p>
      <div class="card-buttons">
        <button class="toggle-btn">Show Answer</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const toggleButton = cardElement.querySelector(".toggle-btn");
    const editButton = cardElement.querySelector(".edit-btn");
    const deleteButton = cardElement.querySelector(".delete-btn");
    const answerElement = cardElement.querySelector(".answer");

    toggleButton.addEventListener("click", () => {
      const isVisible = answerElement.style.display === "block";

      if (isVisible) {
        answerElement.style.display = "none";
        toggleButton.textContent = "Show Answer";
      } else {
        answerElement.style.display = "block";
        toggleButton.textContent = "Hide Answer";
      }
    });

    editButton.addEventListener("click", () => {
      startEdit(card);
    });

    deleteButton.addEventListener("click", () => {
      deleteFlashcard(card.id);
    });

    flashcardList.appendChild(cardElement);
  });

  cardCount.textContent = `${filteredFlashcards.length} card${filteredFlashcards.length !== 1 ? "s" : ""}`;
}

async function createFlashcard(question, answer, category) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, answer, category })
    });

    showMessage("Flashcard added successfully.", "success");
    await fetchFlashcards();
  } catch (error) {
    console.error("Error creating flashcard:", error);
    showMessage("Failed to add flashcard.", "error");
  }
}

async function updateFlashcard(id, question, answer, category) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, answer, category })
    });

    fetchFlashcards();
  } catch (error) {
    console.error("Error updating flashcard:", error);
  }
}

async function deleteFlashcard(id) {
  const confirmed = confirm("Are you sure you want to delete this flashcard?");

  if (!confirmed) {
    return;
  }

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (editingId === id) {
      resetForm();
    }

    showMessage("Flashcard deleted successfully.", "success");
    fetchFlashcards();
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    showMessage("Failed to delete flashcard.", "error");
  }
}

function startEdit(card) {
  questionInput.value = card.question;
  answerInput.value = card.answer;
  categoryInput.value = card.category;
  editingId = card.id;

  formTitle.textContent = "Edit Flashcard";
  submitBtn.textContent = "Update Flashcard";
  cancelBtn.style.display = "inline-block";
}

function resetForm() {
  flashcardForm.reset();
  categoryInput.value = "";
  editingId = null;

  formTitle.textContent = "Add a New Flashcard";
  submitBtn.textContent = "Add Flashcard";
  cancelBtn.style.display = "none";
}

flashcardForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const category = categoryInput.value;

  console.log("Submitting:", { question, answer, category });

  if (!question || !answer || !category) {
    alert("Please fill in both question, category and answer.");
    return;
  }

  if (editingId === null) {
  await createFlashcard(question, answer, category);
} else {
  await updateFlashcard(editingId, question, answer, category);
}

  resetForm();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
});

searchInput.addEventListener("input", () => {
  renderFlashcards();
});

function showMessage(message, type) {
  messageBox.innerHTML = `<div class="message ${type}">${message}</div>`;

  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 2500);
}

fetchFlashcards();