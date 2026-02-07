This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# TurboBadges Front

Application Next.js pour la génération et la gestion de badges.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- npm / yarn / pnpm / bun

### Installation

```bash
# Cloner le projet
git clone https://github.com/ungdev/turbo-badges-front.git
cd turbo-badges-front

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Lancer le serveur de développement
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🏗️ Architecture

```
turbo-badges-front/
├── app/                    # Pages et routes Next.js
│   ├── components/        # Composants React réutilisables
│   ├── context/          # Contextes React (Auth, Notifications)
│   ├── providers/        # Providers React
│   ├── types/            # Types TypeScript
│   ├── admin/            # Pages d'administration
│   ├── auth/             # Pages d'authentification
│   └── profile/          # Page de profil
├── lib/                   # Librairies et utilitaires
│   ├── config/           # Configuration centralisée
│   └── logger.ts         # Logger centralisé
├── docs/                  # Documentation
└── public/               # Fichiers statiques
```

## ✨ Fonctionnalités

- 🔐 **Authentification** : SIA OAuth + connexion locale
- 👤 **Gestion des profils** : Upload photo, édition
- 🎫 **Génération de badges** : Interface de sélection et génération
- 👥 **Administration** : Gestion des utilisateurs et options
- 🛡️ **Error Boundaries** : Protection contre les crashes
- 📊 **Logging centralisé** : Désactivé automatiquement en production
- ⚙️ **Configuration validée** : Variables d'environnement avec validation
- 🚀 **API Client typé** : Interface unifiée pour les appels API
- 🖼️ **Images optimisées** : Utilisation de next/image pour performances maximales

## 💻 Utilisation du Client API

Le projet utilise un client API centralisé pour toutes les communications avec le backend :

```tsx
import { useApi } from '@/app/hooks/useApi';

function MyComponent() {
  const api = useApi();

  const loadData = async () => {
    // Liste des utilisateurs
    const users = await api.users.list();
    
    // Profil utilisateur
    const profile = await api.auth.getProfile();
    
    // Options de badges
    const options = await api.badges.getOptions();
  };

  return <button onClick={loadData}>Charger</button>;
}
```

Voir [`docs/API_CLIENT.md`](docs/API_CLIENT.md) pour plus d'exemples et [`app/components/ApiClientExamples.tsx`](app/components/ApiClientExamples.tsx) pour des cas d'usage complets.

## 📚 Documentation

- [API Client](docs/API_CLIENT.md) - Guide d'utilisation du client API centralisé
- [Image Optimization](docs/IMAGE_OPTIMIZATION.md) - Guide d'optimisation des images avec next/image
- [Error Boundaries](docs/ERROR_BOUNDARIES.md) - Guide d'utilisation des Error Boundaries
- [CHANGELOG](CHANGELOG.md) - Historique des modifications

## 🔧 Configuration

### Variables d'environnement

Voir [`.env.example`](.env.example) pour la liste complète des variables.

**Requis** :
- `NEXT_PUBLIC_API_URL` : URL de l'API backend

## 🧪 Tests

Pour tester les Error Boundaries :

```bash
# Le composant de test est disponible dans
# app/components/ErrorBoundary.test.tsx
# 
# Créez une route /test-error pour l'utiliser
```

## 🏗️ Build

```bash
# Build de production
npm run build

# Lancer la version de production
npm run start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.