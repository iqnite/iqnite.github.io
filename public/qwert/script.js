// Get the input element
const codeInput = document.getElementById("codeInput");
const submitButton = document.getElementById("submitButton");
const outputImg = document.getElementById("output-img");

// Add input event listener
submitButton.addEventListener("click", handleSubmit);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSubmit();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleSubmit();
  });
});

async function handleSubmit() {
  const input = codeInput.value.trim();
  const upperInput = input.toUpperCase();
  outputImg.title = "Se l'immagine non viene visualizzata correttamente, contattare lo sviluppatore."
  if (upperInput === "RTL") {
    outputImg.src = "correct.svg";
  } else {
    outputImg.src = "wrong.svg";
  }
}
