const startBtn = document.getElementById("startBtn");
const senderNameInput = document.getElementById("senderName");
const recipientNameInput = document.getElementById("recipientName");
const occasionSelect = document.getElementById("occasionSelect");
const greetingSection = document.getElementById("greetingSection");
const greetingTitle = document.getElementById("greetingTitle");
const greetingMessage = document.getElementById("greetingMessage");
const downloadPngBtn = document.getElementById("downloadPngBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// Create Greeting Button Logic
startBtn.addEventListener("click", () => {
  const senderName = senderNameInput.value.trim();
  const recipientName = recipientNameInput.value.trim();
  const occasion = occasionSelect.value;

  if (!senderName || !recipientName || !occasion) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("senderName", senderName);
  localStorage.setItem("recipientName", recipientName);
  localStorage.setItem("occasion", occasion);

  showGreeting(senderName, recipientName, occasion);
});

function showGreeting(senderName, recipientName, occasion) {
  greetingTitle.textContent = `${occasion} Greeting`;
  greetingMessage.textContent =
    `Dear ${recipientName},\n\nWishing you a wonderful ${occasion}! 🎉✨\n\nWith love,\n${senderName}`;
  greetingSection.classList.remove("hidden");
  confettiBurst();
}

function confettiBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Unlock logic: check URL for ?unlocked=true
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlocked") === "true") {
    const senderName = localStorage.getItem("senderName");
    const recipientName = localStorage.getItem("recipientName");
    const occasion = localStorage.getItem("occasion");
    if (senderName && recipientName && occasion) {
      showGreeting(senderName, recipientName, occasion);
      downloadPngBtn.disabled = false;
      downloadPdfBtn.disabled = false;
    }
  }
});

// Download as PNG
downloadPngBtn.addEventListener("click", () => {
  if (downloadPngBtn.disabled) {
    alert("Please submit feedback to unlock downloads.");
    return;
  }
  html2canvas(greetingSection).then(canvas => {
    const link = document.createElement("a");
    link.download = "greeting.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Download as PDF
downloadPdfBtn.addEventListener("click", () => {
  if (downloadPdfBtn.disabled) {
    alert("Please submit feedback to unlock downloads.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(greetingTitle.textContent, 20, 30);
  doc.setFontSize(14);
  doc.text(greetingMessage.textContent, 20, 50);
  doc.save("greeting.pdf");
});