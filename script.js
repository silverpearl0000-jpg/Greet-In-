document.addEventListener('DOMContentLoaded', () => {
  // Elements
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

  // State
  let appUser = "";
  let occasion = "";
  let recipient = "";

  // Step 1: Onboarding
  onboardBtn.addEventListener('click', () => {
    const name = appUserInput.value.trim();
    if (!name) { alert('Enter your name'); return; }
    appUser = name;
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
    const name = recipientNameInput.value.trim();
    if (!name) { alert("Enter recipient's name!"); return; }
    recipient = name;

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

    // Render styled card
    cardContent.innerHTML = `
      <div class="greeting-card" id="cardCanvas">
        <h2>${message}</h2>
        <p>From: ${appUser}</p>
        <p>To: ${recipient}</p>
      </div>
    `;
  });

  // Step 4: Download card (PNG/PDF) + show feedback
  downloadBtn.addEventListener('click', () => {
    const format = formatSelect.value;
    const cardEl = document.getElementById('cardCanvas'); // capture the styled card only
    if (!cardEl) { alert('No card to download. Generate first.'); return; }

    html2canvas(cardEl, { backgroundColor: null }).then(canvas => {
      if (format === "PNG") {
        const link = document.createElement('a');
        link.download = "greeting-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        const imgData = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = Math.min(pageWidth - 40, canvas.width);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save("greeting-card.pdf");
      }
      // Reveal feedback section after download
      feedbackSection.classList.remove('hidden');
    }).catch(err => alert('Download failed: ' + err));
  });

  // Step 5: Star rating
  starRating.addEventListener('click', (e) => {
    if (e.target.tagName !== 'SPAN') return;
    const index = [...starRating.children].indexOf(e.target);
    [...starRating.children].forEach((star, i) => {
      star.classList.toggle('active', i <= index);
    });
  });

  // Step 6: Submit feedback to Google Sheets
  submitFeedback.addEventListener('click', () => {
    const feedback = suggestionBox.value.trim();
    const rating = [...starRating.children].filter(star => star.classList.contains('active')).length;

    if (!rating && !feedback) {
      alert('Please add a rating or a suggestion.');
      return;
    }

    const payload = { appUser, recipient, occasion, rating, feedback };

    // Replace with your actual Apps Script Web App URL if different
    const scriptURL = "https://script.google.com/macros/s/AKfycbwl6qoGclL4wEkw2B1ndi_BeHtp0Q9pmcQ9eDZZ2fRB-I7zv9WREgase6TjBHo4iIQ/exec";

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