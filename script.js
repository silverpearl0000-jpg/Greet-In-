function selectOccasion(occasion) {
  if (occasion === 'Custom') {
    let customFestival = prompt("Enter your custom festival name:");
    let recipient = prompt("Who are you greeting?");
    let format = prompt("Choose format (PNG, PDF, JPG):");
    alert(`Generating greeting for ${recipient} on ${customFestival} in ${format} format.`);
  } else if (occasion === 'New Year') {
    let year = prompt("Choose a year (2026–4000):");
    let recipient = prompt("Who are you greeting?");
    let format = prompt("Choose format (PNG, PDF, JPG):");
    alert(`Generating New Year greeting for ${recipient} for year ${year} in ${format} format.`);
  } else {
    let recipient = prompt("Who are you greeting?");
    let format = prompt("Choose format (PNG, PDF, JPG):");
    alert(`Generating ${occasion} greeting for ${recipient} in ${format} format.`);
  }
}