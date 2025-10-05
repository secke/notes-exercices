# Notes App - Frontend

Application web moderne de gestion de notes construite avec React, TypeScript, Vite, et TailwindCSS.

## 🚀 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne et rapide
- **TailwindCSS** - Framework CSS utility-first
- **Zustand** - State management léger
- **React Router** - Navigation côté client
- **Axios** - Client HTTP
- **Vitest** - Framework de test
- **Testing Library** - Outils de test React

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

## 🔧 Configuration

1. Copier le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

2. Modifier les variables d'environnement dans `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🏃 Démarrage

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Preview du build de production
npm run preview
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests avec interface UI
npm run test:ui

# Tests E2E seulement
npm run test:e2e
```

## 📁 Structure du projet

```
web-frontend/
├── public/                  # Fichiers statiques
├── src/
│   ├── __tests__/          # Tests unitaires et E2E
│   ├── components/         # Composants réutilisables
│   ├── lib/                # Librairies (API client)
│   ├── pages/              # Pages de l'application
│   ├── store/              # State management Zustand
│   ├── test/               # Configuration des tests
│   ├── types/              # Types TypeScript
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html              # Template HTML
├── package.json            # Dépendances
├── tsconfig.json           # Config TypeScript
├── vite.config.ts          # Config Vite
└── vitest.config.ts        # Config Vitest
```

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription utilisateur
- ✅ Connexion / Déconnexion
- ✅ Protection des routes privées
- ✅ Persistance de session

### Gestion des notes
- ✅ Créer une note
- ✅ Modifier une note
- ✅ Supprimer une note
- ✅ Organiser par catégorie
- ✅ Ajouter des tags
- ✅ Recherche de notes
- ✅ Filtrage par catégorie

### Partage
- ✅ Partager une note avec un utilisateur
- ✅ Permissions de lecture/écriture
- ✅ Notes publiques avec lien unique
- ✅ Voir les notes partagées avec moi

## 🔐 Routes

- `/` - Redirection vers login
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Liste des notes (protégé)
- `/note/new` - Créer une note (protégé)
- `/note/:id` - Éditer une note (protégé)
- `/public/:publicId` - Vue publique d'une note

## 🎨 Composants principaux

### Pages
- **Login** - Authentification utilisateur
- **Register** - Création de compte
- **Dashboard** - Liste et filtres des notes
- **NoteEditor** - Création/édition de note
- **PublicNote** - Vue publique d'une note

### Composants
- **ProtectedRoute** - HOC pour routes protégées

### Stores
- **authStore** - Gestion de l'authentification
- **notesStore** - Gestion des notes et filtres

## 📝 API Client

Le client API est configuré dans `src/lib/api.ts` avec:
- Intercepteurs pour authentification automatique
- Gestion des erreurs globale
- Types TypeScript pour toutes les requêtes

## 🧩 State Management

Utilisation de Zustand pour un state management simple et performant:

```typescript
// Exemple d'utilisation
const { user, login, logout } = useAuthStore();
const { notes, fetchNotes, createNote } = useNotesStore();
```

## 🎨 Styles

TailwindCSS est utilisé pour tous les styles avec:
- Configuration personnalisée dans `tailwind.config.js`
- Classes utilitaires responsive
- Dark mode ready

## 🧪 Tests

### Tests unitaires
- Tests des composants Login et Dashboard
- Mocking des stores et API
- Testing Library pour interactions utilisateur

### Tests E2E
- Workflow complet: Register → Login → Create Note → Share
- Tests du happy path

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Le dossier dist/ contient les fichiers prêts pour le déploiement
```

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
