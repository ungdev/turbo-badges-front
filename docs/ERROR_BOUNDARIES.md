# Guide d'utilisation des Error Boundaries

## 📚 Introduction

Les Error Boundaries sont maintenant intégrés dans votre application. Ils attrapent automatiquement les erreurs React et affichent une interface de secours.

## 🎯 Utilisation

### 1. Protection globale (déjà configurée)

L'application entière est protégée via le `layout.tsx` :

```tsx
<ErrorBoundary>
  <AuthProvider>
    {/* Votre application */}
  </AuthProvider>
</ErrorBoundary>
```

### 2. Protection locale pour des sections spécifiques

Vous pouvez ajouter des Error Boundaries pour des sections critiques :

```tsx
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

function MyPage() {
  return (
    <div>
      <h1>Ma Page</h1>
      
      {/* Section critique protégée */}
      <ErrorBoundary>
        <CriticalComponent />
      </ErrorBoundary>
      
      {/* Le reste continue de fonctionner même si CriticalComponent crash */}
      <OtherComponent />
    </div>
  );
}
```

### 3. Avec un fallback personnalisé

```tsx
<ErrorBoundary 
  fallback={
    <div className="alert alert-warning">
      Ce module est temporairement indisponible.
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### 4. Avec un callback d'erreur

```tsx
<ErrorBoundary 
  onError={(error, errorInfo) => {
    // Envoyer à un service de monitoring
    console.error('Erreur capturée:', error);
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### 5. Pour les erreurs asynchrones et event handlers

Les Error Boundaries ne capturent PAS ces erreurs automatiquement. Utilisez le hook :

```tsx
'use client';

import { useErrorHandler } from '@/app/components/ErrorBoundary';

function MyComponent() {
  const throwError = useErrorHandler();

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // Propage l'erreur à l'Error Boundary
      throwError(error as Error);
    }
  };

  return <button onClick={handleClick}>Action risquée</button>;
}
```

## 🎨 Interface de secours

L'interface par défaut affiche :
- ✅ Un message user-friendly
- ✅ Un bouton "Réessayer"
- ✅ Un bouton "Retour à l'accueil"
- ✅ Détails techniques en développement uniquement
- ✅ Design Bootstrap cohérent avec votre app

## 🔍 En développement vs Production

### Développement
- Affiche les détails complets de l'erreur
- Stack trace visible
- Console logs actifs

### Production
- Message générique pour l'utilisateur
- Détails techniques cachés
- Erreurs loguées pour monitoring

## 📊 Monitoring (à venir)

Pour aller plus loin, intégrez un service de monitoring :

```tsx
// Dans ErrorBoundary.tsx, ligne 66
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Envoyer à Sentry, LogRocket, etc.
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}
```

## 🧪 Tester les Error Boundaries

Créez un composant de test :

```tsx
'use client';

function BuggyComponent({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error('Test Error Boundary');
  }
  return <div>Tout va bien !</div>;
}

// Dans votre page de test
<ErrorBoundary>
  <BuggyComponent shouldCrash={true} />
</ErrorBoundary>
```

## ✅ Bonnes pratiques

1. **Placez des Error Boundaries stratégiquement**
   - Au niveau de la route (déjà fait dans layout)
   - Autour des composants tiers
   - Autour des sections critiques

2. **Ne les utilisez pas partout**
   - Trop de boundaries = interface fragmentée
   - Préférez quelques boundaries bien placés

3. **Gérez les erreurs asynchrones manuellement**
   - Utilisez try/catch + useErrorHandler
   - Ou gérez avec des states d'erreur

4. **Loguez toujours les erreurs**
   - Utilise le logger centralisé
   - Préparez l'intégration monitoring

## 🚀 Exemple complet

```tsx
'use client';

import { ErrorBoundary, useErrorHandler } from '@/app/components/ErrorBoundary';
import { useState } from 'react';

function RiskyComponent() {
  const throwError = useErrorHandler();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Erreur API');
      const json = await res.json();
      setData(json);
    } catch (error) {
      throwError(error as Error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Charger</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}

// Dans votre page
export default function Page() {
  return (
    <ErrorBoundary>
      <h1>Ma Page</h1>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

## 📝 Notes importantes

- ❌ Les Error Boundaries ne fonctionnent pas dans les Server Components
- ✅ Utilisez toujours `'use client'` avec ErrorBoundary
- ✅ Les erreurs sont déjà loguées via le logger centralisé
- ✅ L'interface est responsive et accessible
