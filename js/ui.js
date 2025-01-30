document.addEventListener('DOMContentLoaded', async () => {
    const mainContainer = document.getElementById('cards-grid');
    
    // Création de l'en-tête
    const header = document.createElement('header');
    header.className = 'page-header';
    
    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'title-row';
    
    const title = document.createElement('h1');
    title.className = 'header-title';
    title.textContent = 'Pokémon Pocket Pack Selector by ';
    
    const profilePic = document.createElement('img');
    profilePic.src = 'assets/image/profile-picture.png';
    profilePic.alt = 'Profile Picture';
    profilePic.className = 'profile-picture';
    
    const authorName = document.createElement('span');
    authorName.textContent = '@aarensberg';
    
    const githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/aarensberg/pokemon-pocket-pack-selector';
    githubLink.className = 'github-link';
    githubLink.textContent = 'See the GitHub repository';
    githubLink.target = '_blank';
    
    title.appendChild(authorName);
    titleRow.appendChild(title);
    titleRow.appendChild(profilePic);
    headerContent.appendChild(titleRow);
    headerContent.appendChild(githubLink);
    header.appendChild(headerContent);
    
    document.querySelector('.container').insertBefore(header, mainContainer);

    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    await app.initialize();

    // Ajout de la barre de recherche
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const nameSearchInput = document.createElement('input');
    nameSearchInput.type = 'text';
    nameSearchInput.className = 'search-input';
    nameSearchInput.placeholder = 'Search by name...';
    
    const idSearchGroup = document.createElement('div');
    idSearchGroup.className = 'id-search-group';
    
    const expansionSelect = document.createElement('select');
    expansionSelect.className = 'expansion-select';
    
    // Ajout des options pour le select
    const expansionOptions = [
        { value: '', label: 'All expansions' },
        { value: 'A1', label: 'Genetic Apex' },
        { value: 'A1a', label: 'Mythical Island' },
        { value: 'A2', label: 'Space-Time Smackdown' }
    ];
    
    expansionOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        expansionSelect.appendChild(option);
    });
    
    const numberInput = document.createElement('input');
    numberInput.type = 'text';
    numberInput.className = 'number-input';
    numberInput.placeholder = 'Card #';
    
    // Ajout de la validation pour n'accepter que les chiffres
    numberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        filterCards();
    });

    numberInput.addEventListener('keypress', (e) => {
        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    });

    idSearchGroup.appendChild(expansionSelect);
    idSearchGroup.appendChild(numberInput);
    
    searchContainer.appendChild(nameSearchInput);
    searchContainer.appendChild(idSearchGroup);
    document.querySelector('.container').insertBefore(searchContainer, mainContainer);

    // Fonction de recherche mise à jour
    function filterCards() {
        const nameSearch = nameSearchInput.value.toLowerCase();
        const selectedExpansion = expansionSelect.value.toLowerCase();
        const numberSearch = numberInput.value.toLowerCase();

        document.querySelectorAll('.card-container').forEach(card => {
            const cardName = card.querySelector('.card-image').src
                .split('-')
                .slice(-2, -1)[0]
                .toLowerCase();
            
            const cardExpansion = card.querySelector('input').dataset.expansionId.toLowerCase();
            const cardNumber = card.querySelector('input').dataset.cardNumber;
            
            const matchesName = cardName.includes(nameSearch);
            const matchesExpansion = selectedExpansion === '' || cardExpansion === selectedExpansion;
            const matchesNumber = numberSearch === '' || cardNumber.includes(numberSearch);
            
            if (matchesName && matchesExpansion && matchesNumber) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Événements de recherche
    nameSearchInput.addEventListener('input', filterCards);
    expansionSelect.addEventListener('change', filterCards);
    numberInput.addEventListener('input', filterCards);

    function createExpansionSection(expansionId) {
        const section = document.createElement('section');
        section.className = 'expansion-section';
        
        const header = document.createElement('div');
        header.className = 'expansion-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.style.display = 'flex';
        headerLeft.style.alignItems = 'center';
        headerLeft.style.gap = '20px';
        
        const logo = document.createElement('img');
        logo.src = `assets/image/expansions-logo/${expansionId}.webp`;
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
            case 'A2':
                title.textContent = 'Space-Time Smackdown (A2) Card List';
                break;
            default:
                title.textContent = `Expansion ${expansionId}`;
        }
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'select-all-btn';
        selectAllBtn.textContent = 'Select all';
        selectAllBtn.addEventListener('click', () => {
            const cards = section.querySelectorAll('.card-container');
            const allSelected = Array.from(cards).every(card => card.classList.contains('selected'));
            
            cards.forEach(card => {
                const cardId = card.dataset.cardId;
                if (allSelected) {
                    app.selectedCards.delete(cardId);
                    card.classList.remove('selected');
                } else {
                    app.selectedCards.add(cardId);
                    card.classList.add('selected');
                }
            });
            
            selectAllBtn.textContent = allSelected ? 'Select all' : 'Unselect all';
        });
        
        headerLeft.appendChild(logo);
        headerLeft.appendChild(title);
        header.appendChild(headerLeft);
        header.appendChild(selectAllBtn);
        section.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'cards-grid';
        section.appendChild(grid);
        
        return section;
    }

    // Ajout du conteneur de tooltip au body
    const tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    document.body.appendChild(tooltip);

    function positionTooltip(e, img) {
        const padding = 15;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const imgRect = img.getBoundingClientRect();
        
        // Position le tooltip au-dessus de la carte
        let x = imgRect.left + (imgRect.width / 2) - (tooltipWidth / 2);
        let y = imgRect.top - tooltipHeight - padding;
        
        // Si le tooltip dépasse en haut, le positionner en dessous de la carte
        if (y < 0) {
            y = imgRect.bottom + padding;
        }
        
        // Si le tooltip dépasse à gauche ou à droite, le recentrer horizontalement
        if (x < padding) {
            x = padding;
        } else if (x + tooltipWidth > window.innerWidth - padding) {
            x = window.innerWidth - tooltipWidth - padding;
        }
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function createCardElement(card) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.dataset.name = card.name.toLowerCase();
        cardContainer.dataset.cardId = `${card.expansionId}-${card.collectionNumber}`;

        const numberLabel = document.createElement('div');
        numberLabel.className = 'card-number';
        numberLabel.textContent = `#${card.collectionNumber}`;

        const img = document.createElement('img');
        img.src = `assets/image/cards-illustrations/${card.expansionId}-${card.collectionNumber}-${card.name}-${card.rarity}.png`;
        img.className = 'card-image';

        cardContainer.appendChild(numberLabel);
        cardContainer.appendChild(img);

        // Gestion de la sélection au clic
        cardContainer.addEventListener('click', () => {
            const cardId = cardContainer.dataset.cardId;
            if (app.selectedCards.has(cardId)) {
                app.selectedCards.delete(cardId);
                cardContainer.classList.remove('selected');
            } else {
                app.selectedCards.add(cardId);
                cardContainer.classList.add('selected');
            }
        });

        img.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `
                <div class="tooltip-title">${card.name}</div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Rarity</span>
                    <span>${card.rarity}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Number</span>
                    <span>#${card.collectionNumber}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Dust Cost</span>
                    <span>${card.dustCost}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Expansion</span>
                    <span>${card.expansionId}</span>
                </div>
                <div class="tooltip-section">
                    <div class="tooltip-label">Found in packs :</div>
                    <div>${card.foundInPacks.join(', ')}</div>
                </div>
                <div class="tooltip-section">
                    <div class="tooltip-label">Drop Rates :</div>
                    ${Object.entries(card)
                        .filter(([key]) => key.startsWith('Drop Rate'))
                        .map(([key, value]) => `
                            <div class="tooltip-info">
                                <span>${key.split('Drop Rate ')[1]} :</span>
                                <span>${Number(value).toFixed(3)}%</span>
                            </div>
                        `).join('')}
                </div>
            `;
            tooltip.classList.add('visible');
            positionTooltip(e, img);
        });

        img.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        return cardContainer;
    }

    const modal = document.getElementById('resultsModal');
    const modalBody = modal.querySelector('.modal-body');
    const closeButton = modal.querySelector('.close-button');

    function displayResults(rates) {
        modalBody.innerHTML = '<h2>Score composite de chaque booster :</h2>';
        
        for (const [booster, rate] of Object.entries(rates)) {
            modalBody.innerHTML += `
                <div class="pack-result">
                    <img 
                        src="assets/image/packs-illustrations/${booster}.webp" 
                        alt="${booster} Pack"
                        class="pack-illustration"
                    >
                    <div class="pack-score">
                        ${booster}: ${rate.toFixed(3)}
                    </div>
                </div>
            `;
        }
        
        modal.style.display = 'flex';
    }

    // Fermeture du modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermeture en cliquant en dehors du modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Organiser et afficher les cartes par extension
    const expansions = ['A1', 'A1a', 'A2'];
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
