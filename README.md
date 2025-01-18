# Sélecteur de Boosters Pokémon

Une application web permettant de calculer les meilleurs boosters à acheter en fonction des cartes Pokémon souhaitées.

## 📋 Description

Cette application aide les joueurs de Pokémon-pocket à optimiser leurs achats de boosters en calculant les taux de drop des cartes désirées en fonction du coût en poussière de chaque carte.

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/pokemon-booster-selector.git
cd pokemon-booster-selector
```

2. Ouvrez `index.html` dans votre navigateur ou utilisez un serveur local (recommandé) :
```bash
python -m http.server
# ou
npx live-server
```

## 🛠 Fonctionnalités

- Affichage des cartes disponibles avec leurs illustrations
- Sélection multiple de cartes via des cases à cocher
- Calcul automatique des taux de drop par booster
- Classement des boosters par efficacité

## 📁 Structure du Projet

```
pokemon-booster-selector/
├── assets/
│   ├── data/
│   │   ├── game-data.json
│   │   └── offering-rates.json
│   └── images/
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── app.js
│   └── ui.js
└── index.html
```

## 🔧 Technologies Utilisées

- HTML5
- CSS3
- JavaScript (ES6+)

## 📝 License

MIT License
