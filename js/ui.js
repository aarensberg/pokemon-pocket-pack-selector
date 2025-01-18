document.addEventListener('DOMContentLoaded', async () => {
    const cardsGrid = document.getElementById('cards-grid');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    await app.initialize();

    function createCardElement(card) {
        if (card.expansionId !== 'A1') return null;

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const numberLabel = document.createElement('div');
        numberLabel.className = 'card-number';
        numberLabel.textContent = `#${card.collectionNumber}`;

        const img = document.createElement('img');
        img.src = `assets/images/${card.expansionId}-${card.collectionNumber}-${card.name}-${card.rarity}.png`;
        img.className = 'card-image';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-checkbox';
        checkbox.dataset.cardNumber = card.collectionNumber;
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                app.selectedCards.add(card.collectionNumber);
            } else {
                app.selectedCards.delete(card.collectionNumber);
            }
        });

        cardContainer.appendChild(numberLabel);
        cardContainer.appendChild(img);
        cardContainer.appendChild(checkbox);

        return cardContainer;
    }

    function displayResults(rates) {
        resultsDiv.innerHTML = '<h2>Score composite de chaque booster :</h2>';
        for (const [booster, rate] of Object.entries(rates)) {
            resultsDiv.innerHTML += `<p>${booster}: ${rate.toFixed(3)}</p>`;
        }
        resultsDiv.style.display = 'block';
    }

    // Afficher les cartes
    app.cards
        .filter(card => card.expansionId === 'A1')
        .forEach(card => {
            const cardElement = createCardElement(card);
            if (cardElement) {
                cardsGrid.appendChild(cardElement);
            }
        });

    // Gérer le calcul
    calculateBtn.addEventListener('click', () => {
        const rates = app.calculateBoosterRates();
        displayResults(rates);
    });
});
