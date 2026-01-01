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

  let appUser = "", occasion = "", recipient = "";

  // Onboarding
  onboardBtn.addEventListener('click', () => {
    if (!appUserInput.value.trim()) { alert('Enter your name'); return; }
    appUser = appUserInput.value.trim();
    document.getElementById('onboarding').classList.add('hidden');
    welcome.classList.remove('hidden');
    welcomeMsg.textContent = `Welcome, ${appUser}! 🎉`;
  });

  // Occasion selection
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

  // Recipient + card generation
  generateCardBtn.addEventListener('click', () => {
    recipient = recipientNameInput.value.trim();
    if (!recipient) { alert("Enter recipient's name!"); return; }

    let message;
    if (occasion === 'New Year') {
      const year = prompt('Select year (2026–4000):') || '2026';
      message = `🎆 Happy New Year ${year}, ${recipient}! 🎆`;
    } else if (occasion === 'Custom') {
      const fest = prompt('Enter festival name:') || 'Festival';
      message = `🎊 Happy ${fest}, ${recipient}! 🎊`;
    } else {
      message = `🎉 Happy ${occasion}, ${recipient}! 🎉`;
    }

    recipientSection.classList.add('hidden');
    cardPreview.classList.remove('hidden');

    cardContent.innerHTML = `
      <div class="greeting-card" id="cardCanvas">
        <h2>${message}</h2>
        <p>From: ${appUser}</p>
        <p>To: ${recipient}</p>
      </div>
    `;
  });

  // Download + show feedback
  downloadBtn.addEventListener('click', () => {
    const format = formatSelect.value;
    const cardEl = document.getElementById('cardCanvas');
    if (!cardEl) { alert('No card to download. Generate first.'); return; }

    html2canvas(cardEl).then(canvas => {
      if (format === "PNG") {
        const link = document.createElement('a');
        link.download = "greeting-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("greeting-card.pdf");
      }
      feedbackSection.classList.remove('hidden');
    });
  });

  // Star rating
  starRating.addEventListener('click', (e) => {
    if (e.target.tagName !== 'SPAN') return;
    const index = [...starRating.children].indexOf(e.target);
    [...starRating.children].forEach((star, i) => {
      star.classList.toggle('active', i <= index);
    });
  });

  // Submit feedback
  submitFeedback.addEventListener('click', () => {
    const feedback = suggestionBox.value.trim();
    const rating = [...starRating.children].filter(star => star.classList.contains('active')).length;

    if (!rating && !feedback) {
      alert('Please add a rating or a suggestion.');
      return;
    }

    const payload = { appUser, recipient, occasion, rating, feedback };

    // 👉 Your Web App URL plugged in
    const scriptURL = "https://script.google.com/macros/s/AKfycbw1pwdcMi0ZH4pOX-jVfOslUI2XTJIbGba0o9kVVUucAvarUu25JdVZHzfI23hvFpw/exec";

    fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(() => {
      alert("Feedback submitted!");
      suggestionBox.value = '';
      [...starRating.children].forEach(star => star.classList.remove('active'));
      feedbackSection.classList.add('hidden');
    })
    .catch(err => alert("Error submitting feedback: " + err));
  });
});