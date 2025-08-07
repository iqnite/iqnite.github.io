const CARDS_JSON_URL =
  "https://raw.githubusercontent.com/iqnite/eggsplode/refs/heads/main/resources/cards.json";

const cardSelectionDiv = document.getElementById("card-selection-div");
const recipeCode = document.getElementById("recipe-code");
const copyCodeButton = document.getElementById("copy-code-button");

var cardSelections = {};

fetch(CARDS_JSON_URL)
  .then((response) => response.json())
  .then((data) => {
    populateCardSelection(data);
    generateRecipeCode();
  });

copyCodeButton.addEventListener("click", copyRecipeCode);

function populateCardSelection(cards) {
  cardSelectionDiv.innerHTML = "";
  for (const cardID in cards) {
    const card = cards[cardID];
    const cardDetails = document.createElement("details");
    cardDetails.className = "card";
    const cardSummary = document.createElement("summary");
    cardSummary.className = "card-summary";
    cardSummary.innerHTML = `${card.emoji} ${card.title}`;
    const cardAmount = document.createElement("input");
    cardAmount.className = "card-amount";
    cardAmount.type = "number";
    cardAmount.value = "0";
    cardAmount.min = "0";
    cardAmount.max = "100";
    cardAmount.id = `card-amount-${cardID}`;
    cardAmount.addEventListener("input", generateRecipeCode);
    cardSummary.appendChild(cardAmount);
    const cardDetailsContent = document.createElement("div");
    cardDetailsContent.className = "card-details-content";
    const cardDetailsDescription = document.createElement("p");
    cardDetailsDescription.innerHTML = card.description;
    cardDetailsContent.appendChild(cardDetailsDescription);
    cardDetails.appendChild(cardSummary);
    cardDetails.appendChild(cardDetailsContent);
    cardSelectionDiv.appendChild(cardDetails);
    cardSelections[cardID] = {
      amountInput: cardAmount,
    };
  }
}

function generateRecipeCode() {
  const recipe = {};
  const cards = {};
  for (const cardID in cardSelections) {
    const cardInfo = cardSelections[cardID];
    const cardAmount = cardInfo.amountInput;
    cards[cardID] = {
      amount: parseInt(cardAmount.value),
    };
  }
  recipe.cards = cards;
  recipeCode.textContent = JSON.stringify(recipe, null, 2);
}

function copyRecipeCode() {
  generateRecipeCode();
  const code = recipeCode.textContent;
  navigator.clipboard.writeText(code).then(
    () => {
      copyCodeButton.textContent = "Copied!";
      copyCodeButton.classList.add("success");
      setTimeout(() => {
        copyCodeButton.textContent = "Copy";
        copyCodeButton.classList.remove("success");
      }, 2000);
    },
    (err) => {
      console.error("Failed to copy recipe code: ", err);
      alert("Failed to copy recipe code.");
    }
  );
}
