class PokemonCardSelector {
    constructor() {
        this.cards = [];
        this.selectedCards = new Set();
    }

    async initialize() {
        try {
            const cards = await fetchGameData();
            
            this.cards = cards.map(card => {
                // Création de l'objet de base
                const cardData = {
                    rarity: card.rarity,
                    name: card.name,
                    collectionNumber: card.collectionNumber,
                    dustCost: card.dustCost,
                    foundInPacks: card.foundInPacks,
                    expansionId: card.expansionId
                };

                // Mise à jour pour n'inclure que les boosters actifs
                const boosters = ['Charizard', 'Mewtwo', 'Pikachu', 'Mew', 'Dialga', 'Palkia'];
                boosters.forEach(booster => {
                    const dropRateKey = `Drop Rate ${booster}`;
                    if (card[dropRateKey]) {
                        cardData[dropRateKey] = card[dropRateKey];
                    }
                });

                return cardData;
            });

            // Filtrer pour ne garder que les cartes des expansions actives
            this.cards = this.cards.filter(card => 
                ['A1', 'A1a', 'A2'].includes(card.expansionId)
            );

            return this.cards;
        } catch (error) {
            console.error('Error during initialization:', error);
            return [];
        }
    }

    calculateBoosterRates() {
        const boosterRates = {};
        const packs = new Set(this.cards.flatMap(card => 
            card.foundInPacks.map(pack => pack.split(' ')[0])
        ));

        for (const pack of packs) {
            boosterRates[pack] = 0;
        }

        for (const cardId of this.selectedCards) {
            const [expansionId, cardNumber] = cardId.split('-');
            const card = this.cards.find(c => 
                c.expansionId === expansionId && 
                c.collectionNumber.toString() === cardNumber
            );

            if (card) {
                // Parcours des taux de drops de chaque booster
                Object.entries(card).forEach(([key, value]) => {
                    if (key.startsWith('Drop Rate')) {
                        const boosterName = key.split(' ')[2];
                        boosterRates[boosterName] += (value/100) * card.dustCost;
                    }
                });
            }
        }

        return Object.fromEntries(
            Object.entries(boosterRates)
                .filter(([, rate]) => rate > 0)
                .sort(([, a], [, b]) => b - a)
        );
    }
}

const app = new PokemonCardSelector();
