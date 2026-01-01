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
    const recipient = recipientNameInput.value.trim();
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

  // Step 4: Download card (placeholder)
  downloadBtn.addEventListener('click', () => {
    alert(`Card will be downloaded as ${formatSelect.value}`);
    cardPreview.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
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
    alert(`Feedback submitted:\n${suggestionBox.value}`);
    suggestionBox.value = '';
    feedbackSection.classList.add('hidden');
    alert('🎉 Thank you for using Greet In!');
  });
});