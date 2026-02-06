# microservice-cinema 🎬

Microservice NestJS (Clean Architecture) pour la gestion des cinémas, salles, sièges, séances et horaires.

Ce service fait partie d’une architecture microservices.
Les films sont gérés par un service externe (Movie Service).

---

## 🚀 Stack technique
- NestJS
- Prisma
- PostgreSQL
- Clean Architecture
- Swagger
- Guards (Auth + Roles)

---

## 📦 Installation

```bash
npm install
npm run start
```

---

## ⚙️ Configuration

Créer un fichier `.env` :

```bash
env
DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/cinema-service"
MOVIE_SERVICE_URL="http://localhost:3001"
```

---

## 🧱 Prisma

### Emplacement des fichiers
- Schéma :

src/infrastructure/database/prisma/schema.prisma

- Migrations :

src/infrastructure/database/prisma/migrations

- Seed :

src/infrastructure/database/prisma/seed.ts


---

## 🗄️ Commandes utiles

Créer / appliquer une migration

```bash
npx prisma migrate dev --name init
```

Régénérer le client Prisma (IMPORTANT après modif du schema)

```bash
npx prisma generate
```

Lancer le seed

```bash
npx tsx src/infrastructure/database/prisma/seed.ts
```

Ouvrir Prisma Studio

```bash
npx prisma studio
```

---

## 📊 Données seedées
- 1 cinéma (avec adresse + téléphone + zipCode)
- 2 salles
- Des sièges
- Des horaires d’ouverture 
- Des séances

## ⚠️ Les films ne sont PLUS stockés dans cette base.
Ils proviennent du microservice externe Movies.

---

## 🧠 Architecture

### Structure Clean Architecture :

domain/
application/
infrastructure/
presentation/
modules/

### Domain
- Entités métier
- Value objects
- Interfaces repositories

### Application
- Use cases
- DTO internes
- Ports vers services externes

### Infrastructure
- Prisma repositories
- HTTP clients (Movie service)

### Presentation
- Controllers
- DTO Swagger
- Guards
- Decorators

---

## 🎬 Entités gérées
- Cinema
- Room
- Seat
- Screening
- OpeningHours

---

## 🔐 Sécurité

### Endpoints protégés
- POST
- PATCH
- DELETE

### Utilisent :
- AuthGuard
- RolesGuard
- @Roles("admin")

### Endpoints publics :
- GET

---

## 🎥 Movie Service (externe)

Le microservice cinema ne stocke pas les films.

Il consomme :

GET /movies/:id

Données utilisées :
- id
- duration
- posterUrl

---

## 📘 Swagger

Lancer le serveur :

```bash
npm start
```
Puis ouvrir :

http://localhost:3000/api

---

## 🏷️ Version actuelle

v0.5.0
- CRUD complet :
- Cinema
- Room
- Seat
- Screening
- OpeningHours
- Ajout :
- address
- zipCode
- phoneNumber
- Suppression du modèle Movie (service externe)
- Mise en place :
- Guards
- Roles
- Architecture ports/adapters

---

## 🧪 Développement

```bash
npm run start:dev
```
---

## 🧼 Reset base (optionnel)

```bash
npx prisma migrate reset
```
---

## 📌 Notes
- Les IDs sont générés en cuid()
- DTO séparés :
- application layer
- presentation layer
- Mapping Prisma ↔ Domain respecté
