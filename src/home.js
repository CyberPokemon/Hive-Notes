// A simple script for handling folder clicks, new note creation, and modal toggling

document.addEventListener("DOMContentLoaded", () => {
    // Data structure for folders & notes
    // Each folder has a name and an array of notes
    let foldersData = [
      {
        name: "Folder 1",
        notes: [
          { title: "Note 1 in Folder 1", keywords: "#important", content: "Some content..." },
        ],
      },
      {
        name: "Folder 2",
        notes: [
          { title: "Work Plan", keywords: "#work #priority", content: "Complete tasks..." },
        ],
      },
      {
        name: "Folder 3",
        notes: [],
      },
      {
        name: "Folder 4",
        notes: [],
      },
    ];
  
    let currentFolderIndex = null; // Track which folder is currently selected
  
    // DOM elements
    const foldersList = document.getElementById("foldersList");
    const folderTitle = document.getElementById("folderTitle");
    const notesList = document.getElementById("notesList");
    const emptyMessage = document.getElementById("emptyMessage");
    const searchBar = document.getElementById("searchBar");
  
    // Modal elements
    const newNoteModal = document.getElementById("newNoteModal");
    const newNoteBtn = document.getElementById("newNoteBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const newNoteForm = document.getElementById("newNoteForm");
    const noteTitleInput = document.getElementById("noteTitle");
    const noteFolderSelect = document.getElementById("noteFolder");
    const newFolderField = document.getElementById("newFolderField");
    const newFolderNameInput = document.getElementById("newFolderName");
    const noteKeywordsInput = document.getElementById("noteKeywords");
  
    /********************************************************
     * Initialize folders list in the sidebar
     ********************************************************/
    function populateFoldersList() {
      // Clear existing items
      foldersList.innerHTML = "";
  
      // Rebuild the sidebar folder items from foldersData
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
  
    /********************************************************
     * Show notes for a selected folder
     ********************************************************/
    function showFolderNotes(folderIndex) {
      const folder = foldersData[folderIndex];
      // Update heading
      folderTitle.textContent = `Notes in "${folder.name}"`;
      // Clear notesList
      notesList.innerHTML = "";
  
      if (folder.notes.length === 0) {
        // Show empty message
        emptyMessage.style.display = "block";
      } else {
        // Hide empty message
        emptyMessage.style.display = "none";
  
        // Display each note
        folder.notes.forEach((note) => {
          const noteItem = document.createElement("div");
          noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p><strong>Keywords:</strong> ${note.keywords}</p>
            <p>${note.content}</p>
          `;
          noteItem.style.border = "1px solid #ddd";
          noteItem.style.padding = "0.5rem";
          noteItem.style.borderRadius = "4px";
  
          notesList.appendChild(noteItem);
        });
      }
    }
  
    /********************************************************
     * Modal Controls
     ********************************************************/
    // Show modal
    newNoteBtn.addEventListener("click", () => {
      // Populate the folder dropdown
      updateFolderDropdown();
      // Show the modal
      newNoteModal.style.display = "block";
    });
  
    // Close modal when '×' is clicked
    closeModalBtn.addEventListener("click", () => {
      newNoteModal.style.display = "none";
    });
  
    // Close modal if user clicks outside of modal-content
    window.addEventListener("click", (event) => {
      if (event.target === newNoteModal) {
        newNoteModal.style.display = "none";
      }
    });
  
    // Update folder dropdown with existing folders + 'New Folder...' option
    function updateFolderDropdown() {
      noteFolderSelect.innerHTML = "";
  
      foldersData.forEach((folder) => {
        const option = document.createElement("option");
        option.value = folder.name;
        option.textContent = folder.name;
        noteFolderSelect.appendChild(option);
      });
  
      // Add 'New Folder...' option at the end
      const newFolderOption = document.createElement("option");
      newFolderOption.value = "new_folder";
      newFolderOption.textContent = "Create New Folder...";
      noteFolderSelect.appendChild(newFolderOption);
  
      // Default selection
      noteFolderSelect.selectedIndex = 0;
      newFolderField.style.display = "none";
      newFolderNameInput.value = "";
    }
  
    // If user selects 'New Folder...', show the new folder input field
    noteFolderSelect.addEventListener("change", (e) => {
      if (e.target.value === "new_folder") {
        newFolderField.style.display = "block";
      } else {
        newFolderField.style.display = "none";
        newFolderNameInput.value = "";
      }
    });
  
    /********************************************************
     * Handle New Note Form Submission
     ********************************************************/
    newNoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Gather form data
      const noteName = noteTitleInput.value.trim();
      let folderName = noteFolderSelect.value;
      const newFolderName = newFolderNameInput.value.trim();
      const noteKeywords = noteKeywordsInput.value.trim();
  
      // If user selected 'new_folder', create a new folder
      if (folderName === "new_folder" && newFolderName) {
        folderName = newFolderName; // use typed folder name
        // Add new folder to foldersData
        foldersData.push({
          name: folderName,
          notes: [],
        });
        // Re-populate the sidebar
        populateFoldersList();
      }
  
      // Find the folder object in foldersData
      let targetFolderIndex = foldersData.findIndex((f) => f.name === folderName);
      if (targetFolderIndex === -1) {
        // If folder doesn't exist for some reason, push a new one
        foldersData.push({
          name: folderName,
          notes: [],
        });
        targetFolderIndex = foldersData.length - 1;
      }
  
      // Create a new note object
      const newNote = {
        title: noteName,
        keywords: noteKeywords,
        content: "Write your content here...", // or add a content field to the form
      };
  
      // Push it into that folder's notes array
      foldersData[targetFolderIndex].notes.push(newNote);
  
      // Clear form
      newNoteForm.reset();
      newFolderField.style.display = "none";
  
      // Hide modal
      newNoteModal.style.display = "none";
  
      // If the user just created a note in the currently open folder, refresh the display
      if (currentFolderIndex === targetFolderIndex) {
        showFolderNotes(targetFolderIndex);
      }
    });
  
    /********************************************************
     * Searching notes (basic example)
     ********************************************************/
    searchBar.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      // If no folder is selected yet, do nothing
      if (currentFolderIndex == null) return;
  
      const folder = foldersData[currentFolderIndex];
      const filteredNotes = folder.notes.filter((note) => {
        // Check note title, content, or keywords
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.keywords.toLowerCase().includes(query)
        );
      });
  
      // Update the display
      notesList.innerHTML = "";
      if (filteredNotes.length === 0) {
        emptyMessage.style.display = "block";
      } else {
        emptyMessage.style.display = "none";
        filteredNotes.forEach((note) => {
          const noteItem = document.createElement("div");
          noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p><strong>Keywords:</strong> ${note.keywords}</p>
            <p>${note.content}</p>
          `;
          noteItem.style.border = "1px solid #ddd";
          noteItem.style.padding = "0.5rem";
          noteItem.style.borderRadius = "4px";
          notesList.appendChild(noteItem);
        });
      }
    });
  
    // On page load, populate sidebar and default to no folder selected
    populateFoldersList();
    folderTitle.textContent = "My Notes"; // or show instructions
  });
  