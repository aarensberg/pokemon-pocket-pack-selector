class PokemonCardSelector {
    constructor() {
        this.cards = [];
        this.offeringRates = null;
        this.selectedCards = new Set();
    }

    async initialize() {
        try {
            const [cards, offeringRates] = await Promise.all([
                fetchGameData(),
                fetchOfferingRates()
            ]);

            this.offeringRates = offeringRates;
            this.cards = cards.map(card => ({
                rarity: card.rarity,
                name: card.name,
                collectionNumber: card.collectionNumber,
                dustCost: card.dustCost,
                foundInPacks: card.foundInPacks,
                expansionId: card.expansionId
            }));

            this.calculateDropRates();
            return this.cards;
        } catch (error) {
            console.error('Error during initialization:', error);
            return [];
        }
    }

    calculateDropRates() {
        const packs = new Set(this.cards.flatMap(card => card.foundInPacks));
        
        for (const pack of packs) {
            for (const card of this.cards) {
                if (card.foundInPacks.includes(pack)) {
                    const packName = pack.split(' ')[0];
                    const rates = this.offeringRates[pack];
                    
                    card[`Drop Rate (${packName})`] = this.calculateCardDropRate(card, rates);
                }
            }
        }
    }

    calculateCardDropRate(card, rates) {
        const regularRate = (
            rates['Regular pack']['1st to 3rd cards'][card.rarity] * 3 +
            rates['Regular pack']['4th card'][card.rarity] +
            rates['Regular pack']['5th card'][card.rarity]
        ) * 99.95;
        
        const rareRate = rates['Rare pack'][card.rarity] * 5 * 0.05;
        
        return (regularRate + rareRate);
    }

    calculateBoosterRates() {
        const boosterRates = {};
        const packs = new Set(this.cards.flatMap(card => 
            card.foundInPacks.map(pack => pack.split(' ')[0])
        ));

        for (const pack of packs) {
            boosterRates[pack] = 0;
        }

        for (const cardNumber of this.selectedCards) {
            const card = this.cards.find(c => c.collectionNumber === cardNumber);

            if (card) {
                Object.entries(card).forEach(([key, value]) => {
                    if (key.startsWith('Drop Rate')) {
                        const boosterName = key.match(/\((.*?)\)/)[1];
                        boosterRates[boosterName] += value / card.dustCost;
                    }
                });
            }
        }

        return Object.fromEntries(
            Object.entries(boosterRates)
                .sort(([,a], [,b]) => b - a)
        );
    }
}

const app = new PokemonCardSelector();
