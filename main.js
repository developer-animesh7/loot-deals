// Add current year dynamically
const yearText = document.querySelector("footer p");
if (yearText) {
  const year = new Date().getFullYear();
  yearText.innerHTML = "© " + year + " Looteradeals247";
}