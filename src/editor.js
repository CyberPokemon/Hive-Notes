document.addEventListener("DOMContentLoaded", () => {
    // Retrieve note data from localStorage
    let foldersData = JSON.parse(localStorage.getItem("foldersData")) || [];
    let currentFolderIndex = parseInt(localStorage.getItem("currentFolderIndex"));
    let currentNoteIndex = parseInt(localStorage.getItem("currentNoteIndex"));
  
    // If data is missing, go back to home
    if (!foldersData.length || isNaN(currentFolderIndex) || isNaN(currentNoteIndex)) {
      window.location.href = "home.html";
    }
  
    // DOM elements
    const editorContent = document.getElementById("editorContent");
    const saveEditorBtn = document.getElementById("saveEditorBtn");
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    const imageUploadBtn = document.getElementById("imageUploadBtn");
    const imageUploadInput = document.getElementById("imageUploadInput");
  
    // Load current note content into editor
    let currentNote = foldersData[currentFolderIndex].notes[currentNoteIndex];
    editorContent.innerHTML = currentNote.content;
  
    // Handle toolbar formatting buttons
    document.querySelectorAll(".toolbar-btn[data-command]").forEach((button) => {
      button.addEventListener("click", () => {
        const command = button.getAttribute("data-command");
        document.execCommand(command, false, null);
      });
    });
  
    // Image upload
    imageUploadBtn.addEventListener("click", () => {
      imageUploadInput.click();
    });
    imageUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Insert the image as a base64 string
          document.execCommand("insertImage", false, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Save button
    saveEditorBtn.addEventListener("click", () => {
      // Update note content in local data
      currentNote.content = editorContent.innerHTML;
      foldersData[currentFolderIndex].notes[currentNoteIndex] = currentNote;
      // Save updated data to localStorage
      localStorage.setItem("foldersData", JSON.stringify(foldersData));
      alert("Note saved!");
    });
  
    // Back to Home
    backToHomeBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  });
  