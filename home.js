document.addEventListener("DOMContentLoaded", () => {
  /****************************************************
   * DATA STRUCTURE (Fetch data from API)
   ****************************************************/
  let foldersData = [];

  // Fetch data from API
  async function fetchFoldersData() {
    const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from storage
    if (!token) {
      console.error("No JWT token found.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/notes/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token in the Authorization header
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      foldersData = await response.json();
      populateFoldersList();  // Populate the folders list after data is fetched

      // Automatically select the first folder if data is available
      if (foldersData.length > 0) {
        currentFolderIndex = 0;
        showFolderNotes(0);  // Display the first folder by default
      } else {
        folderTitle.textContent = "My Notes";
      }
    } catch (error) {
      console.error("Error fetching folders data:", error);
    }
  }

  /****************************************************
   * DOM ELEMENTS
   ****************************************************/
  const foldersList = document.getElementById("foldersList");
  const folderTitle = document.getElementById("folderTitle");
  const notesList = document.getElementById("notesList");
  const emptyMessage = document.getElementById("emptyMessage");
  const searchBar = document.getElementById("searchBar");

  // Modal (New Note)
  const newNoteModal = document.getElementById("newNoteModal");
  const newNoteBtn = document.getElementById("newNoteBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const newNoteForm = document.getElementById("newNoteForm");
  const noteTitleInput = document.getElementById("noteTitle");
  const noteFolderSelect = document.getElementById("noteFolder");
  const newFolderField = document.getElementById("newFolderField");
  const newFolderNameInput = document.getElementById("newFolderName");
  const noteKeywordsInput = document.getElementById("noteKeywords");

  /****************************************************
   * INITIALIZE FOLDERS IN SIDEBAR
   ****************************************************/
  function populateFoldersList() {
    foldersList.innerHTML = "";
    foldersData.forEach((folder, index) => {
      const li = document.createElement("li");
      li.textContent = folder.name;
      li.addEventListener("click", () => {
        currentFolderIndex = index;
        showFolderNotes(index);
      });
      foldersList.appendChild(li);
    });
  }

  /****************************************************
   * SHOW NOTES FOR SELECTED FOLDER
   ****************************************************/
  function showFolderNotes(folderIndex) {
    const folder = foldersData[folderIndex];
    folderTitle.textContent = `Notes in "${folder.name}"`;
    notesList.innerHTML = "";

    if (folder.notes.length === 0) {
      emptyMessage.style.display = "block";
    } else {
      emptyMessage.style.display = "none";
      folder.notes.forEach((note, noteIndex) => {
        const noteItem = document.createElement("div");
        noteItem.style.border = "1px solid #ddd";
        noteItem.style.padding = "0.5rem";
        noteItem.style.borderRadius = "4px";
        noteItem.style.cursor = "pointer";
        noteItem.innerHTML = `
          <h3>${note.title}</h3>
          <p><strong>Keywords:</strong> ${note.keywords}</p>
        `;
        // Clicking the note => open editor page
        noteItem.addEventListener("click", () => {
          openEditor(folderIndex, noteIndex);
        });
        notesList.appendChild(noteItem);
      });
    }
  }

  /****************************************************
   * OPEN EDITOR PAGE
   ****************************************************/
  function openEditor(folderIndex, noteIndex) {
    // 1) Save the entire data structure to localStorage
    localStorage.setItem("foldersData", JSON.stringify(foldersData));
    // 2) Save which note we’re opening
    localStorage.setItem("currentFolderIndex", folderIndex);
    localStorage.setItem("currentNoteIndex", noteIndex);
    // 3) Redirect to editor.html
    window.location.href = "editor.html";
  }

  /****************************************************
   * MODAL CONTROLS (NEW NOTE)
   ****************************************************/
  newNoteBtn.addEventListener("click", () => {
    updateFolderDropdown();
    newNoteModal.style.display = "block";
  });
  closeModalBtn.addEventListener("click", () => {
    newNoteModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === newNoteModal) {
      newNoteModal.style.display = "none";
    }
  });

  // Populate the folder dropdown in the New Note modal
  function updateFolderDropdown() {
    noteFolderSelect.innerHTML = "";
    foldersData.forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder.name;
      option.textContent = folder.name;
      noteFolderSelect.appendChild(option);
    });

    // 'Create New Folder...' option
    const newFolderOption = document.createElement("option");
    newFolderOption.value = "new_folder";
    newFolderOption.textContent = "Create New Folder...";
    noteFolderSelect.appendChild(newFolderOption);

    noteFolderSelect.selectedIndex = 0;
    newFolderField.style.display = "none";
    newFolderNameInput.value = "";
  }

  // Show/hide new folder name field
  noteFolderSelect.addEventListener("change", (e) => {
    if (e.target.value === "new_folder") {
      newFolderField.style.display = "block";
    } else {
      newFolderField.style.display = "none";
      newFolderNameInput.value = "";
    }
  });

  // Handle new note creation
  newNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const noteName = noteTitleInput.value.trim();
    let folderName = noteFolderSelect.value;
    const typedFolderName = newFolderNameInput.value.trim();
    const noteKeywords = noteKeywordsInput.value.trim();

    // If user selected 'new_folder'
    if (folderName === "new_folder" && typedFolderName) {
      folderName = typedFolderName;
      foldersData.push({
        name: folderName,
        notes: [],
      });
      populateFoldersList();
    }

    // Find or create the target folder
    let targetFolderIndex = foldersData.findIndex((f) => f.name === folderName);
    if (targetFolderIndex === -1) {
      foldersData.push({ name: folderName, notes: [] });
      targetFolderIndex = foldersData.length - 1;
    }

    // Create a new note object
    const newNote = {
      title: noteName,
      keywords: noteKeywords,
      content: "<p>Start writing your content here...</p>",
    };
    foldersData[targetFolderIndex].notes.push(newNote);

    // Clear form & hide modal
    newNoteForm.reset();
    newFolderField.style.display = "none";
    newNoteModal.style.display = "none";

    // If currently viewing that folder, refresh
    if (currentFolderIndex === targetFolderIndex) {
      showFolderNotes(targetFolderIndex);
    }
  });

  /****************************************************
   * SEARCHING NOTES
   ****************************************************/
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (currentFolderIndex == null) return;

    const folder = foldersData[currentFolderIndex];
    const filteredNotes = folder.notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.keywords.toLowerCase().includes(query)
      );
    });

    notesList.innerHTML = "";
    if (filteredNotes.length === 0) {
      emptyMessage.style.display = "block";
    } else {
      emptyMessage.style.display = "none";
      filteredNotes.forEach((note, noteIndex) => {
        const noteItem = document.createElement("div");
        noteItem.style.border = "1px solid #ddd";
        noteItem.style.padding = "0.5rem";
        noteItem.style.borderRadius = "4px";
        noteItem.style.cursor = "pointer";
        noteItem.innerHTML = `
          <h3>${note.title}</h3>
          <p><strong>Keywords:</strong> ${note.keywords}</p>
        `;
        noteItem.addEventListener("click", () => {
          openEditor(currentFolderIndex, noteIndex);
        });
        notesList.appendChild(noteItem);
      });
    }
  });

  /****************************************************
   * ON PAGE LOAD
   ****************************************************/
  fetchFoldersData();  // Fetch data from API
});
