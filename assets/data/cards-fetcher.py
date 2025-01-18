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

with open('assets/data/cards.json', 'w') as f:
    json.dump(cards, f, indent=4)