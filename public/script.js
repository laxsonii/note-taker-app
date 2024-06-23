document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList');
    const noteForm = document.getElementById('noteForm');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');

    // Function to fetch and display notes
    async function fetchNotes() {
        try {
            const response = await fetch('/api/notes');
            const notes = await response.json();
            notesList.innerHTML = '';
            notes.forEach(note => displayNote(note));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    // Function to display a single note in the list
    function displayNote(note) {
        const li = document.createElement('li');
        li.textContent = `${note.title}: ${note.text}`;
        li.classList.add('note-item');
        li.setAttribute('data-note-id', note.id);

        // Delete button for each note
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });

        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    }

    // Function to delete a note
    async function deleteNote(noteId) {
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove the note from the UI
                const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
                noteElement.remove();
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    // Event listener for submitting a new note
    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('titleInput').value;
        const text = document.getElementById('textInput').value;

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, text })
            });

            const newNote = await response.json();
            displayNote(newNote);
            noteForm.reset();
            saveNoteBtn.style.display = 'none';
            clearFormBtn.style.display = 'none';
        } catch (error) {
            console.error('Error saving note:', error);
        }
    });

    // Event listener for clearing the form
    clearFormBtn.addEventListener('click', () => {
        noteForm.reset();
        saveNoteBtn.style.display = 'none';
        clearFormBtn.style.display = 'none';
    });

    // Initial fetch of notes
    fetchNotes();
});
