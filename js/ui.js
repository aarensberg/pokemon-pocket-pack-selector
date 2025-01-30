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

    // Ajout de la navigation des extensions
    const expansionsNav = document.createElement('nav');
    expansionsNav.className = 'expansions-nav';
    
    const expansionLinks = [
        { id: 'A2', name: 'Space-Time Smackdown' },
        { id: 'A1a', name: 'Mythical Island' },
        { id: 'A1', name: 'Genetic Apex' }
    ];
    
    expansionLinks.forEach(exp => {
        const link = document.createElement('a');
        link.href = `#expansion-${exp.id}`;
        link.className = 'expansion-link';
        link.dataset.expansion = exp.id;
        link.textContent = exp.name;
        expansionsNav.appendChild(link);
    });
    
    document.querySelector('.container').insertBefore(expansionsNav, mainContainer);

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
        section.id = `expansion-${expansionId}`; // Ajout de l'ID pour le lien d'ancrage
        
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

    function getRarityColor(rarity) {
        const colors = {
            'C': '#ffffff',    // Blanc
            'U': '#55ff55',    // Vert
            'R': '#5555ff',    // Bleu
            'RR': '#aa00aa',   // Violet
            'AR': '#fa8bfd',   // Rose
            'SR': '#ff5555',   // Rouge
            'SAR': '#ff5555',   // Rouge
            'IM': '#4c4d4c',   // Noir
            'UR': '#ffaa00'    // Doré
        };
        return colors[rarity] || 'white';
    }

    function getDustColor(cost) {
        switch(cost) {
            case 35: return '#c0c0c0';    // Gris clair
            case 70: return '#89cff0';    // Bleu clair
            case 150: return '#4169e1';   // Bleu royal
            case 400: return '#800080';   // Violet
            case 500: return '#9400d3';   // Violet foncé
            case 1250: return '#ffd700';  // Or
            case 1500: return '#ffa500';  // Orange
            case 2500: return '#ff4500';  // Rouge-orange
            default: return '#ffffff';     // Blanc par défaut
        }
    }

    function getExpansionColor(expansionId) {
        return {
            'A1': '#8431d1',
            'A1a': '#49dcb1',
            'A2': '#a4afbd'
        }[expansionId] || 'white';
    }

    function getPackColor(packName) {
        const colors = {
            'Charizard': '#f84b04',
            'Mewtwo': '#957eff',
            'Pikachu': '#febe01',
            'Mew': '#ffbadc',
            'Dialga': '#3739e2',
            'Palkia': '#d03ae4'
        };
        return colors[packName] || 'white';
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
                    <span style="color: ${getRarityColor(card.rarity)}">${card.rarity}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Number</span>
                    <span style="color: #ffd700">#${card.collectionNumber}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Dust Cost</span>
                    <span style="color: ${getDustColor(card.dustCost)}">${card.dustCost}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Expansion</span>
                    <span style="color: ${getExpansionColor(card.expansionId)}">${card.expansionId}</span>
                </div>
                <div class="tooltip-section">
                    <div class="tooltip-label">Found in packs :</div>
                    <div>${card.foundInPacks
                        .map(pack => {
                            const packName = pack.replace(' Pack', '');
                            return `<span style="color: ${getPackColor(packName)}">${packName}</span>`;
                        })
                        .join(', ')}
                    </div>
                </div>
                <div class="tooltip-section">
                    <div class="tooltip-label">Drop Rates :</div>
                    ${Object.entries(card)
                        .filter(([key]) => key.startsWith('Drop Rate'))
                        .map(([key, value]) => {
                            const packName = key.split('Drop Rate ')[1];
                            return `
                                <div class="tooltip-info">
                                    <span style="color: ${getPackColor(packName)}">${packName} :</span>
                                    <span style="color: ${getPackColor(packName)}">${Number(value).toFixed(3)}%</span>
                                </div>
                            `;
                        }).join('')}
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
    const expansions = ['A2', 'A1a', 'A1'];
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
