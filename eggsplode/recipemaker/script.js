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
    cardAmount.min = "-100";
    cardAmount.max = "100";
    cardAmount.addEventListener("input", generateRecipeCode);

    const cardDetailsContent = document.createElement("div");
    cardDetailsContent.className = "card-details-content";

    const cardDetailsDescription = document.createElement("p");
    cardDetailsDescription.innerHTML = card.description;

    const cardAutoAmountSetting = document.createElement("input");
    cardAutoAmountSetting.className = "card-auto-amount-setting";
    cardAutoAmountSetting.type = "checkbox";
    cardAutoAmountSetting.name = "auto-amount";
    cardAutoAmountSetting.addEventListener("change", generateRecipeCode);
    const cardAutoAmountSettingLabel = document.createElement("label");
    cardAutoAmountSettingLabel.innerHTML =
      "Set the card number relative to the amount of players";

    const cardPreserveSetting = document.createElement("input");
    cardPreserveSetting.className = "card-preserve-setting";
    cardPreserveSetting.type = "checkbox";
    cardPreserveSetting.name = "preserve";
    cardPreserveSetting.addEventListener("change", generateRecipeCode);
    const cardPreserveSettingLabel = document.createElement("label");
    cardPreserveSettingLabel.innerHTML =
      "Preserve this card when the deck gets trimmed";

    cardSummary.appendChild(cardAmount);
    cardDetailsContent.appendChild(cardDetailsDescription);
    cardDetailsContent.appendChild(cardAutoAmountSetting);
    cardDetailsContent.appendChild(cardAutoAmountSettingLabel);
    cardDetailsContent.appendChild(lineBreak());
    cardDetailsContent.appendChild(cardPreserveSetting);
    cardDetailsContent.appendChild(cardPreserveSettingLabel);
    cardDetails.appendChild(cardSummary);
    cardDetails.appendChild(cardDetailsContent);
    cardSelectionDiv.appendChild(cardDetails);

    cardSelections[cardID] = {
      amountInput: cardAmount,
      autoAmountSetting: cardAutoAmountSetting,
      preserveSetting: cardPreserveSetting,
    };
  }
}

function generateRecipeCode() {
  const recipe = {};
  const cards = {};
  for (const cardID in cardSelections) {
    const cardInfo = cardSelections[cardID];
    const cardAmount = cardInfo.amountInput;
    const card = (cards[cardID] = {});
    const cardAmountValue = parseInt(cardAmount.value);
    if (cardInfo.autoAmountSetting.checked) {
      card.auto_amount = cardAmountValue;
    } else {
      card.amount = cardAmountValue;
    }
    const preserveSettingChecked = cardInfo.preserveSetting.checked;
    if (preserveSettingChecked) card.preserve = preserveSettingChecked;
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
      alert("Failed to copy recipe code. Please try again.");
    }
  );
}

function lineBreak() {
  return document.createElement("br");
}
