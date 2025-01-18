async function fetchGameData() {
    const response = await fetch('assets/data/cards.json');
    return response.json();
}

async function fetchOfferingRates() {
    const response = await fetch('assets/data/offering-rates.json');
    return response.json();
}
