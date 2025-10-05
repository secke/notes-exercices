# 📝 Notes Collaboratives - Application complète de gestion de notes

Application full-stack de gestion de notes avec **synchronisation hors ligne**, développée avec Spring Boot, React et React Native.

---

## 🏗️ Architecture du projet

```
notes-exercices/
├── backend-spring/      # API REST Spring Boot + PostgreSQL
├── web-frontend/        # Application web React + Vite + TypeScript
└── mobile-app/          # Application mobile React Native + Expo
```

### Stack technique

| Composant | Technologies |
|-----------|-------------|
| **Backend** | Spring Boot 3, PostgreSQL, JWT, Docker |
| **Web** | React 18, TypeScript, Vite, TailwindCSS, Zustand |
| **Mobile** | React Native, Expo Router, Offline-first |

---

## 🚀 Démarrage

### Prérequis

- **Node.js** 18+ et npm
- **Java** 17+
- **PostgreSQL** 15+ (ou Docker)
- **Maven** 3.8+


#### 1️⃣ Backend API

### Option 1 : Avec Docker (recommandé)

```bash
# Lancer le backend + PostgreSQL
cd docker
docker compose up -d

# Le backend sera accessible sur http://localhost:8080
```

### Option 2 : Installation manuelle
```bash
cd backend-spring
./mvnw spring-boot:run
```

**Documentation complète** : [backend-spring/README.md](./backend-spring/README.md)

#### 2️⃣ Frontend Web

```bash
cd web-frontend
npm install
npm run dev
```

**Accès** : http://localhost:3000

**Documentation complète** : Voir `web-frontend/src/README.md`

#### 3️⃣ Application Mobile

```bash
cd mobile-app
npm install
npm start

# Puis choisir :
# - 'w' pour Web
# - 'a' pour Android
# - 'i' pour iOS (macOS uniquement)
```

**Documentation complète** : [mobile-app/README.md](./mobile-app/README.md)

---

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Inscription et connexion sécurisées
- Tokens JWT (Access + Refresh)
- Session persistante

### 📝 Gestion des notes
- Éditeur Markdown avec prévisualisation en temps réel
- Tags et catégories
- Recherche et filtres avancés
- Mode hors ligne (mobile)

### 👥 Partage et collaboration
- Partage de notes avec d'autres utilisateurs
- Liens publics avec expiration
- Permissions de lecture/écriture

### 📱 Synchronisation offline (mobile)
- Création et édition hors ligne
- Synchronisation automatique au retour de connexion
- Indicateur d'opérations en attente

---

## 📊 Endpoints API principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/v1/auth/register` | POST | Inscription |
| `/api/v1/auth/login` | POST | Connexion |
| `/api/v1/notes` | GET | Liste des notes |
| `/api/v1/notes/{id}` | GET/PUT/DELETE | CRUD note |
| `/api/v1/shares` | GET/POST | Partage de notes |
| `/api/v1/public/notes/{token}` | GET | Note publique |

---

## 🧪 Tests

### Backend
```bash
cd backend-spring
./mvnw test
```

### Frontend Web
```bash
cd web-frontend
npm test
```

---

## 🔧 Configuration

### Variables d'environnement

#### Backend (`backend-spring/.env`)
```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=`secret-key généré aléatoirement par cette commande: openssl rand -base64 256`
```

#### Frontend Web (`web-frontend/.env`)
```properties
VITE_API_URL=http://localhost:8080
```

#### Mobile (`mobile-app/lib/api.ts`)
Les URLs sont détectées automatiquement selon la plateforme :
- **Android Emulator** : `http://10.0.2.2:8080`
- **iOS Simulator** : `http://localhost:8080`
- **Web** : `http://localhost:8080`

---

## 📚 Documentation détaillée

Pour plus d'informations sur chaque composant :

- **Backend API** : [backend-spring/README.md](./backend-spring/README.md)
- **Frontend Web** : [web-frontend/README.md](./web-frontend/README.md)
- **Application Mobile** : [mobile-app/README.md](./mobile-app/README.md)
