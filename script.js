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
  const downloadFeedback = document.getElementById('downloadFeedback');

  let appUser = "", occasion = "", recipient = "";

  // Onboarding
  onboardBtn.addEventListener('click', () => {
    const name = document.getElementById('appUser').value.trim();
    if (!name) { alert('Enter your name'); return; }
    appUser = name;
    document.getElementById('onboarding').classList.add('hidden');
    welcome.classList.remove('hidden');
    welcomeMsg.textContent = `Welcome, ${appUser}! 🎉`;
  });

  // Occasion
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

  // Card generation
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

  // Download card
  download