from requests import get

game_data = get('https://www.pokemon-zone.com/api/game/game-data/').json()

for card in game_data['data']['cards']:
    illustration = card['illustrationUrl']
    
    expansionId = card['expansion']['expansionId']
    collectionNumber = card['collectionNumber']
    name = card['name']
    rarity = card['rarity']
    
    with open(f"assets/image/cards-illustrations/{expansionId}-{collectionNumber}-{name}-{rarity}.png", 'wb') as f:
        f.write(get(illustration).content)

print('Done!')