document.addEventListener('DOMContentLoaded', async () => {
    const mainContainer = document.getElementById('cards-grid');
    await app.initialize();

    // ====== FONCTIONS UTILITAIRES ======
    
    // Obtention des couleurs
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
            default: return '#ffffff';    // Blanc par défaut
        }
    }

    function getExpansionColor(expansionId) {
        return {
            'A1': '#8431d1',
            'A1a': '#49dcb1',
            'A2': '#a4afbd',
            'A2a': '#fcb038'
        }[expansionId] || 'white';
    }

    function getPackColor(packName) {
        const colors = {
            'Charizard': '#f84b04',
            'Mewtwo': '#957eff',
            'Pikachu': '#febe01',
            'Mew': '#ffbadc',
            'Dialga': '#3739e2',
            'Palkia': '#d03ae4',
            'Arceus': '#f3c639',
        };
        return colors[packName] || 'white';
    }

    function getExpansionName(expansionId) {
        const names = {
            'A1': 'Genetic Apex',
            'A1a': 'Mythical Island',
            'A2': 'Space-Time Smackdown',
            'A2a': 'Triumphant Light'
        };
        return names[expansionId] || expansionId;
    }

    // Gestion des raretés
    function getRaritySymbol(rarity) {
        const symbolMap = {
            'C': '<img src="assets/image/rarity-icons/diamond.png" class="rarity-icon" alt="♢">',
            'U': '<img src="assets/image/rarity-icons/diamond.png" class="rarity-icon" alt="♢">'.repeat(2),
            'R': '<img src="assets/image/rarity-icons/diamond.png" class="rarity-icon" alt="♢">'.repeat(3),
            'RR': '<img src="assets/image/rarity-icons/diamond.png" class="rarity-icon" alt="♢">'.repeat(4),
            'AR': '<img src="assets/image/rarity-icons/star.png" class="rarity-icon" alt="☆">',
            'SR': '<img src="assets/image/rarity-icons/star.png" class="rarity-icon" alt="☆">'.repeat(2),
            'SAR': '<img src="assets/image/rarity-icons/star.png" class="rarity-icon" alt="☆">'.repeat(2) + ' (🌈)',
            'IM': '<img src="assets/image/rarity-icons/star.png" class="rarity-icon" alt="☆">'.repeat(3),
            'UR': '<img src="assets/image/rarity-icons/gold-crown.png" class="rarity-icon" alt="♛">'
        };
        return symbolMap[rarity] || rarity;
    }

    function getRarityOrder(rarity) {
        const order = {
            'C': 0,    // ♢
            'U': 1,    // ♢♢
            'R': 2,    // ♢♢♢
            'RR': 3,   // ♢♢♢♢
            'AR': 4,   // ☆
            'SR': 5,   // ☆☆
            'SAR': 6,  // ☆☆ 🌈
            'IM': 7,   // ☆☆☆
            'UR': 8    // ♛
        };
        return order[rarity] ?? 999; // Valeur par défaut élevée pour les raretés inconnues
    }

    // Ajout des fonctions de gestion des sauvegardes après les fonctions utilitaires
    function downloadSelections() {
        const data = {
            date: new Date().toISOString(),
            selectedCards: Array.from(app.selectedCards)
        };
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pokemon-selection-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async function loadSelections(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.selectedCards) {
                throw new Error('Invalid file format');
            }

            // Désélectionner toutes les cartes actuelles
            document.querySelectorAll('.card-container').forEach(card => {
                card.classList.remove('selected');
            });
            app.selectedCards.clear();

            // Sélectionner les cartes du fichier
            data.selectedCards.forEach(cardId => {
                const cardElement = document.querySelector(`.card-container[data-card-id="${cardId}"]`);
                if (cardElement) {
                    cardElement.classList.add('selected');
                    app.selectedCards.add(cardId);
                }
            });
        } catch (error) {
            alert('Error loading file: ' + error.message);
        }
    }

    // ====== CRÉATION DES ÉLÉMENTS DE L'INTERFACE ======
    
    // En-tête de la page
    function createHeader() {
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
        profilePic.src = 'assets/image/other/profile-picture.png';
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

        const uploadContainer = document.createElement('div');
        uploadContainer.className = 'upload-container';
        
        const uploadLabel = document.createElement('label');
        uploadLabel.textContent = 'Load selection: ';
        uploadLabel.htmlFor = 'selection-file';
        
        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.id = 'selection-file';
        uploadInput.accept = '.json';
        
        uploadInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                loadSelections(e.target.files[0]);
            }
        });
        
        uploadContainer.appendChild(uploadLabel);
        uploadContainer.appendChild(uploadInput);
        headerContent.appendChild(uploadContainer);
        
        return header;
    }
    
    // Navigation des extensions
    function createExpansionsNav() {
        const expansionsNav = document.createElement('nav');
        expansionsNav.className = 'expansions-nav';
        
        const expansionLinks = [
            { id: 'A2a', name: 'Triumphant Light' },
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
        
        return expansionsNav;
    }
    
    // Déclarer les variables de recherche en dehors des fonctions pour les rendre accessibles globalement
    let nameSearchInput, expansionSelect, numberInput;

    // Barre de recherche
    function createSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        // Assigner les éléments aux variables globales
        nameSearchInput = document.createElement('input');
        nameSearchInput.type = 'text';
        nameSearchInput.className = 'search-input';
        nameSearchInput.placeholder = 'Search by name...';
        
        const idSearchGroup = document.createElement('div');
        idSearchGroup.className = 'id-search-group';
        
        expansionSelect = document.createElement('select');
        expansionSelect.className = 'expansion-select';
        
        // Ajout des options pour le select
        const expansionOptions = [
            { value: '', label: 'All sets' },
            { value: 'A1', label: 'Genetic Apex' },
            { value: 'A1a', label: 'Mythical Island' },
            { value: 'A2', label: 'Space-Time Smackdown' },
            { value: 'A2a', label: 'Triumphant Light' }
        ];
        
        expansionOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            expansionSelect.appendChild(option);
        });
        
        numberInput = document.createElement('input');
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

        // Événements de recherche
        nameSearchInput.addEventListener('input', filterCards);
        expansionSelect.addEventListener('change', filterCards);
        numberInput.addEventListener('input', filterCards);
        
        return searchContainer;
    }
    
    // Conteneur de navigation sticky
    function createStickyNav(expansionsNav, searchContainer) {
        const stickyNavContainer = document.createElement('div');
        stickyNavContainer.className = 'sticky-nav-container';
        
        // Déplacer les éléments de navigation dans le conteneur
        stickyNavContainer.appendChild(expansionsNav);
        stickyNavContainer.appendChild(searchContainer);
        
        return stickyNavContainer;
    }

    // ====== GESTION DES CARTES ======
    
    // Création d'une section d'extension
    function createExpansionSection(expansionId) {
        const section = document.createElement('section');
        section.className = 'expansion-section';
        section.id = `expansion-${expansionId}`;
        
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
        title.textContent = `${getExpansionName(expansionId)} (${expansionId}) Card List`;
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'select-all-btn';
        selectAllBtn.style.backgroundColor = getExpansionColor(expansionId);
        selectAllBtn.textContent = 'Select all';
        
        // Ajout des styles pour le hover via un dataset
        selectAllBtn.dataset.expansionColor = getExpansionColor(expansionId);
        
        selectAllBtn.addEventListener('mouseenter', (e) => {
            const color = e.target.dataset.expansionColor;
            e.target.style.backgroundColor = color.replace('1)', '0.8)');
        });
        
        selectAllBtn.addEventListener('mouseleave', (e) => {
            e.target.style.backgroundColor = e.target.dataset.expansionColor;
        });
        
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
    
    // Création d'un élément carte
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
                    <span>${getRaritySymbol(card.rarity)}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Dust Cost</span>
                    <span style="color: ${getDustColor(card.dustCost)}">${card.dustCost}</span>
                </div>
                <div class="tooltip-info">
                    <span class="tooltip-label">Set</span>
                    <span style="color: ${getExpansionColor(card.expansionId)}">${getExpansionName(card.expansionId)}</span>
                </div>
                <div class="tooltip-section">
                    <div class="tooltip-label">Drop Rates :</div>
                    ${Object.entries(card)
                        .filter(([key]) => key.startsWith('Drop Rate'))
                        .map(([key, value]) => {
                            const packName = key.split('Drop Rate ')[1];
                            return `
                                <div class="tooltip-info">
                                    <span class="tooltip-label" style="color: ${getPackColor(packName)}">${packName}</span>
                                    <span ${getPackColor(packName)}">${Number(value).toFixed(3)}%</span>
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
    
    // Filtrage des cartes
    function filterCards() {
        const nameSearch = nameSearchInput.value.toLowerCase();
        const selectedExpansion = expansionSelect.value.toLowerCase();
        const numberSearch = numberInput.value.toLowerCase();

        // Pour chaque section d'extension
        document.querySelectorAll('.expansion-section').forEach(section => {
            const expansionId = section.id.split('-')[1].toLowerCase();
            const cards = section.querySelectorAll('.card-container');
            let hasVisibleCards = false;

            // Filtrage des cartes
            cards.forEach(card => {
                const cardImage = card.querySelector('.card-image');
                const cardName = cardImage.src
                    .split('/')
                    .pop()
                    .split('-')
                    .slice(-2, -1)[0]
                    .toLowerCase();
                
                const cardExpansion = card.dataset.cardId.split('-')[0].toLowerCase();
                const cardNumber = card.dataset.cardId.split('-')[1];
                
                const matchesName = cardName.includes(nameSearch);
                const matchesExpansion = selectedExpansion === '' || cardExpansion === selectedExpansion;
                const matchesNumber = numberSearch === '' || cardNumber.includes(numberSearch);
                
                const isVisible = matchesName && matchesExpansion && matchesNumber;
                card.classList.toggle('hidden', !isVisible);
                
                // Si au moins une carte est visible, on garde la section
                if (isVisible) hasVisibleCards = true;
            });

            // Afficher/masquer la section en fonction de la présence de cartes visibles
            section.style.display = (hasVisibleCards && (selectedExpansion === '' || expansionId === selectedExpansion)) ? 'block' : 'none';
        });
    }

    // ====== GESTION DU TOOLTIP ======
    
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'card-tooltip';
        return tooltip;
    }

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

    // ====== GESTION DES STATISTIQUES ======
    
    function calculateCollectionStats() {
        const stats = {};
        
        // Utiliser les expansions définies plus tôt dans le code
        // Il s'agit d'une variable locale définie dans le bloc principal
        const expansionsToUse = ['A2a', 'A2', 'A1a', 'A1'];
        
        // Initialisation des stats par extension
        expansionsToUse.forEach(exp => {
            stats[exp] = {
                total: 0,
                remaining: 0,
                byRarity: {}
            };
        });

        // Calcul des statistiques avec vérification supplémentaire pour la sécurité
        app.cards.forEach(card => {
            if (stats[card.expansionId]) { // Vérification que l'extension existe dans notre objet stats
                const expStats = stats[card.expansionId];
                expStats.total++;
                
                // Stats par rareté
                if (!expStats.byRarity[card.rarity]) {
                    expStats.byRarity[card.rarity] = { total: 0, remaining: 0 };
                }
                expStats.byRarity[card.rarity].total++;
                
                // On compte les cartes non sélectionnées plutôt que les sélectionnées
                if (!app.selectedCards.has(`${card.expansionId}-${card.collectionNumber}`)) {
                    expStats.remaining++;
                    expStats.byRarity[card.rarity].remaining++;
                }
            }
        });

        return stats;
    }

    // Rendre la fonction downloadSelections accessible globalement
    window.downloadSelections = downloadSelections;

    function displayResults(rates) {
        const stats = calculateCollectionStats();
        const totalStats = Object.values(stats).reduce(
            (acc, expStats) => ({
                remaining: acc.remaining + expStats.remaining,
                total: acc.total + expStats.total
            }),
            { remaining: 0, total: 0 }
        );
        
        const resultsHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Collection Results</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                        min-height: 100vh;
                    }
                    .results-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                        max-width: 2000px;
                        margin: 0 auto;
                    }
                    .stats-column, .scores-column {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .stats-section {
                        background: #f8f8f8;
                        padding: 20px;
                        margin-bottom: 20px;
                        border-radius: 8px;
                    }
                    .rarity-stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                        margin-top: 15px;
                    }
                    .rarity-stat {
                        padding: 10px;
                        background: white;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .pack-results {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    .pack-result {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        background: #f8f8f8;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .pack-illustration {
                        width: 60px;
                        height: 60px;
                        object-fit: contain;
                    }
                    .pack-score {
                        font-size: 20px;
                        font-weight: bold;
                    }
                    h1 {
                        color: #333;
                        margin-top: 0;
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #eee;
                    }
                    h2 {
                        color: #444;
                        margin-bottom: 20px;
                    }
                    p {
                        margin: 10px 0;
                        color: #666;
                    }
                    .progress-container {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin: 8px 0;
                    }

                    .progress-bar {
                        flex-grow: 1;
                        height: 12px;
                        background: #eee;
                        border-radius: 6px;
                        overflow: hidden;
                        position: relative;
                    }

                    .progress-fill {
                        height: 100%;
                        width: 0;
                        transition: width 0.5s ease;
                    }

                    .progress-text {
                        font-size: 14px;
                        min-width: 90px;
                        text-align: right;
                    }

                    .rarity-stats {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        margin-top: 15px;
                    }

                    .rarity-label {
                        min-width: 100px; /* Augmenté pour accommoder les icônes */
                        font-weight: bold;
                        padding: 4px 8px;
                        border-radius: 4px;
                        display: inline-block;
                        text-align: center;
                        background: rgba(0, 0, 0, 0.1);
                        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
                    }

                    .rarity-icon {
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                        margin: 0 1px;
                    }

                    .expansion-title {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    
                    .cards-ratio {
                        font-size: 16px;
                        color: #666;
                        font-weight: normal;
                    }
                    .stats-section-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    
                    .cards-ratio {
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .main-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #eee;
                    }
                    
                    .main-header h1 {
                        margin: 0;
                        padding: 0;
                        border: none;
                    }
                    
                    .total-ratio {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }
                    .stats-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .progress-text {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-size: 14px;
                        min-width: 160px;  /* Augmenté pour accommoder le ratio */
                        text-align: right;
                    }

                    .ratio {
                        color: #666;
                        font-weight: normal;
                    }
                    .expansion-info {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }

                    .expansion-ratio {
                        font-size: 16px;
                        font-weight: bold;
                        color: inherit;
                    }
                    .download-section {
                        text-align: center;
                        margin-bottom: 30px;
                        width: 100%;
                    }

                    .download-button {
                        display: inline-block;
                        padding: 12px 30px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    }

                    .download-button:hover {
                        background: #45a049;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        transform: translateY(-2px);
                    }
                </style>
            </head>
            <body>
                <div class="download-section">
                    <button class="download-button" onclick="window.opener.window.downloadSelections()">
                        Download selection
                    </button>
                </div>
                <div class="results-container">
                    <div class="stats-column">
                        <div class="main-header">
                            <h1>Collection Statistics</h1>
                            <div class="stats-info">
                                <span class="ratio">(${totalStats.remaining}/${totalStats.total})</span>
                                <span class="total-ratio">${((totalStats.remaining/totalStats.total)*100).toFixed(1)}%</span>
                            </div>
                        </div>
                        ${Object.entries(stats).map(([expId, expStats]) => `
                            <div class="stats-section">
                                <div class="stats-section-header">
                                    <h2 style="color: ${getExpansionColor(expId)}">${getExpansionName(expId)}</h2>
                                    <span class="expansion-ratio" style="color: ${getExpansionColor(expId)}">
                                        (${expStats.remaining}/${expStats.total})
                                    </span>
                                </div>
                                <div class="progress-container">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="
                                            width: ${(expStats.remaining/expStats.total)*100}%;
                                            background: ${getExpansionColor(expId)};
                                        "></div>
                                    </div>
                                    <div class="progress-text">
                                        <span class="ratio">(${expStats.remaining}/${expStats.total})</span>
                                        <span>${((expStats.remaining/expStats.total)*100).toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div class="rarity-stats">
                                    ${Object.entries(expStats.byRarity)
                                        .sort(([rarityA], [rarityB]) => getRarityOrder(rarityA) - getRarityOrder(rarityB))
                                        .map(([rarity, rarityStats]) => `
                                            <div class="progress-container">
                                                <span class="rarity-label">
                                                    ${getRaritySymbol(rarity)}
                                                </span>
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="
                                                        width: ${(rarityStats.remaining/rarityStats.total)*100}%;
                                                        background: #4CAF50;
                                                    "></div>
                                                </div>
                                                <div class="progress-text">
                                                    <span class="ratio">(${rarityStats.remaining}/${rarityStats.total})</span>
                                                    <span>${((rarityStats.remaining/rarityStats.total)*100).toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="scores-column">
                        <div class="main-header">
                            <h1>Booster Scores</h1>
                        </div>
                        <div class="pack-results">
                            ${Object.entries(rates).map(([booster, rate]) => `
                                <div class="pack-result">
                                    <img 
                                        src="assets/image/packs-illustrations/${booster}.webp" 
                                        alt="${booster} Pack"
                                        class="pack-illustration"
                                    >
                                    <div class="pack-score" style="color: ${getPackColor(booster)}">
                                        ${booster}: ${rate.toFixed(3)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <script>
                    // Animation des barres de progression
                    setTimeout(() => {
                        document.querySelectorAll('.progress-fill').forEach(bar => {
                            bar.style.transition = 'width 1s ease';
                        });
                    }, 100);
                </script>
            </body>
            </html>
        `;
        
        const resultsWindow = window.open('', 'Collection Results', 'width=1400,height=800');
        resultsWindow.document.write(resultsHTML);
        resultsWindow.document.close();
    }

    // ====== BOUTONS D'ACTION ======
    
    function createActionButtons() {
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.className = 'action-buttons';
        
        // Bouton Calculate - avec logs de débogage
        const calculateBtn = document.createElement('button');
        calculateBtn.id = 'calculate-btn';
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Calculate scores';
        
        // Ajout d'un gestionnaire d'événement directement sur l'élément
        calculateBtn.onclick = function() {
            console.log('Calculate button clicked');
            try {
                const rates = app.calculateBoosterRates();
                console.log('Rates calculated:', rates);
                displayResults(rates);
            } catch (error) {
                console.error('Error calculating rates:', error);
            }
        };
        
        // Bouton Reset
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = 'Reset all';
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.card-container').forEach(card => {
                card.classList.remove('selected');
                app.selectedCards.delete(card.dataset.cardId);
            });
        });
        
        actionButtonsContainer.appendChild(calculateBtn);
        actionButtonsContainer.appendChild(resetBtn);
        return actionButtonsContainer;
    }

    // ====== INITIALISATION DE L'APPLICATION ======
    
    // Création et insertion des éléments de l'interface
    const header = createHeader();
    const expansionsNav = createExpansionsNav();
    const searchBar = createSearchBar();
    const stickyNav = createStickyNav(expansionsNav, searchBar);
    const actionButtons = createActionButtons();
    const tooltip = createTooltip();
    
    document.querySelector('.container').insertBefore(header, mainContainer);
    document.querySelector('.container').insertBefore(stickyNav, mainContainer);
    document.body.appendChild(actionButtons);
    document.body.appendChild(tooltip);
    
    // Organisation et affichage des cartes par extension
    const expansions = ['A2a', 'A2', 'A1a', 'A1'];
    const cardsByExpansion = {};
    
    // Groupement des cartes par extension
    expansions.forEach(exp => {
        cardsByExpansion[exp] = app.cards.filter(card => card.expansionId === exp);
    });
    
    // Création des sections d'extension et affichage des cartes
    expansions.forEach(exp => {
        if (cardsByExpansion[exp].length > 0) {
            const section = createExpansionSection(exp);
            const grid = section.querySelector('.cards-grid');
            
            cardsByExpansion[exp].forEach(card => {
                const cardElement = createCardElement(card);
                if (cardElement) grid.appendChild(cardElement);
            });
            
            mainContainer.appendChild(section);
        }
    });
});
