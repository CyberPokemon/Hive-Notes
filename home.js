document.addEventListener("DOMContentLoaded", async () => {
  /****************************************************
   * API CONFIGURATION
   ****************************************************/
  const API_URL = "http://localhost:8080/api/notes/all"; // Replace with actual API endpoint
  const CREATE_NOTE_URL = "http://localhost:8080/api/notes/createnote"; // Endpoint to create new note
  let foldersData = [];
  let foldersMap = new Map();
  let currentFolderName = null;

  /****************************************************
   * DOM ELEMENTS
   ****************************************************/
  const foldersList = document.getElementById("foldersList");
  const folderTitle = document.getElementById("folderTitle");
  const notesList = document.getElementById("notesList");
  const emptyMessage = document.getElementById("emptyMessage");
  const newNoteBtn = document.getElementById("newNoteBtn");
  const newNoteModal = document.getElementById("newNoteModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const newNoteForm = document.getElementById("newNoteForm");
  const noteFolderSelect = document.getElementById("noteFolder");
  const newFolderField = document.getElementById("newFolderField");
  const newFolderName = document.getElementById("newFolderName");

  /****************************************************
   * FETCH DATA FROM API
   ****************************************************/
  async function fetchFoldersData() {
    try {
      const token = localStorage.getItem("jwtToken"); // Fetch JWT token from localStorage

      if (!token) {
        throw new Error("No JWT token found in localStorage.");
      }

      console.log("JWT Token:", token); // Log the token for debugging purposes

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read error message if available
        throw new Error(`Failed to fetch data: ${response.statusText}, ${errorText}`);
      }

      foldersData = await response.json();
      processFoldersData();
    } catch (error) {
      console.error("Error fetching folders data:", error);
      foldersList.innerHTML = "<p>Error loading notes. Please try again.</p>";
    }
  }

  /****************************************************
   * PROCESS AND STRUCTURE DATA
   ****************************************************/
  function processFoldersData() {
    foldersMap.clear(); // Clear previous data

    foldersData.forEach((note) => {
      if (!foldersMap.has(note.noteFolder)) {
        foldersMap.set(note.noteFolder, []);
      }
      foldersMap.get(note.noteFolder).push(note);
    });

    populateFoldersList();
    populateFolderSelect();
  }

  /****************************************************
   * POPULATE FOLDERS SIDEBAR
   ****************************************************/
  function populateFoldersList() {
    foldersList.innerHTML = "";

    foldersMap.forEach((notes, folderName) => {
      const li = document.createElement("li");
      li.textContent = folderName;
      li.addEventListener("click", () => {
        currentFolderName = folderName;
        showFolderNotes(folderName);
      });
      foldersList.appendChild(li);
    });

    // Select the first folder by default
    if (foldersMap.size > 0) {
      const firstFolder = [...foldersMap.keys()][0];
      currentFolderName = firstFolder;
      showFolderNotes(firstFolder);
    } else {
      folderTitle.textContent = "My Notes";
    }
  }

  /****************************************************
   * POPULATE FOLDER SELECT OPTIONS
   ****************************************************/
  function populateFolderSelect() {
    noteFolderSelect.innerHTML = ""; // Clear existing options

    // Create "New Folder..." option
    const newFolderOption = document.createElement("option");
    newFolderOption.value = "new";
    newFolderOption.textContent = "New Folder...";
    noteFolderSelect.appendChild(newFolderOption);

    // Add existing folders to the select options
    foldersMap.forEach((notes, folderName) => {
      const option = document.createElement("option");
      option.value = folderName;
      option.textContent = folderName;
      noteFolderSelect.appendChild(option);
    });
  }

  /****************************************************
   * SHOW NOTES FOR SELECTED FOLDER
   ****************************************************/
  function showFolderNotes(folderName) {
    const notes = foldersMap.get(folderName);
    folderTitle.textContent = `Notes in "${folderName}"`;
    notesList.innerHTML = "";

    if (!notes || notes.length === 0) {
      emptyMessage.style.display = "block";
    } else {
      emptyMessage.style.display = "none";
      notes.forEach((note, noteIndex) => {
        const noteItem = document.createElement("div");
        noteItem.style.border = "1px solid #ddd";
        noteItem.style.padding = "0.5rem";
        noteItem.style.borderRadius = "4px";
        noteItem.style.cursor = "pointer";
        noteItem.innerHTML = `
          <h3>${note.noteName}</h3>
          <p><strong>Keywords:</strong> ${note.noteKeywords}</p>
        `;
        noteItem.addEventListener("click", () => {
          openEditor(folderName, noteIndex);
        });
        notesList.appendChild(noteItem);
      });
    }
  }

  /****************************************************
   * OPEN EDITOR PAGE
   ****************************************************/
  function openEditor(folderName, noteIndex) {
    localStorage.setItem("foldersData", JSON.stringify(foldersData));
    localStorage.setItem("currentFolderName", folderName);
    localStorage.setItem("currentNoteIndex", noteIndex);
    window.location.href = "editor.html";
  }

  /****************************************************
   * HANDLE CREATE NOTE FORM SUBMISSION
   ****************************************************/
  async function handleCreateNote(event) {
    event.preventDefault();

    const noteTitle = document.getElementById("noteTitle").value;
    const noteKeywords = document.getElementById("noteKeywords").value;
    let noteFolder = noteFolderSelect.value;

    // If 'New Folder...' is selected, use the new folder name
    if (noteFolder === "new") {
      noteFolder = newFolderName.value;
    }

    if (!noteTitle || !noteFolder || !noteKeywords) {
      alert("Please fill in all fields.");
      return;
    }

    // Send the new note data to the API
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(CREATE_NOTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteName: noteTitle,
          noteFolder: noteFolder,
          noteKeywords: noteKeywords,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create note: ${response.statusText}, ${errorText}`);
      }

      // If note is successfully created, fetch the updated list of notes
      fetchFoldersData();
      closeNewNoteModal();
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }

  /****************************************************
   * OPEN AND CLOSE NEW NOTE MODAL
   ****************************************************/
  function openNewNoteModal() {
    newNoteModal.style.display = "block";
  }

  function closeNewNoteModal() {
    newNoteModal.style.display = "none";
  }

  /****************************************************
   * EVENT LISTENERS
   ****************************************************/
  newNoteBtn.addEventListener("click", openNewNoteModal);
  closeModalBtn.addEventListener("click", closeNewNoteModal);
  newNoteForm.addEventListener("submit", handleCreateNote);

  /****************************************************
   * ON PAGE LOAD - FETCH DATA FROM API
   ****************************************************/
  await fetchFoldersData();
});
