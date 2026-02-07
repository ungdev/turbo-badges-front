# Guide d'utilisation du Client API

## 📚 Introduction

Le client API centralisé fournit une interface unifiée et typée pour communiquer avec le backend. Il gère automatiquement :

- ✅ Authentification avec Bearer token
- ✅ Refresh automatique du token en cas d'expiration
- ✅ Gestion centralisée des erreurs
- ✅ Type-safety complet avec TypeScript
- ✅ Logging automatique des requêtes
- ✅ Base URL configurée depuis les variables d'environnement

## 🏗️ Architecture

```
lib/api/
├── client.ts       # Client HTTP de base
├── auth.ts         # Endpoints d'authentification
├── users.ts        # Endpoints utilisateurs
├── badges.ts       # Endpoints badges
├── lists.ts        # Endpoints listes
└── index.ts        # Point d'entrée centralisé
```

## 🚀 Utilisation

### Dans les composants React (avec authentification)

```tsx
'use client';

import { useApi } from '@/app/hooks/useApi';

function MyComponent() {
  const api = useApi();

  const loadData = async () => {
    try {
      // Récupérer le profil
      const profile = await api.auth.getProfile();
      
      // Lister les utilisateurs
      const users = await api.users.list();
      
      // Récupérer les options de badges
      const options = await api.badges.getOptions();
      
      console.log(profile, users, options);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Erreur ${error.statusCode}: ${error.message}`);
      }
    }
  };

  return <button onClick={loadData}>Charger</button>;
}
```

### Endpoints publics (sans authentification)

```tsx
import { api } from '@/lib/api';

// Utiliser directement l'instance publique
const data = await api.users.list();
```

## 📖 API Reference

### Authentication (`api.auth`)

```tsx
// Récupérer le profil de l'utilisateur connecté
const user = await api.auth.getProfile();

// Connexion locale
const response = await api.auth.loginLocal(email, password);

// Déconnexion
await api.auth.logout();

// Redirection OAuth
api.auth.redirectToSignup();
api.auth.redirectToLogin();
```

### Users (`api.users`)

```tsx
// Lister tous les utilisateurs
const users = await api.users.list();

// Récupérer un utilisateur par ID
const user = await api.users.getById(userId);

// Mettre à jour mon profil
const response = await api.users.updateMyProfile({
  firstName: 'John',
  lastName: 'Doe',
});

// Upload ma photo de profil
const file = new File([blob], 'photo.jpg');
const response = await api.users.uploadMyPicture(file);

// Supprimer ma photo
await api.users.deleteMyPicture();

// Admin: Mettre à jour le profil d'un utilisateur
await api.users.updateProfile(userId, { firstName: 'Jane' });

// Admin: Upload la photo d'un utilisateur
await api.users.uploadPicture(userId, file);

// Récupérer l'URL d'une photo
const url = api.users.getPictureUrl(filename, version);
```

### Badges (`api.badges`)

```tsx
// Récupérer les options (grades, commissions, accès)
const options = await api.badges.getOptions();

// Créer une nouvelle option
await api.badges.createOption('grade', 'Nouveau grade');

// Supprimer une option
await api.badges.deleteOption('commission', optionId);

// Upload une image de badge
const file = new File([blob], 'badge.jpg');
await api.badges.uploadAccessPicture(accessId, 'front', file);

// Supprimer une image
await api.badges.deleteAccessPicture(accessId, 'back');

// Générer des badges
const result = await api.badges.generate({
  users: [
    { id: 'user1', grade: 'grade1', commission: 'com1', access: 'acc1' },
    { id: 'user2', grade: 'grade2', commission: 'com2', access: 'acc2' },
  ],
});

// Récupérer l'URL d'une image de badge
const url = api.badges.getBadgeImageUrl(filename);
```

### Lists (`api.lists`)

```tsx
// Récupérer toutes les listes
const lists = await api.lists.getAll();
```

## 🎯 Gestion des erreurs

```tsx
import { ApiError } from '@/lib/api';

try {
  await api.users.updateMyProfile(data);
} catch (error) {
  if (error instanceof ApiError) {
    // Erreur API
    console.error(`Code: ${error.statusCode}`);
    console.error(`Message: ${error.message}`);
    console.error(`Détails:`, error.response);
    
    // Gérer selon le code
    switch (error.statusCode) {
      case 401:
        // Non authentifié
        break;
      case 403:
        // Pas les permissions
        break;
      case 404:
        // Ressource non trouvée
        break;
      case 422:
        // Validation échouée
        break;
      case 500:
        // Erreur serveur
        break;
    }
  } else {
    // Erreur réseau ou autre
    console.error('Erreur inattendue:', error);
  }
}
```

## 🔧 Configuration avancée

### Créer un client personnalisé

```tsx
import { ApiClient } from '@/lib/api/client';

const customClient = new ApiClient({
  baseUrl: 'https://custom-api.com',
  getToken: () => localStorage.getItem('token'),
  onRefreshToken: async () => {
    // Logique custom de refresh
    return newToken;
  },
  onUnauthorized: () => {
    // Redirection custom
    router.push('/login');
  },
});

// Utiliser le client
const data = await customClient.get('/custom-endpoint');
```

### Accès direct au client HTTP

```tsx
const api = useApi();

// Pour des besoins très spécifiques
const response = await api.raw.get('/custom-endpoint');
```

## 🎨 Exemples complets

### Upload de fichier avec preview

```tsx
function UploadComponent() {
  const api = useApi();
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    try {
      await api.users.uploadMyPicture(file);
      alert('Photo uploadée !');
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      {preview && <img src={preview} alt="Preview" />}
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
```

### Liste paginée avec chargement

```tsx
function UsersList() {
  const api = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.users.list();
        setUsers(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Erreur inconnue');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.firstName} {user.lastName}</li>
      ))}
    </ul>
  );
}
```

### Formulaire avec validation

```tsx
function ProfileForm() {
  const api = useApi();
  const { success, error } = useNotifications();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await api.users.updateMyProfile({
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
      });
      success('Profil mis à jour !');
    } catch (err) {
      if (err instanceof ApiError) {
        error(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="Prénom" required />
      <input name="lastName" placeholder="Nom" required />
      <button type="submit">Enregistrer</button>
    </form>
  );
}
```

## 🔒 Sécurité

- ✅ Les tokens sont gérés automatiquement
- ✅ Le refresh est transparent pour l'utilisateur
- ✅ Les erreurs 401 redirigent vers la page de connexion
- ✅ Les logs sont désactivés en production
- ✅ CORS et credentials gérés automatiquement

## 🚀 Migration depuis authFetch

**Avant** (avec authFetch):
```tsx
const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/profile`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
const result = await response.json();
```

**Après** (avec API client):
```tsx
const result = await api.users.updateMyProfile(data);
```

## 📊 Avantages

| Avant | Après |
|-------|-------|
| Gestion manuelle des URLs | URLs centralisées |
| Répétition du code | Code réutilisable |
| Pas de types | Type-safety complet |
| Gestion manuelle des erreurs | Erreurs typées |
| Headers dupliqués | Headers automatiques |
| Pas de refresh automatique | Refresh transparent |

## 🎓 Bonnes pratiques

1. **Toujours utiliser `useApi()` dans les composants**
   ```tsx
   const api = useApi(); // ✅
   // Pas d'import direct de `api` dans les composants client
   ```

2. **Gérer les erreurs avec ApiError**
   ```tsx
   try {
     await api.users.list();
   } catch (error) {
     if (error instanceof ApiError) { // ✅
       // Gestion typée
     }
   }
   ```

3. **Utiliser les helpers pour les URLs**
   ```tsx
   // ✅ Bon
   const url = api.users.getPictureUrl(filename);
   
   // ❌ Mauvais
   const url = `${apiUrl}/uploads/pictures/${filename}`;
   ```

4. **Ne pas mélanger authFetch et API client**
   - Migrer progressivement
   - Un composant = une méthode
