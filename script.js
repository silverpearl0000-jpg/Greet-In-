function startGreeting() {
  const name = document.getElementById("userName").value;
  if (name.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  document.getElementById("animatedName").innerText = `🎉 Welcome, ${name}! 🎉`;
  document.getElementById("occasionSection").classList.remove("hidden");
}

function selectOccasion(occasion) {
  let message = "";
  if (occasion === "Custom") {
    const custom = prompt("Enter your custom occasion:");
    message = `Happy ${custom}, ${document.getElementById("userName").value}! 🎊`;
  } else if (occasion === "New Year") {
    const year = prompt("Enter the year:");
    message = `🎆 Happy New Year ${year}, ${document.getElementById("userName").value}! 🎆`;
  } else {
    message = `🎉 Happy ${occasion}, ${document.getElementById("userName").value}! 🎉`;
  }

  document.getElementById("cardContent").innerText = message;
  document.getElementById("cardPreview").classList.remove("hidden");
}