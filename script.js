document.addEventListener("DOMContentLoaded", () => {
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

  // Show extra inputs for Custom or New Year
  occasionSelect.addEventListener("change", () => {
    const customBox = document.getElementById("customOccasionInput");
    const newYearBox = document.getElementById("newYearInput");

    if (occasionSelect.value === "Custom") {
      customBox.classList.remove("hidden");
      newYearBox.classList.add("hidden");
    } else if (occasionSelect.value === "NewYear") {
      newYearBox.classList.remove("hidden");
      customBox.classList.add("hidden");
    } else {
      customBox.classList.add("hidden");
      newYearBox.classList.add("hidden");
    }
  });

  // Create Greeting
  startBtn.addEventListener("click", () => {
    const senderName = senderNameInput.value.trim();
    const recipientName = recipientNameInput.value.trim();
    let occasion = occasionSelect.value;

    if (!senderName || !recipientName || !occasion) {
      alert("Please fill in all fields.");
      return;
    }

    // Handle Custom Occasion
    if (occasion === "Custom") {
      const customOccasion = document.getElementById("customOccasionText").value.trim();
      if (!customOccasion) {
        alert("Please enter your custom occasion.");
        return;
      }
      occasion = customOccasion;
    }

    // Handle New Year
    if (occasion === "NewYear") {
      const year = document.getElementById("newYearYear").value.trim();
      if (!year) {
        alert("Please enter the year for New Year.");
        return;
      }
      occasion = `New Year ${year}`;
    }

    // Save values for unlock flow
    localStorage.setItem("senderName", senderName);
    localStorage.setItem("recipientName", recipientName);
    localStorage.setItem("occasion", occasion);

    showGreeting(senderName, recipientName, occasion);
  });

  // Render greeting card
  function showGreeting(senderName, recipientName, occasion) {
    greetingTitle.textContent = `${occasion} Greeting`;
    greetingMessage.textContent =
      `Dear ${recipientName},\n\nWishing you a wonderful ${occasion}! 🎉✨\n\nWith love,\n${senderName}`;
    greetingSection.classList.remove("hidden");
    confettiBurst();
  }

  // Confetti effect
  function confettiBurst() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Unlock logic: enable downloads when ?unlocked=true
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

  // Download as PNG (only the greeting card)
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

  // Download as PDF (title + message)
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
    const lines = doc.splitTextToSize(greetingMessage.textContent || "", 170);
    doc.text(lines, 20, 50);
    doc.save("greeting.pdf");
  });

  // Register service worker for PWA (needed for PWABuilder)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((e) => console.warn("SW registration failed:", e));
  }
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}