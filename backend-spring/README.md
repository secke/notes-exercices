# API Notes - Backend Spring Boot

Une API RESTful pour une application de notes collaborative construite avec Spring Boot, PostgreSQL et authentification JWT.

## Fonctionnalités

- 🔐 **Authentification JWT** - Inscription et connexion sécurisées
- 📝 **Gestion des Notes** - Créer, lire, modifier et supprimer des notes
- 🏷️ **Tags** - Organiser les notes avec des étiquettes
- 👥 **Partage** - Partager des notes avec d'autres utilisateurs
- 🔗 **Liens Publics** - Générer des liens publics partageables pour les notes
- 🔍 **Recherche & Filtres** - Rechercher des notes par titre, tags et visibilité
- 📄 **Pagination** - Récupération efficace des données avec pagination

## Stack Technique

- **Java 17**
- **Spring Boot 3.5.6**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **PostgreSQL 16**
- **Lombok**
- **SpringDoc OpenAPI** (Swagger)
- **Docker & Docker Compose**

## Prérequis

- Docker et Docker Compose installés sur votre système
- Pas besoin de Java ou Maven en local (s'exécute dans des conteneurs)

## Démarrage Rapide avec Docker

### 1. Cloner le Dépôt

```bash
git clone https://github.com/secke/notes-exercices.git
cd notes-exercices
```

### 2. Démarrer Tous les Services

```bash
cd docker
docker compose up -d
```

Cela démarrera :
- La base de données **PostgreSQL** sur le port `5433`
- L'**API Spring Boot** sur le port `8080`
- Le serveur web **Nginx** sur le port `8081`

### 3. Vérifier que les Services Fonctionnent

Vérifier l'état des conteneurs :
```bash
docker compose ps
```

Vérifier la santé de l'API :
```bash
curl http://localhost:8080/actuator/health
```

Réponse attendue :
```json
{"status":"UP"}
```

### 4. Accéder à l'API

- **URL de base de l'API** : http://localhost:8080
- **Interface Swagger** : http://localhost:8080/swagger-ui.html
- **Documentation API (JSON)** : http://localhost:8080/api-docs

## Points de Terminaison de l'API

### Authentification

- `POST /api/v1/auth/register` - Enregistrer un nouvel utilisateur
- `POST /api/v1/auth/login` - Connecter un utilisateur
- `POST /api/v1/auth/refresh` - Rafraîchir le token d'accès

### Notes

- `GET /api/v1/notes` - Lister/rechercher des notes (avec pagination)
- `GET /api/v1/notes/{id}` - Obtenir une note par ID
- `POST /api/v1/notes` - Créer une nouvelle note
- `PUT /api/v1/notes/{id}` - Mettre à jour une note
- `DELETE /api/v1/notes/{id}` - Supprimer une note

### Partage

- `POST /api/v1/notes/{noteId}/share/user` - Partager une note avec un utilisateur
- `DELETE /api/v1/notes/shares/{shareId}` - Supprimer l'accès d'un utilisateur
- `POST /api/v1/notes/{noteId}/share/public` - Générer un lien public
- `DELETE /api/v1/public-links/{linkId}` - Révoquer un lien public
- `GET /p/{urlToken}` - Accéder à une note publique (sans authentification)

## Exemples d'Utilisation

### 1. Enregistrer un Utilisateur

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123"
  }'
```

Réponse :
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "email": "utilisateur@exemple.com",
    "createdAt": "2025-10-04T20:00:00"
  }
}
```

### 2. Créer une Note

```bash
TOKEN="votre-token-d-acces-ici"

curl -X POST http://localhost:8080/api/v1/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ma Première Note",
    "contentMd": "# Bonjour le Monde\nCeci est ma première note!",
    "tags": ["tutoriel", "test"]
  }'
```

### 3. Lister les Notes

```bash
curl -X GET "http://localhost:8080/api/v1/notes?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Variables d'Environnement

Les variables d'environnement suivantes peuvent être configurées dans `docker/docker-compose.yml` :

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DB_HOST` | Hôte de la base de données | `db` |
| `DB_PORT` | Port de la base de données | `5432` |
| `DB_NAME` | Nom de la base de données | `notesdb` |
| `DB_USER` | Utilisateur de la base de données | `notesuser` |
| `DB_PASSWORD` | Mot de passe de la base de données | `notespass` |
| `JWT_SECRET` | Secret de signature JWT | (auto-généré) |
| `CORS_ORIGINS` | Origines CORS autorisées | `http://localhost:3000,http://localhost:8081` |

## Développement

### Exécution Locale (sans Docker)

1. **Démarrer PostgreSQL** :
   ```bash
   docker run -d \
     -p 5432:5432 \
     -e POSTGRES_DB=notesdb \
     -e POSTGRES_USER=notesuser \
     -e POSTGRES_PASSWORD=notespass \
     postgres:16-alpine
   ```

2. **Exécuter l'application** :
   ```bash
   cd backend-spring
   ./mvnw spring-boot:run
   ```

### Exécuter les Tests

```bash
cd backend-spring
./mvnw test
```

Ou avec Docker :
```bash
docker run --rm -v $(pwd):/app -w /app maven:3.9-eclipse-temurin-17 mvn test
```

## Commandes Docker

### Voir les Logs

```bash
# Tous les services
docker compose logs -f

# API seulement
docker compose logs -f api

# 100 dernières lignes
docker compose logs --tail=100 api
```

### Reconstruire Après des Modifications de Code

```bash
docker compose up -d --build api
```

### Arrêter les Services

```bash
docker compose down
```

### Arrêter et Supprimer les Volumes (Réinitialiser la Base de Données)

```bash
docker compose down -v
```

### Accéder à la Base de Données

```bash
docker exec -it notes-postgres psql -U notesuser -d notesdb
```

## Schéma de Base de Données

L'application utilise les entités principales suivantes :

- **users** - Comptes utilisateurs
- **notes** - Notes des utilisateurs
- **tags** - Étiquettes de notes
- **note_tags** - Relation plusieurs-à-plusieurs
- **shares** - Permissions de partage de notes
- **public_links** - Liens d'accès publics

## Dépannage

### Port Déjà Utilisé

Si le port 5432 est déjà utilisé :
- Le fichier docker-compose.yml mappe déjà PostgreSQL sur le port `5433` en externe
- Si vous devez le modifier, éditez `docker/docker-compose.yml`

### Le Conteneur ne Démarre Pas

Vérifier les logs :
```bash
docker compose logs api
```

### Échec du Health Check

Le point de terminaison de santé de l'API devrait être accessible sans authentification :
```bash
curl http://localhost:8080/actuator/health
```

### Problèmes de Connexion à la Base de Données

Vérifier que la base de données fonctionne :
```bash
docker compose ps db
```

Tester la connexion à la base de données :
```bash
docker exec notes-postgres psql -U notesuser -d notesdb -c "SELECT 1"
```

### Tout Réinitialiser

```bash
# Arrêter et supprimer tous les conteneurs et volumes
docker compose down -v

# Reconstruire et redémarrer
docker compose up -d --build
```

## Structure du Projet

```
backend-spring/
├── src/
│   ├── main/
│   │   ├── java/com/example/backend_spring/
│   │   │   ├── config/          # Configuration Security, CORS
│   │   │   ├── controller/      # Contrôleurs REST
│   │   │   ├── dto/             # Objets de Transfert de Données
│   │   │   ├── entity/          # Entités JPA
│   │   │   ├── exception/       # Exceptions personnalisées
│   │   │   ├── repository/      # Repositories JPA
│   │   │   ├── security/        # JWT, authentification
│   │   │   └── service/         # Logique métier
│   │   └── resources/
│   │       └── application.yml  # Configuration de l'application
│   └── test/                    # Tests unitaires et d'intégration
├── Dockerfile                   # Définition de l'image Docker
├── pom.xml                      # Dépendances Maven
└── README.md                    # Ce fichier
```
