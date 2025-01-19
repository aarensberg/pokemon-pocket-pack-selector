async function fetchGameData() {
    const response = await fetch('assets/data/cards.json');
    return response.json();
}
