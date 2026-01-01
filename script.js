document.addEventListener('DOMContentLoaded', () => {
  const appUserInput = document.getElementById('appUser');
  const onboardBtn = document.getElementById('onboardBtn');
  const welcome = document.getElementById('welcome');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const occasionBtn = document.getElementById('occasionBtn');
  const occasionSection = document.getElementById('occasionSection');
  const recipientSection = document.getElementById('recipientSection');
  const recipientNameInput = document.getElementById('recipientName');
  const generateCardBtn = document.getElementById('generateCardBtn');
  const cardPreview = document.getElementById('cardPreview');
  const cardContent = document.getElementById('cardContent');
  const formatSelect = document.getElementById('formatSelect');
  const downloadBtn = document.getElementById('downloadBtn');
  const feedbackSection = document.getElementById('feedbackSection');
  const suggestionBox = document.getElementById('suggestionBox');
  const starRating = document.getElementById('starRating');
  const submitFeedback = document.getElementById('submitFeedback');

  let appUser = "";
  let occasion = "";
  let recipient = "";

  // Step 1: Onboarding
  onboardBtn.addEventListener('click', () => {
    if (!appUserInput.value.trim()) {
      alert('Please enter your name');
      return;
    }
    appUser = appUserInput.value.trim();
    document.getElementById('onboarding').classList.add('hidden');
    welcome.classList.remove('hidden');
    welcomeMsg.textContent = `Welcome, ${appUser}! 🎉`;
  });

  // Step 2: Occasion selection
  occasionBtn.addEventListener('click', () => {
    welcome.classList.add('hidden');
    occasionSection.classList.remove('hidden');
  });

  occasionSection.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-occasion]');
    if (!btn) return;
    occasion = btn.getAttribute('data-occasion');
    occasionSection.classList.add('hidden');
    recipientSection.classList.remove('hidden');
  });

  // Step 3: Recipient input + card generation
  generateCardBtn.addEventListener('click', () => {
    recipient = recipientNameInput.value.trim();
    if (!recipient) {
      alert("Please enter recipient's name!");
      return;
    }

    let message = '';
    if (occasion === 'New Year') {
      let year = prompt('Select year (2026–4000):');
      message = `🎆 Happy New Year ${year}, ${recipient}! 🎆`;
    } else if (occasion === 'Custom') {
      let fest = prompt('Enter festival name:');
      message = `🎊 Happy ${fest}, ${recipient}! 🎊`;
    } else {
      message = `🎉 Happy ${occasion}, ${recipient}! 🎉`;
    }

    recipientSection.classList.add('hidden');
    cardPreview.classList.remove('hidden');
    cardContent.textContent = message;
  });

  // Step 4: Download card (PNG/PDF)
  downloadBtn.addEventListener('click', () => {
    const format = formatSelect.value;
    const cardElement = document.getElementById('cardContent');

    html2canvas(cardElement).then(canvas => {
      if (format === "PNG") {
        const link = document.createElement('a');
        link.download = "greeting-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === "PDF") {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("greeting-card.pdf");
      }
    });
  });

  // Step 5: Feedback & rating
  starRating.addEventListener('click', (e) => {
    if (e.target.tagName !== 'SPAN') return;
    const index = [...starRating.children].indexOf(e.target);
    [...starRating.children].forEach((star, i) => {
      star.classList.toggle('active', i <= index);
    });
  });

  submitFeedback.addEventListener('click', () => {
    const feedback = suggestionBox.value.trim();
    const rating = [...starRating.children].filter(star => star.classList.contains('active')).length;

    // Build payload for Google Sheets
    const payload = {
      appUser: appUser,
      recipient: recipient,
      occasion: occasion,
      rating: rating,
      feedback: feedback
    };

    // Replace with your Google Apps Script Web App URL
    const scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL";

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(data => {
      alert("Feedback submitted and saved to Google Sheets!");
      suggestionBox.value = '';
      feedbackSection.classList.add('hidden');
      alert('🎉 Thank you for using Greet In!');
    })
    .catch(err => {
      alert("Error saving feedback: " + err);
    });
  });
});