// Occasion selection and greeting display
const startBtn = document.getElementById("startBtn");
const occasionSelect = document.getElementById("occasionSelect");
const greetingSection = document.getElementById("greetingSection");
const greetingTitle = document.getElementById("greetingTitle");
const greetingMessage = document.getElementById("greetingMessage");

startBtn.addEventListener("click", () => {
  const occasion = occasionSelect.value;
  if (!occasion) {
    alert("Please select an occasion first!");
    return;
  }

  greetingTitle.textContent = occasion + " Greeting";
  greetingMessage.textContent = "Wishing you a wonderful " + occasion + "! 🎉✨";
  greetingSection.classList.remove("hidden");

  // celebratory animation
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

// Simple celebratory confetti animation
function confettiBurst() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}