# 📱 Notes App - Application Mobile

Application mobile de gestion de notes avec **synchronisation hors ligne** développée avec React Native et Expo.

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18+ et npm
- **Backend API** en cours d'exécution sur le port 8080
- Pour Android : **Android Studio** avec un émulateur
- Pour iOS : **Xcode** (macOS uniquement)

### Installation

```bash
# Cloner le projet (si ce n'est pas déjà fait)
git clone https://github.com/secke/notes-exercices.git

cd notes-exercices/mobile-app


# Installer les dépendances
npm install
```

---

## 🎯 Lancer l'application

### 1️⃣ Démarrer le serveur Metro

```bash
npm start
```

Après le lancement, vous verrez un menu interactif :

```
› Press w │ open web
› Press a │ open Android
› Press i │ open iOS (macOS uniquement)
```

### 2️⃣ Choisir votre plateforme

#### 🌐 **Web** (navigateur)
Appuyez sur **`w`** ou lancez :
```bash
npm run web
```
→ L'app s'ouvre sur **http://localhost:8081**

#### 🤖 **Android** (émulateur ou appareil)
Appuyez sur **`a`** ou lancez :
```bash
npm run android
```
→ Assurez-vous qu'un émulateur Android est lancé

#### 🍎 **iOS** (macOS uniquement)
Appuyez sur **`i`** ou lancez :
```bash
npm run ios
```

---

## ⚙️ Configuration du backend

L'application mobile se connecte au backend Spring Boot. Assurez-vous que le backend est en cours d'exécution :

```bash
cd ../backend-spring
./mvnw spring-boot:run

ou avec docker 
cd docker && docker compose up -d
```

Le backend doit être accessible sur :
- **Web** : `http://localhost:8080`
- **Android Emulator** : `http://10.0.2.2:8080`
- **iOS Simulator** : `http://localhost:8080`

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion
- Token JWT stocké de manière sécurisée (AsyncStorage)
- Session persistante

### 📝 Gestion des notes
- ✅ Créer, modifier, supprimer des notes
- ✅ Éditeur Markdown avec prévisualisation
- ✅ Tags et catégories
- ✅ Recherche et filtres

### 📡 Mode hors ligne (Offline-first)
- ✅ **Synchronisation automatique** : Les notes sont sauvegardées localement puis synchronisées avec le serveur
- ✅ **Indicateur de statut** : Affichage du nombre d'opérations en attente de synchronisation
- ✅ **Mode hors ligne** : Créez et modifiez des notes même sans connexion internet
- ✅ **Auto-sync** : Synchronisation automatique au retour de la connexion

### 👥 Partage
- Consultation des notes partagées avec vous
- Consultation des liens publics (gestion complète sur le web)

---

## 📂 Structure du projet

```
mobile-app/
├── app/                    # Écrans Expo Router
│   ├── (auth)/            # Login, Register
│   ├── (tabs)/            # Notes list, Note editor
│   ├── _layout.tsx        # Layout racine
│   └── index.tsx          # Point d'entrée (redirection)
├── lib/
│   ├── api.ts             # Client API Axios
│   ├── storage.ts         # Cache local AsyncStorage
│   └── sync.ts            # Service de synchronisation offline
├── store/
│   ├── authStore.ts       # Zustand store auth
│   └── notesStore.ts      # Zustand store notes + sync
├── types/
│   └── index.ts           # Types TypeScript
├── app.json               # Config Expo
├── package.json
└── tsconfig.json
```

---

## 🔧 Résolution de problèmes

### ❌ Erreur : Port 8081 déjà utilisé

```bash
# Trouver le processus utilisant le port
lsof -ti:8081

# Arrêter nginx si nécessaire
sudo systemctl stop nginx

# Ou lancer Expo sur un autre port
REACT_NATIVE_PACKAGER_PORT=8082 npm start
```

### ❌ Erreur de connexion au backend (Android)

Vérifiez que l'URL API utilise `10.0.2.2` et non `localhost` dans `lib/api.ts` :

```typescript
// Android Emulator
return 'http://10.0.2.2:8080/api';
```

### ❌ Les notes ne se synchronisent pas

1. Vérifiez que le backend est accessible
2. Vérifiez votre token JWT dans AsyncStorage
3. Consultez les logs Metro pour les erreurs réseau

### ❌ Dépendances manquantes

```bash
# Réinstaller toutes les dépendances
rm -rf node_modules package-lock.json
npm install
```

---

## 🧪 Tests et développement

### Recharger l'application
- **Android/iOS** : Appuyez sur **`r`** dans le terminal Metro
- **Web** : Rechargez la page du navigateur

### Mode développement
- **Menu développeur** : Appuyez sur **`m`** dans Metro
- **Debugger** : Appuyez sur **`j`** pour ouvrir le debugger

### Logs
```bash
# Voir les logs en temps réel
npm start
# Les logs s'affichent automatiquement dans le terminal
```