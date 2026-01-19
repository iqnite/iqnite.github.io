const CARDS_JSON_URL =
  "https://raw.githubusercontent.com/iqnite/eggsplode/refs/heads/main/resources/cards.json";

const cardsPerPlayerInput = document.getElementById("cards-per-player-input");
const cardSelectionDiv = document.getElementById("card-selection-div");
const recipeCode = document.getElementById("recipe-code");
const copyCodeButton = document.getElementById("copy-code-button");
const loadingText = document.getElementById("loading-text");

const cardSelections = {};

fetch(CARDS_JSON_URL)
  .then((response) => response.json())
  .then((data) => {
    populateCardSelection(data);
    generateRecipeCode();
    loadingText.style.display = "none";
  });

cardsPerPlayerInput.addEventListener("input", generateRecipeCode);
copyCodeButton.addEventListener("click", copyRecipeCode);

function populateCardSelection(cards) {
  cardSelectionDiv.innerHTML = "";
  for (const cardID in cards) {
    const card = cards[cardID];
    const cardDefaults = {
      exclude: false,
      hideHandOut: false,
      fixedHandOut: false,
      defaultHandOut: 0,
      ...(card.meta?.recipemaker || {}),
    };
    const cardDetails = document.createElement("details");
    cardDetails.className = "card";

    const cardSummary = document.createElement("summary");
    cardSummary.className = "card-summary";
    cardSummary.innerHTML = `${card.emoji} ${card.title}`;
    cardSummary.title = card.description;

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

    const cardHandOutSetting = document.createElement("input");
    cardHandOutSetting.className = "card-hand-out-setting";
    cardHandOutSetting.type = "checkbox";
    cardHandOutSetting.name = "hand-out";
    cardHandOutSetting.checked = cardDefaults.fixedHandOut;
    cardHandOutSetting.addEventListener("change", generateRecipeCode);
    const cardHandOutSettingLabel = document.createElement("label");
    cardHandOutSettingLabel.innerHTML =
      "Hand out a fixed amount of this card to each player: ";

    const cardHandOutInput = document.createElement("input");
    cardHandOutInput.className = "card-hand-out-input";
    cardHandOutInput.type = "number";
    cardHandOutInput.value = cardDefaults.defaultHandOut.toString();
    cardHandOutInput.min = "0";
    cardHandOutInput.max = "100";
    cardHandOutInput.addEventListener("input", generateRecipeCode);

    const cardAutoAmountSetting = document.createElement("input");
    cardAutoAmountSetting.className = "card-auto-amount-setting";
    cardAutoAmountSetting.type = "checkbox";
    cardAutoAmountSetting.name = "auto-amount";
    cardAutoAmountSetting.addEventListener("change", generateRecipeCode);
    const cardAutoAmountSettingLabel = document.createElement("label");
    cardAutoAmountSettingLabel.innerHTML =
      "Set the card amount relative to the amount of players";

    const cardPreserveSetting = document.createElement("input");
    cardPreserveSetting.className = "card-preserve-setting";
    cardPreserveSetting.type = "checkbox";
    cardPreserveSetting.name = "preserve";
    cardPreserveSetting.addEventListener("change", generateRecipeCode);
    const cardPreserveSettingLabel = document.createElement("label");
    cardPreserveSettingLabel.innerHTML =
      "Preserve this card when the deck gets trimmed";

    const cardExpandBeyondSetting = document.createElement("input");
    cardExpandBeyondSetting.className = "card-expand-beyond-setting";
    cardExpandBeyondSetting.type = "checkbox";
    cardExpandBeyondSetting.name = "expand-beyond";
    cardExpandBeyondSetting.checked = true;
    cardExpandBeyondSetting.addEventListener("change", generateRecipeCode);
    const cardExpandBeyondSettingLabel = document.createElement("label");
    cardExpandBeyondSettingLabel.innerHTML =
      "Multiply this card if the amount of players is equal or greater than: ";

    const cardExpandBeyondInput = document.createElement("input");
    cardExpandBeyondInput.className = "card-expand-beyond-input";
    cardExpandBeyondInput.type = "number";
    cardExpandBeyondInput.value = "5";
    cardExpandBeyondInput.min = "0";
    cardExpandBeyondInput.max = "100";
    cardExpandBeyondInput.addEventListener("input", generateRecipeCode);

    if (!cardDefaults.exclude) {
      cardSummary.appendChild(cardAmount);
      cardDetailsContent.appendChild(cardDetailsDescription);
      cardDetailsContent.appendChild(lineBreak());
      if (!cardDefaults.hideHandOut) {
        cardDetailsContent.appendChild(cardHandOutSetting);
        cardDetailsContent.appendChild(cardHandOutSettingLabel);
        cardDetailsContent.appendChild(cardHandOutInput);
        cardDetailsContent.appendChild(lineBreak());
      }
      cardDetailsContent.appendChild(cardAutoAmountSetting);
      cardDetailsContent.appendChild(cardAutoAmountSettingLabel);
      cardDetailsContent.appendChild(lineBreak());
      cardDetailsContent.appendChild(cardPreserveSetting);
      cardDetailsContent.appendChild(cardPreserveSettingLabel);
      cardDetailsContent.appendChild(lineBreak());
      cardDetailsContent.appendChild(cardExpandBeyondSetting);
      cardDetailsContent.appendChild(cardExpandBeyondSettingLabel);
      cardDetailsContent.appendChild(cardExpandBeyondInput);
      cardDetails.appendChild(cardSummary);
      cardDetails.appendChild(cardDetailsContent);
      cardSelectionDiv.appendChild(cardDetails);
    }

    cardSelections[cardID] = {
      amountInput: cardAmount,
      autoAmountSetting: cardAutoAmountSetting,
      preserveSetting: cardPreserveSetting,
      handOutSetting: cardHandOutSetting,
      handOutInput: cardHandOutInput,
      expandBeyondSetting: cardExpandBeyondSetting,
      expandBeyondInput: cardExpandBeyondInput,
    };
  }
}

function generateRecipeCode() {
  const recipe = {};

  const cardsPerPlayer = parseInt(cardsPerPlayerInput.value);
  if (!(isNaN(cardsPerPlayer) || cardsPerPlayer === 8)) {
    recipe.cards_per_player = cardsPerPlayer;
  }

  const cards = {};
  for (const cardID in cardSelections) {
    let card = {};
    const cardInfo = cardSelections[cardID];
    if (cardInfo.handOutSetting.checked) {
      card.hand_out = parseInt(cardInfo.handOutInput.value);
    }
    const preserveSettingChecked = cardInfo.preserveSetting.checked;
    if (preserveSettingChecked) card.preserve = preserveSettingChecked;
    const expandBeyondSettingChecked = cardInfo.expandBeyondSetting.checked;
    if (expandBeyondSettingChecked) {
      const expandBeyondValue = parseInt(cardInfo.expandBeyondInput.value);
      if (expandBeyondValue !== 5) {
        card.expand_beyond = expandBeyondValue;
      }
    } else {
      card.expand_beyond = null;
    }
    const cardAmount = cardInfo.amountInput;
    const cardAmountValue = parseInt(cardAmount.value);
    if (cardInfo.autoAmountSetting.checked) {
      card.auto_amount = cardAmountValue;
      cardInfo.amountInput.classList.remove("error");
    } else {
      if (cardAmountValue < 0 || isNaN(cardAmountValue)) {
        cardInfo.amountInput.classList.add("error");
      } else {
        cardInfo.amountInput.classList.remove("error");
      }
      if (JSON.stringify(card) === JSON.stringify({})) {
        card = cardAmountValue;
      } else {
        card.amount = cardAmountValue;
      }
    }
    if (card !== 0) {
      cards[cardID] = card;
    }
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
    },
  );
}

function lineBreak() {
  return document.createElement("br");
}
