// JavaScript for sign-up page

document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
      signupForm.addEventListener("submit", function(e) {
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        
        if (password !== confirmPassword) {
          e.preventDefault();
          alert("Passwords do not match. Please try again.");
        }
      });
    }
  });
  