const startBtn = document.getElementById("startBtn");
const senderNameInput = document.getElementById("senderName");
const recipientNameInput = document.getElementById("recipientName");
const occasionSelect = document.getElementById("occasionSelect");
const greetingSection = document.getElementById("greetingSection");
const greetingTitle = document.getElementById("greetingTitle");
const greetingMessage = document.getElementById("greetingMessage");
const downloadPngBtn = document.getElementById("downloadPngBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

startBtn.addEventListener("click", () => {
  const senderName = senderNameInput.value.trim();
  const recipientName = recipientNameInput.value.trim();
  const occasion = occasionSelect.value;

  if (!senderName) {
    alert("Please enter your name!");
    return;
  }
  if (!recipientName) {
    alert("Please enter the recipient's name!");
    return;
  }
  if (!occasion) {
    alert("Please select an occasion!");
    return;
  }

  // Save to localStorage
  localStorage.setItem("senderName", senderName);
  localStorage.setItem("recipientName", recipientName);
  localStorage.setItem("occasion", occasion);

  showGreeting(senderName, recipientName, occasion);
});

function showGreeting(senderName, recipientName, occasion) {
  greetingTitle.textContent = occasion + " Greeting";
  greetingMessage.textContent =
    "Dear " + recipientName + ",\n\n" +
    "Wishing you a wonderful " + occasion + "! 🎉✨\n\n" +
    "With love, " + senderName;
  greetingSection.classList.remove("hidden");
  confettiBurst();
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

// ✅ Download as PNG
downloadPngBtn.addEventListener("click", function() {
  if (this.disabled) {
    alert("Please submit the feedback form first to unlock the greeting.");
  } else {
    html2canvas(document.querySelector("#greetingSection")).then(canvas => {
      const link = document.createElement("a");
      link.download = "greeting.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  }
});

// ✅ Download as PDF
downloadPdfBtn.addEventListener("click", function() {
  if (this.disabled) {
    alert("Please submit the feedback form first to unlock the greeting.");
  } else {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);