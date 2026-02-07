# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Ajouté ✨
- **API Client centralisé** : Interface unifiée pour toutes les communications avec l'API
  - Classe `ApiClient` avec gestion automatique de l'authentification
  - Modules typés pour chaque ressource : `auth`, `users`, `badges`, `lists`
  - Hook `useApi()` pour utilisation dans les composants React
  - Gestion automatique du refresh token en cas d'expiration
  - Erreurs typées avec `ApiError` pour une meilleure gestion
  - Logging intégré de toutes les requêtes
  - Documentation complète dans `docs/API_CLIENT.md`
- **Optimisation des images avec next/image** : Toutes les images utilisent maintenant le composant optimisé
  - Conversion automatique en WebP/AVIF
  - Lazy loading automatique
  - Responsive images avec plusieurs tailles générées
  - Prévention du Layout Shift
  - Configuration des domaines autorisés dans `next.config.ts`
  - Documentation complète dans `docs/IMAGE_OPTIMIZATION.md`
- **Error Boundary** : Protection globale de l'application contre les crashes React
  - Interface de secours user-friendly avec design Bootstrap
  - Détails techniques visibles uniquement en développement
  - Hook `useErrorHandler` pour propager les erreurs async/event handlers
  - Integration avec le logger centralisé
  - Documentation complète dans `docs/ERROR_BOUNDARIES.md`
- Système de logging centralisé (`lib/logger.ts`)
  - Logs désactivés en production pour éviter les fuites d'informations sensibles
  - Support pour différents niveaux de log (debug, info, warn, error)
  - Possibilité d'ajouter du contexte et des métadonnées
- Configuration centralisée des variables d'environnement (`lib/config/env.ts`)
  - Validation automatique au démarrage
  - Messages d'erreur explicites en cas de configuration manquante
  - Type-safety pour l'auto-complétion

### Corrigé 🐛
- **Bug critique** : Correction de la mutation du tableau `allowedRoles` dans le composant Guard qui causait des effets de bord
- **Bug critique** : Correction de l'appel direct au hook `useAuth()` dans le render du composant AdminPage

### Modifié 🔧
- Remplacement de tous les accès directs à `process.env.NEXT_PUBLIC_API_URL` par `env.apiUrl`
- Remplacement de tous les `console.log/warn/error` par le logger centralisé
- Amélioration du fichier `.env.example` avec documentation complète
- **Refactoring Providers** : Centralisation de tous les providers (ErrorBoundary, Auth, Notifications) dans un composant unique [`app/providers/Providers.tsx`](app/providers/Providers.tsx) pour une meilleure organisation

### Sécurité 🔒
- Les logs sont maintenant contrôlés et ne divulguent plus d'informations sensibles en production
- Validation des URLs pour éviter les configurations invalides
- Messages d'erreur sanitisés pour la production

## [0.1.0] - 2026-02-05

### Ajouté
- Version initiale de l'application TurboBadges
- Système d'authentification avec SIA et local
- Gestion des profils utilisateurs
- Génération de badges
- Interface d'administration
