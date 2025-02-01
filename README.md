# Pokémon Pocket Pack Selector

Une application web qui calcule le score de chaque booster en fonction des cartes souhaitées.

## 📋 Description

Cette application aide les joueurs de Pokémon Pocket à optimiser leurs achats de boosters en :
- Calculant les taux de drop des cartes souhaitées
- Prenant en compte le coût en poussière des cartes
- Affichant des statistiques détaillées sur la collection
- Proposant une interface intuitive pour la sélection des cartes

## 🚀 Utilisation

1. Accédez à https://aarensberg.github.io/pokemon-pocket-pack-selector/
2. Parcourez et sélectionnez les cartes que vous souhaitez obtenir
3. Utilisez les filtres pour rechercher des cartes spécifiques :
   - Par nom
   - Par extension
   - Par numéro de carte
4. Cliquez sur "Calculate scores" pour voir les résultats détaillés

## 🛠 Fonctionnalités

### Interface principale
- Affichage organisé des cartes par extension
- Système de filtrage dynamique des cartes
- Sélection individuelle ou groupée des cartes
- Navigation par extension avec liens d'ancrage
- Tooltip détaillé pour chaque carte

### Statistiques de collection
- Vue d'ensemble de la progression par extension
- Statistiques détaillées par rareté
- Calcul des pourcentages de complétion
- Visualisation avec barres de progression

### Calcul des boosters
- Analyse des taux de drop par booster
- Prise en compte du coût en poussière
- Classement des boosters par efficacité
- Affichage des scores dans une nouvelle fenêtre

## 🔧 Technologies utilisées

- HTML5 : Structure de l'application
- CSS3 : Mise en page et animations
- JavaScript (ES6+) :
  - Classes et modules
  - Async/Await pour les requêtes
  - Manipulation avancée du DOM
  - Gestion d'événements

## 📁 Structure du projet

```
pokemon-booster-selector/
├── assets/
│   ├── data/
│   │   └── cards.json        # Données des cartes
│   └── image/                # Images des cartes et icônes
├── css/
│   └── style.css             # Styles de l'application
├── js/
│   ├── app.js                # Logique métier et calculs
│   └── ui.js                 # Interface utilisateur
└── index.html                # Page principale
```

## 📝 License

MIT License