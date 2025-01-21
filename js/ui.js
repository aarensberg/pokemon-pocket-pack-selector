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
        { value: 'PROMO-A', label: 'Promo A' }
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
            case 'PROMO-A':
                title.textContent = 'Promo A Card List';
                break;
            default:
                title.textContent = `Expansion ${expansionId}`;
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
        cardContainer.dataset.name = card.name.toLowerCase();

        const numberLabel = document.createElement('div');
        numberLabel.className = 'card-number';
        numberLabel.textContent = `#${card.collectionNumber}`;

        const img = document.createElement('img');
        img.src = `assets/image/cards-illustrations/${card.expansionId}-${card.collectionNumber}-${card.name}-${card.rarity}.png`;
        img.className = 'card-image';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-checkbox';
        checkbox.dataset.cardNumber = card.collectionNumber;
        checkbox.dataset.expansionId = card.expansionId;
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                app.selectedCards.add(`${card.expansionId}-${card.collectionNumber}`);
            } else {
                app.selectedCards.delete(`${card.expansionId}-${card.collectionNumber}`);
            }
        });

        cardContainer.appendChild(numberLabel);
        cardContainer.appendChild(img);
        cardContainer.appendChild(checkbox);

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
    const expansions = ['A1a', 'A1', 'PROMO-A'];
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
