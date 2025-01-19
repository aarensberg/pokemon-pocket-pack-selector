from requests import get
import json

game_data = get('https://www.pokemon-zone.com/api/game/game-data/').json()
data = get('https://www.pokemon-zone.com/api/cards/search/data/').json()

pack_options = data['data']['packOptions']

cards = []

for card in game_data['data']['cards']:
    cards.append({
        'rarity': card['rarity'],
        'name': card['name'],
        'collectionNumber': card['collectionNumber'],
        'dustCost': card['dustCost'],
        'foundInPacks': [pack_options['label'] for pack_options in pack_options if pack_options['value'] in card['foundInPacks']],
        'expansionId': card['expansion']['expansionId']
    })

cards = sorted(cards, key=lambda x: (x["expansionId"], x["collectionNumber"]))

offering_rates = json.load(open('assets/data/offering-rates.json'))

for pack in set([pack for card in cards for pack in card['foundInPacks']]):
    for card in cards:
        if pack in card['foundInPacks']:
            card[f"Drop Rate {pack.split(' ')[0]}"] = (99.95 * (
                offering_rates[pack]['Regular pack']['1st to 3rd cards'][card['rarity']] * 3 +
                offering_rates[pack]['Regular pack']['4th card'][card['rarity']] +
                offering_rates[pack]['Regular pack']['5th card'][card['rarity']]
            ) + 0.05 * (offering_rates[pack]['Rare pack'][card['rarity']] * 5)) / 100

with open('assets/data/cards.json', 'w') as f:
    json.dump(cards, f, indent=4)