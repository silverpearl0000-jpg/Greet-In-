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

// In your generateCardBtn handler:
generateCardBtn.addEventListener('click', () => {
  // ... existing card generation code ...
  launchPoppers();
  launchConfetti();
});