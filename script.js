// ===== Element selection =====
const noteForm     = document.querySelector("#note-form");
const noteInput    = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput  = document.querySelector("#search-input");
const notesList    = document.querySelector("#notes-list");
const noteCount    = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// ===== Data =====
let notes = [];

// Load notes from localStorage when the page opens
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

// Save notes to localStorage whenever they change
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
  notesList.textContent = ""; // clear safely

  // Case-insensitive search
  const filtered = notes.filter((note) =>
    note.text.toLowerCase().includes(filterText.toLowerCase())
  );

  // If searching and nothing matches → show message
  if (filterText.trim() !== "" && filtered.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = "No notes match your search.";
    emptyMsg.style.cssText = `
      background: transparent;
      border: none;
      box-shadow: none;
      color: #718096;
      font-style: italic;
      padding: 1rem 0;
    `;
    notesList.appendChild(emptyMsg);
    updateCount(0);
    return;
  }

  // Build note cards
  filtered.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add(`category-${note.category}`);

    // Content container
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

    content.appendChild(textEl);
    content.appendChild(categoryLabel);
    content.appendChild(dateEl);

    // Delete button – removes only this note
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });

    li.appendChild(content);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });

  updateCount(filtered.length);
}

// ===== Count message =====
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// ===== Add note =====
function addNote(text, category) {
  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: formatDate(new Date())
  };

  notes.unshift(newNote); // newest first
  saveNotes();            // save whenever notes change
  render(searchInput.value);
}

// ===== Delete note =====
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();            // save whenever notes change
  render(searchInput.value);
}

// ===== Validation =====
function validate(text) {
  if (text.trim() === "") {
    errorMessage.textContent = "Please type a note first.";
    return false;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return false;
  }
  // Clear error when valid
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

  // Clear the input after a successful add
  noteInput.value = "";
  noteInput.focus();
});

// Live search as the user types
searchInput.addEventListener("input", () => {
  render(searchInput.value);
});

// ===== Initialise =====
loadNotes();   // load when the page opens
render();
