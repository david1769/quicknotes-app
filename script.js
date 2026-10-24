
// ===== Element selection =====
const noteForm      = document.querySelector("#note-form");
const noteInput     = document.querySelector("#note-input");
const noteCategory  = document.querySelector("#note-category");
const searchInput   = document.querySelector("#search-input");
const notesList     = document.querySelector("#notes-list");
const noteCount     = document.querySelector("#note-count");
const errorMessage  = document.querySelector("#error-message");

// ===== Data =====
let notes = [];

// Load from localStorage
function loadNotes() {
  const stored = localStorage.getItem("notes");
  if (stored) {
    try {
      notes = JSON.parse(stored);
    } catch {
      notes = [];
    }
  }
}

// Save to localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
// ===== Helper: readable date =====
function formatDate(date) {
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}





// ===== Render =====
function render(filterText = "") {
  // Clear the list safely
  notesList.textContent = "";

  // Filter notes (case-insensitive)
  const filtered = notes.filter((note) =>
    note.text.toLowerCase().includes(filterText.toLowerCase())
  );

  // Rebuild list with createElement + textContent only
  filtered.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add(`category-${note.category}`);


    // Main content container
    const content = document.createElement("div");

 // Note text
    const textEl = document.createElement("p");
    textEl.textContent = note.text;
    textEl.style.margin = "0 0 0.35rem";
// Category label (small)
    const categoryLabel = document.createElement("span");
    categoryLabel.textContent = note.category;
    categoryLabel.style.cssText = `
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      background: #edf2f7;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      margin-right: 0.5rem;
    `;
    // Date
    const dateEl = document.createElement("small");
    dateEl.textContent = note.createdAt;
    dateEl.style.color = "#718096";


// Assemble text area
    content.appendChild(textEl);
    content.appendChild(categoryLabel);
    content.appendChild(dateEl);


    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";
    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });

   

    li.appendChild(content);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });

  // Update count message
  updateCount(filtered.length);
}

// Correct count message for 0 / 1 / many
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "No notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "1 note";
  } else {
    noteCount.textContent = `${count} notes`;
  }
}

// ===== Add note =====
function addNote(text, category) {
  const now = new Date();

  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: formatDate(now)          // readable date & time
  };

  notes.unshift(newNote); // newest first
  saveNotes();
  render(searchInput.value);
}

// ===== Delete note =====
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render(searchInput.value);
}

// ===== Validation =====
function validate(text) {
  if (text.trim() === "") {
    errorMessage.textContent = "Note cannot be empty.";
    return false;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Note cannot be longer than 200 characters.";
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

// ===== Event listeners =====
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = noteInput.value;
  const category = noteCategory.value;

  if (!validate(text)) return;

  addNote(text.trim(), category);
  noteInput.value = "";
  noteInput.focus();
});

searchInput.addEventListener("input", () => {
  render(searchInput.value);
});

// ===== Initialise =====
loadNotes();
render();