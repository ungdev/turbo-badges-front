# Guide d'optimisation des images avec next/image

## 📚 Introduction

Next.js fournit un composant `<Image>` qui optimise automatiquement les images :

- ✅ **Chargement lazy** : Les images se chargent uniquement quand elles entrent dans le viewport
- ✅ **Formats modernes** : Conversion automatique en WebP/AVIF
- ✅ **Responsive** : Génération de plusieurs tailles pour différents écrans
- ✅ **Prévention du Layout Shift** : Réserve l'espace avant le chargement
- ✅ **Optimisation automatique** : Compression et redimensionnement

## 🎯 Configuration (déjà fait)

Le fichier `next.config.ts` est configuré pour autoriser les images depuis l'API :

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https',
      hostname: '**', // En production, remplacer par votre domaine
      pathname: '/uploads/**',
    },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

## 🚀 Utilisation

### Images locales (depuis /public)

```tsx
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={200}
      height={100}
    />
  );
}
```

### Images distantes (depuis l'API)

```tsx
import Image from 'next/image';

function ProfilePicture({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Photo de profil"
      width={150}
      height={150}
      className="rounded-circle"
    />
  );
}
```

### Images avec dimensions inconnues (fill)

Pour les conteneurs avec dimensions définies :

```tsx
<div style={{ position: 'relative', width: '200px', height: '200px' }}>
  <Image
    src={photoUrl}
    alt="Photo"
    fill
    style={{ objectFit: 'cover' }}
    sizes="200px"
  />
</div>
```

### Images responsive

```tsx
<Image
  src={url}
  alt="Photo"
  width={500}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

## 📖 Props du composant Image

### Props requises

**Option 1 : Avec width/height**
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
/>
```

**Option 2 : Avec fill**
```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/image.jpg"
    alt="Description"
    fill
  />
</div>
```

### Props optionnelles

- `quality` : 1-100, défaut 75
- `priority` : Désactive le lazy loading (pour images above the fold)
- `placeholder` : 'blur' | 'empty'
- `loading` : 'lazy' | 'eager'
- `sizes` : Responsive breakpoints
- `style` : Styles CSS inline
- `className` : Classes CSS
- `onLoad` : Callback après chargement
- `onError` : Callback en cas d'erreur

## 🎨 Exemples d'utilisation

### Avatar circulaire

```tsx
function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      className="rounded-circle"
      style={{ objectFit: 'cover' }}
    />
  );
}
```

### Image de badge

```tsx
function BadgeImage({ filename }: { filename: string }) {
  const api = useApi();
  
  return (
    <Image
      src={api.badges.getBadgeImageUrl(filename)}
      alt="Badge"
      width={200}
      height={200}
      style={{ maxWidth: '200px', height: 'auto' }}
    />
  );
}
```

### Photo de profil avec fallback

```tsx
function ProfilePhoto({ user }: { user: User }) {
  const api = useApi();
  const [error, setError] = useState(false);

  if (error || !user.pictureFilename) {
    return (
      <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
           style={{ width: '150px', height: '150px' }}>
        {user.firstName[0]}{user.lastName[0]}
      </div>
    );
  }

  return (
    <Image
      src={api.users.getPictureUrl(user.pictureFilename)}
      alt={`${user.firstName} ${user.lastName}`}
      width={150}
      height={150}
      className="rounded-circle"
      style={{ objectFit: 'cover' }}
      onError={() => setError(true)}
    />
  );
}
```

### Galerie responsive

```tsx
function Gallery({ images }: { images: string[] }) {
  return (
    <div className="row g-3">
      {images.map((src, i) => (
        <div key={i} className="col-md-4">
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <Image
              src={src}
              alt={`Image ${i + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Image avec placeholder blur

```tsx
// Nécessite une image de base64 en placeholder
import placeholderImage from './placeholder.jpg';

<Image
  src={dynamicSrc}
  alt="Photo"
  width={500}
  height={300}
  placeholder="blur"
  blurDataURL={placeholderImage.blurDataURL}
/>
```

### Image prioritaire (above the fold)

```tsx
// Pour les images importantes visibles immédiatement
function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1920}
      height={1080}
      priority // Désactive le lazy loading
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

## ⚡ Optimisations automatiques

### Formats modernes

Next.js convertit automatiquement les images en :
- **AVIF** : 20% plus petit que WebP
- **WebP** : 25-35% plus petit que JPEG
- Fallback vers le format original si non supporté

### Tailles multiples

Next.js génère automatiquement plusieurs versions :
- 640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w, 3840w
- Le navigateur choisit la taille adaptée

### Compression

- Compression automatique des images
- Quality par défaut : 75 (bon compromis taille/qualité)
- Ajustable via la prop `quality`

## 🎯 Bonnes pratiques

### 1. Toujours spécifier alt

```tsx
// ✅ Bon
<Image src="/photo.jpg" alt="Description détaillée" width={200} height={200} />

// ❌ Mauvais
<Image src="/photo.jpg" alt="" width={200} height={200} />
```

### 2. Utiliser priority pour les images importantes

```tsx
// ✅ Images above the fold
<Image src="/hero.jpg" alt="Hero" width={1920} height={1080} priority />

// ❌ Toutes les images en priority (annule l'optimisation)
```

### 3. Définir sizes pour les images responsive

```tsx
// ✅ Bon
<Image
  src={src}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ⚠️ Acceptable mais moins optimal
<Image src={src} fill />
```

### 4. Utiliser objectFit pour contrôler le rendu

```tsx
// ✅ Cover : remplit le conteneur
<Image src={src} fill style={{ objectFit: 'cover' }} />

// ✅ Contain : image entière visible
<Image src={src} fill style={{ objectFit: 'contain' }} />

// ✅ None : taille originale
<Image src={src} fill style={{ objectFit: 'none' }} />
```

### 5. Gérer les erreurs de chargement

```tsx
const [imgSrc, setImgSrc] = useState(originalSrc);

<Image
  src={imgSrc}
  alt="Photo"
  width={200}
  height={200}
  onError={() => setImgSrc('/fallback.jpg')}
/>
```

## 🚫 Erreurs courantes

### Erreur : Image is missing required "alt" property

```tsx
// ❌ Mauvais
<Image src="/photo.jpg" width={200} height={200} />

// ✅ Bon
<Image src="/photo.jpg" alt="Description" width={200} height={200} />
```

### Erreur : Image with src "..." must use "width" and "height" properties or "fill" property

```tsx
// ❌ Mauvais
<Image src="/photo.jpg" alt="Photo" />

// ✅ Option 1
<Image src="/photo.jpg" alt="Photo" width={200} height={200} />

// ✅ Option 2
<div style={{ position: 'relative', width: '200px', height: '200px' }}>
  <Image src="/photo.jpg" alt="Photo" fill />
</div>
```

### Erreur : Invalid src prop on `next/image`, hostname "..." is not configured

```tsx
// Ajouter le hostname dans next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
    },
  ],
}
```

## 📊 Comparaison avant/après

| Critère | `<img>` | `<Image>` |
|---------|---------|-----------|
| Lazy loading | Manuel | ✅ Automatique |
| Formats modernes | ❌ Non | ✅ WebP/AVIF |
| Responsive | Manuel | ✅ Automatique |
| Layout Shift | ⚠️ Risque | ✅ Prévenu |
| Optimisation | ❌ Non | ✅ Automatique |
| Taille bundle | Petite | Légèrement plus grande |

## 🎓 Migration depuis <img>

**Avant**:
```tsx
<img
  src={photoUrl}
  alt="Photo"
  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
/>
```

**Après**:
```tsx
<Image
  src={photoUrl}
  alt="Photo"
  width={200}
  height={200}
  style={{ objectFit: 'cover' }}
/>
```

## 🔗 Resources

- [Documentation officielle Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- [Guide d'optimisation des images](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Image Component API Reference](https://nextjs.org/docs/app/api-reference/components/image)
