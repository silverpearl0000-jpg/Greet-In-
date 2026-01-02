// Guard: ensure DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const startBtn = document.getElementById("startBtn");
  const senderNameInput = document.getElementById("senderName");
  const recipientNameInput = document.getElementById("recipientName");
  const occasionSelect = document.getElementById("occasionSelect");
  const greetingSection = document.getElementById("greetingSection");
  const greetingTitle = document.getElementById("greetingTitle");
  const greetingMessage = document.getElementById("greetingMessage");
  const downloadPngBtn = document.getElementById("downloadPngBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const greetingCard = document.getElementById("greetingCard");

  // Hard guards: if critical elements are missing, stop
  if (
    !startBtn || !senderNameInput || !recipientNameInput ||
    !occasionSelect || !greetingSection || !greetingTitle ||
    !greetingMessage || !downloadPngBtn || !downloadPdfBtn || !greetingCard
  ) {
    console.error("Critical elements missing. Check IDs in index.html.");
    return;
  }

  // Create Greeting Button Logic
  startBtn.addEventListener("click", () => {
    const senderName = senderNameInput.value.trim();
    const recipientName = recipientNameInput.value.trim();
    const occasion = occasionSelect.value;

    if (!senderName || !recipientName || !occasion) {
      alert("Please fill in all fields.");
      return;
    }

    // Save values
    localStorage.setItem("senderName", senderName);
    localStorage.setItem("recipientName", recipientName);
    localStorage.setItem("occasion", occasion);

    showGreeting(senderName, recipientName, occasion);
  });

  // Show Greeting
  function showGreeting(senderName, recipientName, occasion) {
    greetingTitle.textContent = `${occasion} Greeting`;
    greetingMessage.textContent =
      `Dear ${recipientName},\n\nWishing you a wonderful ${occasion}! 🎉✨\n\nWith love,\n${senderName}`;
    greetingSection.classList.remove("hidden");
    confettiBurst();
  }

  // Confetti Effect
  function confettiBurst() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Unlock logic: check URL for ?unlocked=true
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

  // Download as PNG (only greetingCard div)
  downloadPngBtn.addEventListener("click", () => {
    if (downloadPngBtn.disabled) {
      alert("Please submit feedback to unlock downloads.");
      return;
    }
    if (typeof html2canvas !== "function") {
      alert("html2canvas library not loaded.");
      return;
    }
    html2canvas(greetingCard).then((canvas) => {
      const link = document.createElement("a");
      link.download = "greeting.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch((err) => {
      console.error("PNG capture failed:", err);
      alert("Failed to capture PNG. Check console for details.");
    });
  });

  // Download as PDF (only greeting text)
  downloadPdfBtn.addEventListener("click", () => {
    if (downloadPdfBtn.disabled) {
      alert("Please submit feedback to unlock downloads.");
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("jsPDF library not loaded.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(greetingTitle.textContent || "", 20, 30);
    doc.setFontSize(14);
    // Split long text into lines for PDF
    const lines = doc.splitTextToSize(greetingMessage.textContent || "", 170);
    doc.text(lines, 20, 50);
    doc.save("greeting.pdf");
  });
});