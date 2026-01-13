# microservice-cinema 🎬

## Les migrations

### Prérequis
- PostgreSQL en cours d'exécution (local ou via Docker)
- Un fichier `.env` à la racine du projet contenant `DATABASE_URL`

Exemple :
```env
# .env
DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/cinema-service"
```

> Remplacer `USER`, `PASSWORD` et `localhost:5432` par ses paramètres locaux ou Docker.

---

### Emplacement des fichiers Prisma
Dans ce dépôt, Prisma n'est pas à la racine. Les fichiers se trouvent ici :

- Schéma : `src/infrastructure/database/prisma/schema.prisma`
- Migrations : `src/infrastructure/database/prisma/migrations`
- Seed : `src/infrastructure/database/prisma/seed.ts`

Le fichier `prisma.config.ts` pointe vers ces chemins.

---

### Commandes utiles (à lancer à la racine du projet)

- Créer / appliquer une migration :
```bash
npx prisma migrate dev --name init
```

- Exemple pour ajouter une migration :
```bash
npx prisma migrate dev --name add_opening_hours
```

- Régénérer le Prisma Client (si nécessaire) :
```bash
npx prisma generate
```

- Lancer le seed :
```bash
npx tsx src/infrastructure/database/prisma/seed.ts
```

- Ouvrir Prisma Studio (UI) :
```bash
npx prisma studio
```

---

### Vérification
- Si le seed s'exécute sans erreurs, les données ont été insérées.
- Utilise `npx prisma studio` pour inspecter les tables et données.