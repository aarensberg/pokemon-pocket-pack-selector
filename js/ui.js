document.addEventListener('DOMContentLoaded', async () => {
    const mainContainer = document.getElementById('cards-grid');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    await app.initialize();

    function createExpansionSection(expansionId) {
        const section = document.createElement('section');
        section.className = 'expansion-section';
        
        const header = document.createElement('div');
        header.className = 'expansion-header';
        
        const logo = document.createElement('img');
        logo.src = `assets/expansions-logo/${expansionId}.webp`;
        logo.className = 'expansion-logo';
        logo.alt = `Logo ${expansionId}`;
        
        const title = document.createElement('h2');
        switch(expansionId) {
            case 'A1':
                title.textContent = 'Genetic Apex (A1) Card List';
                break;
            case 'A1a':
                title.textContent = 'Mythical Island (A1a) Card List';
                break;
            case 'PROMO-A':
                title.textContent = 'Promo A Card List';
                break;
            default:
                title.textContent = `Extension ${expansionId}`;
        }
        
        header.appendChild(logo);
        header.appendChild(title);
        section.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'cards-grid';
        section.appendChild(grid);
        
        return section;
    }

    function createCardElement(card) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const numberLabel = document.createElement('div');
        numberLabel.className = 'card-number';
        numberLabel.textContent = `#${card.collectionNumber}`;

        const img = document.createElement('img');
        img.src = `assets/cards-illustrations/${card.expansionId}-${card.collectionNumber}-${card.name}-${card.rarity}.png`;
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

    // Organiser et afficher les cartes par extension
    const expansions = ['A1', 'A1a', 'PROMO-A'];
    const cardsByExpansion = {};
    
    // Grouper les cartes par extension
    expansions.forEach(exp => {
        cardsByExpansion[exp] = app.cards.filter(card => card.expansionId === exp);
    });

    // Créer les sections pour chaque extension
    expansions.forEach(exp => {
        if (cardsByExpansion[exp].length > 0) {
            const section = createExpansionSection(exp);
            const grid = section.querySelector('.cards-grid');
            
            cardsByExpansion[exp].forEach(card => {
                const cardElement = createCardElement(card);
                if (cardElement) {
                    grid.appendChild(cardElement);
                }
            });
            
            mainContainer.appendChild(section);
        }
    });

    // Gérer le calcul
    calculateBtn.addEventListener('click', () => {
        const rates = app.calculateBoosterRates();
        displayResults(rates);
    });
});
