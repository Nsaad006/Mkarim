# Guide de Déploiement Pré-prod sur Railway

Ce guide vous explique comment déployer votre application (Frontend + Backend + Base de données) sur **Railway** pour un environnement de pré-production.

## 1. Structure du Projet
Votre projet est un **Monorepo** avec deux dossiers principaux :
- `frontend/` (React + Vite)
- `backend/` (Node.js + Express + Prisma)

Railway gère très bien cette structure. Vous allez créer **deux services** distincts à partir du même dépôt GitHub.

---

## 2. Configuration Initiale sur Railway

1.  Créez un compte sur [railway.app](https://railway.app/).
2.  Créez un **Nouveau Projet** > **Deploy from GitHub repo**.
3.  Sélectionnez votre dépôt `mkarim`.

### Étape A : Créer la Base de Données
1.  Dans votre projet Railway, faites **Right Click** (ou bouton "New") > **Database** > **PostgreSQL**.
2.  Attendez que la base de données soit initialisée.
3.  Cliquez sur le service **PostgreSQL**, allez dans l'onglet **Variables**.
4.  Copiez la `DATABASE_URL`.

---

## 3. Déploiement du Backend

1.  Ajoutez un nouveau service connecté à votre repo GitHub.
2.  Allez dans **Settings** de ce nouveau service :
    - **Root Directory** : `backend`
    - **Service Name** : `Backend API`
3.  Allez dans **Variables** et ajoutez :
    - `DATABASE_URL` : *Collez l'URL de la base de données Postgres créée précédemment*
    - `PORT` : `3001`
    - `FRONTEND_URL` : *Laissez vide pour l'instant, on y reviendra*
    - `NODE_ENV` : `production`
    - `JWT_SECRET` : *Définissez un secret long et sécurisé*
4.  Railway détectera automatiquement le fichier `railway.json` dans le dossier `backend` et utilisera la commande de build : `npm install && npx prisma generate && npm run build`.
5.  Le déploiement démarrera.

**Initialisation de la Base de Données (Seed) :**
Une fois le backend déployé avec succès :
1.  Cliquez sur le service Backend > Onglet **Deployments**.
2.  Cliquez sur le déploiement actif > **Command Palette** (ou CLI Railway).
3.  Exécutez : `npm run db:seed`
    *Cela remplira la base de données avec les produits, fournisseurs et paramètres par défaut.*

---

## 4. Déploiement du Frontend

1.  Ajoutez un **autre** service connecté au **même** repo GitHub.
2.  Allez dans **Settings** de ce service :
    - **Root Directory** : `frontend`
    - **Service Name** : `Frontend App`
3.  **IMPORTANT : Variables d'Environnement (Build Time)**
    Allez dans **Variables** et ajoutez :
    - `VITE_API_URL` : *L'URL publique (domain) de votre service Backend*.
        - *Pour trouver cette URL : Allez sur le service Backend > Settings > Networking > Public Domain (générez-en un si nécessaire, ex: `backend-production.up.railway.app`). Ajoutez `https://` devant.*
        - Exemple : `https://web-production-xxxx.up.railway.app`
4.  Railway détectera le fichier `railway.json` dans le dossier `frontend` et lancera le build `npm run build`.
    *Note : Vite a besoin de la variable `VITE_API_URL` PENDANT le build. Si vous la changez, vous devez "Redeploy" le frontend.*
5.  Générez un domaine public pour le frontend (Settings > Networking > Generate Domain).

---

## 5. Finalisation (Connexion Client -> Serveur)

1.  Une fois le Frontend déployé et son domaine généré (ex: `frontend-production.up.railway.app`), retournez sur le service **Backend**.
2.  Mettez à jour la variable `FRONTEND_URL` avec l'URL de votre frontend (sans slash à la fin).
    - Exemple : `https://frontend-production.up.railway.app`
3.  Railway redémarrera automatiquement le Backend.

## Résumé des Commandes (Automatisées par Railway)

Grâce aux fichiers `railway.json` présents dans chaque dossier, vous n'avez pas besoin de configurer les commandes de démarrage manuellement.

**Backend :**
- Build : `npm install && npx prisma generate && npm run build`
- Start : `npm run start:prod` (inclut les migrations automatiques)

**Frontend :**
- Build : `npm install && npm run build`
- Start : `npx serve dist -s -p $PORT`

---
**Votre environnement de pré-production est prêt !** 🚀
