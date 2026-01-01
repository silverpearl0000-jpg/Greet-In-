document.addEventListener('DOMContentLoaded', () => {
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

  // Step 1: Onboarding → Welcome
  onboardBtn.addEventListener('click', () => {
    const name = document.getElementById('appUser').value.trim();
    if (!name) { alert('Enter your name'); return; }
    appUser = name;
    document.getElementById('onboarding').classList.add('hidden');
    welcome.classList.remove('hidden');
    welcome.classList.add('fade-in');
    welcomeMsg.textContent = `Welcome, ${appUser}! 🎉`;
  });

  // Step 2: Welcome → Occasion
  occasionBtn.addEventListener('click', () => {
    welcome.classList.add('hidden');
    occasionSection.classList.remove('hidden');
    occasionSection.classList.add('fade-in');
  });

  // Step 3: Occasion → Recipient
  occasionSection.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-occasion]');
    if (!btn) return;
    occasion = btn.getAttribute('data-occasion');
    occasionSection.classList.add('hidden');
    recipientSection.classList.remove('hidden');
    recipientSection.classList.add('fade-in');
  });

  // Step 4: Recipient → Card Preview
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
    cardPreview.classList.add('fade-in');

    cardContent.innerHTML = `
      <div class="greeting-card pop-in" id="cardCanvas">
        <h2>${message}</h2>
        <p>From: ${appUser}</p>
        <p>To: ${recipient}</p>
      </div>
    `;

    launchPoppers();
    launchConfetti();
  });

  // Step 5: Card Preview → Feedback after download
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
      feedbackSection.classList.add('fade-in');
    });
  });

  // ⭐ Star rating
  starRating.addEventListener('click', (e) => {
    if (e.target.tagName !== 'SPAN') return;
    const index = [...starRating.children].indexOf(e.target);
    [...starRating.children].forEach((star, i) => {
      star.classList.toggle('active', i <= index);
    });
  });

  // 📝 Submit feedback → Gmail via Apps Script
  submitFeedback.addEventListener('click', () => {
    const feedback = suggestionBox.value.trim();
    const rating = [...starRating.children].filter(star => star.classList.contains('active')).length;

    if (!rating && !feedback) {
      alert('Please add a rating or a suggestion.');
      return;
    }

    const payload = { 
      appUser, 
      recipient, 
      occasion, 
      rating, 
      feedback 
    };

    fetch("https://script.google.com/macros/s/AKfycbzbZciOKny-t7Dg0_kycQmbPBkzvcCVkb0FTXQO_0TjGKvsrECOLC9qFV1af9taEA4/exec", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      alert("Feedback submitted! Check your Gmail inbox.");
      suggestionBox.value = '';
      [...starRating.children].forEach(star => star.classList.remove('active'));
      feedbackSection.classList.add('hidden');
    })
    .catch(err => {
      alert("Error submitting feedback: " + err);
    });
  });

  // 🎉 Party poppers
  function launchPoppers() {
    const container = document.getElementById('poppers');
    for (let i = 0; i < 20; i++) {
      const popper = document.createElement('div');
      popper.className = 'popper';
      popper.textContent = '🎉';
      popper.style.left = Math.random() * 100 + 'vw';
      popper.style.animationDuration = (1.5 + Math.random()) + 's';
      container.appendChild(popper);
      setTimeout(() => popper.remove(), 2000);
    }
  }

  // 🎊 Confetti
  function launchConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#ff0', '#0f0', '#0ff', '#f0f', '#f00', '#00f'];
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random()) + 's';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }
  }
});