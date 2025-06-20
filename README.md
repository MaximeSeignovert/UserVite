# UberEats Clone

Une reproduction de l'application UberEats développée avec React, TypeScript et TanStack Router.

## 🚀 Fonctionnalités

- **Navigation des restaurants** : Parcourir une liste de restaurants avec des informations détaillées
- **Système de filtrage avancé** : Filtrer par cuisine, note, temps de livraison, options végétariennes
- **Menu des restaurants** : Voir le menu complet avec catégories et détails des plats
- **Panier interactif** : Ajouter/supprimer des articles, gérer les quantités
- **Recherche** : Rechercher des restaurants ou des plats
- **Interface responsive** : Adaptée aux mobiles et ordinateurs de bureau

## 🛠️ Technologies utilisées

- **React 19** avec TypeScript
- **TanStack Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Vite** comme bundler

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── RestaurantCard.tsx
│   ├── MenuItemCard.tsx
│   ├── Cart.tsx
│   ├── Header.tsx
│   └── FilterBar.tsx
├── hooks/              # Hooks personnalisés
│   └── useCart.ts
├── types/              # Définitions TypeScript
│   └── index.ts
├── data/               # Données fictives
│   └── mockData.ts
└── routes/             # Pages de l'application
    ├── index.tsx       # Page d'accueil
    └── restaurant.$restaurantId.tsx
```

## 🎯 Types TypeScript

L'application utilise des types bien définis pour assurer la sécurité du code :

### Types principaux

- **Restaurant** : Informations du restaurant (nom, description, note, etc.)
- **MenuItem** : Détails des plats (prix, allergènes, options végétariennes)
- **CartItem** : Articles dans le panier avec quantités
- **Order** : Commandes avec statut et historique
- **User** : Profil utilisateur et adresses
- **SearchFilters** : Critères de filtrage

### Enums et types union

- **OrderStatus** : États des commandes
- **CuisineType** : Types de cuisine disponibles

## 🗂️ Données fictives

L'application utilise des données fictives (`mockData.ts`) comprenant :

- 6 restaurants avec différents types de cuisine
- Menus détaillés pour chaque restaurant
- Profil utilisateur avec adresses
- Images provenant d'Unsplash

## 🚀 Installation et lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build pour la production
npm run build
```

## 📱 Pages de l'application

### Page d'accueil (`/`)
- Liste des restaurants
- Barre de recherche
- Filtres avancés
- Panier latéral

### Page restaurant (`/restaurant/:id`)
- Détails du restaurant
- Menu complet avec catégories
- Ajout au panier
- Filtres par catégorie

## 🛒 Fonctionnalités du panier

- Ajout/suppression d'articles
- Modification des quantités
- Calcul automatique des totaux
- Gestion des instructions spéciales
- Calcul des taxes et frais de livraison

## 🎨 Design et UX

- Interface moderne inspirée d'UberEats
- Design responsive (mobile-first)
- Animations fluides
- États visuels clairs (ouvert/fermé, populaire, végétarien)
- Feedback utilisateur approprié

## 🔮 Améliorations futures possibles

- Authentification utilisateur
- Gestion des commandes en temps réel
- Intégration de cartes pour la localisation
- Système de paiement
- Notifications push
- Mode sombre
- Tests unitaires et d'intégration
- API backend complète

## 📄 Licence

Ce projet est créé à des fins éducatives et de démonstration.
