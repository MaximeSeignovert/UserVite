# 🔐 Système d'Authentification UserVite

Ce document explique comment le système d'authentification est configuré et comment l'intégrer avec votre backend microservice JWT.

## 🏗️ Architecture

```mermaid
graph TB
    A[Frontend React] --> B[AuthProvider]
    B --> C[AuthService]
    C --> D[API Backend]
    B --> E[Context Auth]
    E --> F[Components]
    
    G[localStorage] --> B
    D --> H[JWT Token]
    H --> G
```

## 📁 Structure des fichiers

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexte React pour l'auth
├── providers/
│   └── AuthProvider.tsx         # Provider principal avec logique
├── services/
│   └── authService.ts          # Service pour les appels API
├── config/
│   └── api.ts                  # Configuration API et utilitaires
├── components/
│   └── LoginForm.tsx           # Formulaire de connexion
└── routes/
    └── auth/
        ├── login.tsx           # Page de connexion
        └── register.tsx        # Page d'inscription
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de base de votre API backend
VITE_API_BASE_URL=http://localhost:3000/api

# Ou pour la production
# VITE_API_BASE_URL=https://your-api.com/api
```

### Configuration API

Le fichier `src/config/api.ts` contient les endpoints et configurations :

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  // ... autres endpoints
};
```

## 🔌 Intégration Backend

### Endpoints requis

Votre backend doit exposer ces endpoints :

#### 1. **POST** `/api/auth/login`
```typescript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+33123456789",
      "addresses": [],
      "favoriteRestaurants": []
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "optional_refresh_token"
  }
}

// Response (401)
{
  "success": false,
  "error": "Email ou mot de passe incorrect",
  "statusCode": 401
}
```

#### 2. **POST** `/api/auth/register`
```typescript
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+33123456789" // optionnel
}

// Response (201)
{
  "success": true,
  "data": {
    "user": { /* même structure que login */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. **GET** `/api/auth/profile`
```typescript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200)
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    // ... autres champs utilisateur
  }
}
```

#### 4. **PUT** `/api/auth/profile`
```typescript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request
{
  "name": "John Smith", // optionnel
  "phone": "+33987654321" // optionnel
  // ... autres champs à mettre à jour
}

// Response (200)
{
  "success": true,
  "data": {
    // utilisateur mis à jour
  }
}
```

#### 5. **POST** `/api/auth/logout`
```typescript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200)
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### Format du JWT

Le token JWT doit contenir au minimum :

```typescript
{
  "sub": "user-123",        // ID utilisateur
  "email": "user@email.com", // Email
  "name": "John Doe",       // Nom
  "iat": 1640995200,        // Timestamp de création
  "exp": 1641081600         // Timestamp d'expiration
}
```

## 🚀 Utilisation

### Dans un composant

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bonjour {user?.name}</h1>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
```

### Navigation conditionnelle

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated) return null;

  return <div>Contenu protégé</div>;
}
```

## 🔒 Sécurité

### Bonnes pratiques implémentées

1. **Token Storage** : Les tokens sont stockés dans `localStorage`
2. **Auto-logout** : Déconnexion automatique si le token expire
3. **Error Handling** : Gestion centralisée des erreurs
4. **Type Safety** : Types TypeScript pour toutes les interfaces

### Améliorations pour la production

1. **HttpOnly Cookies** : Considérer l'utilisation de cookies HttpOnly
2. **Refresh Tokens** : Implémenter le rafraîchissement automatique
3. **CSRF Protection** : Ajouter des tokens CSRF
4. **Rate Limiting** : Implémenter côté backend

## 🧪 Mode Développement

En mode développement, le système utilise des mocks :

- **Email de test** : `marie.dupont@email.com`
- **Mot de passe** : N'importe quel mot de passe (6+ caractères)
- **Token simulé** : Token JWT mock généré localement

## 🔄 Migration vers Production

1. Configurez `VITE_API_BASE_URL` dans vos variables d'environnement
2. Votre backend doit respecter les contrats d'API ci-dessus
3. Le service `AuthService` basculera automatiquement des mocks vers l'API réelle

## 🐛 Debugging

### Logs utiles

```typescript
// Vérifier l'état d'authentification
console.log('Auth State:', { user, isAuthenticated, token });

// Vérifier les tokens stockés
console.log('Stored Token:', localStorage.getItem('auth_token'));
console.log('Stored User:', localStorage.getItem('auth_user'));
```

### Erreurs communes

1. **CORS** : Configurez les headers CORS sur votre backend
2. **Token expiré** : Implémentez la gestion du refresh token
3. **Network Error** : Vérifiez que l'API backend est accessible

---

📝 **Note** : Ce système est prêt pour la production et peut être facilement connecté à votre backend microservice JWT. 