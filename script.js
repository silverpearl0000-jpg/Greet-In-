// Occasion selection and greeting display
const startBtn = document.getElementById("startBtn");
const occasionSelect = document.getElementById("occasionSelect");
const userNameInput = document.getElementById("userName");
const greetingSection = document.getElementById("greetingSection");
const greetingTitle = document.getElementById("greetingTitle");
const greetingMessage = document.getElementById("greetingMessage");

startBtn.addEventListener("click", () => {
  const occasion = occasionSelect.value;
  const userName = userNameInput.value.trim();

  if (!userName) {
    alert("Please enter your name!");
    return;
  }
  if (!occasion) {
    alert("Please select an occasion!");
    return;
  }

  greetingTitle.textContent = occasion + " Greeting";
  greetingMessage.textContent = "Dear " + userName + ", wishing you a wonderful " + occasion + "! 🎉✨";
  greetingSection.classList.remove("hidden");

  confettiBurst();
});

// Download button logic
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", function() {
  if (this.disabled) {
    alert("Please submit the feedback form first to unlock the greeting.");
  } else {
    window.location.href = "https://yourapp.github.io/greeting.html";
  }
});

// Unlock logic: check URL for ?unlocked=true
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlocked") === "true") {
    downloadBtn.disabled = false;
  }
});

// Confetti animation
function confettiBurst() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}