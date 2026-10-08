const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const status = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
}

function showStatus(message, type = "") {
    status.textContent = message;
    status.className = type;
}

function displayNote(note) {
    const li = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(deleteBtn);

    return li;
}

async function loadNotes() {
    loadBtn.disabled = true;
    showStatus("Loading notes...", "");

    try {
        const response = await request(`${API_URL}?_limit=10`);
        const notes = await response.json();

        notesList.innerHTML = "";

        if (notes.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "No notes found.";
            notesList.appendChild(emptyMessage);
            showStatus("No notes found.", "success");
            return;
        }

        notes.forEach(note => {
            notesList.appendChild(displayNote(note));
        });

        showStatus(`Loaded ${notes.length} notes from the server.`, "success");
    } catch (error) {
        showStatus("Sorry, we couldn't load the notes. Please try again.", "error");
    } finally {
        loadBtn.disabled = false;
    }
}

async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Title is required.", "error");
        return;
    }

    if (title.length > 100) {
        showStatus("Title must be 100 characters or fewer.", "error");
        return;
    }

    submitBtn.disabled = true;
    showStatus("Creating note...", "");

    try {
        const response = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        const note = await response.json();

        notesList.prepend(displayNote(note));

        showStatus(
            `Note created (status ${response.status}, id ${note.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        showStatus("Sorry, we couldn't create the note.", "error");
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteNote(id, noteElement) {
    const deleteBtn = noteElement.querySelector("button");
    deleteBtn.disabled = true;

    showStatus("Deleting note...", "");

    try {
        const response = await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        // JSONPlaceholder simulates DELETE requests but does not permanently
        // store or remove data. We remove the note from our page to reflect
        // the successful simulated request.

        noteElement.remove();

        showStatus(
            `Note deleted (status ${response.status}).`,
            "success"
        );
    } catch (error) {
        deleteBtn.disabled = false;
        showStatus("Sorry, we couldn't delete the note.", "error");
    } finally {
        // The note is removed after a successful simulated DELETE.
    }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
