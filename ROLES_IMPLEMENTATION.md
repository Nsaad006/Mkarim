# Implémentation des Rôles Commercial et Magasinier

## Vue d'ensemble
Ce document décrit l'implémentation de deux nouveaux rôles utilisateurs : **Commercial** et **Magasinier**, avec des permissions spécifiques pour la gestion des commandes.

## Rôles et Permissions

### Rôle Commercial
- **Accès** : Uniquement à la page `/admin/orders`
- **Permissions** :
  - ✅ Voir toutes les commandes
  - ✅ Confirmer une commande (statut → CONFIRMED)
  - ✅ Annuler une commande (statut → CANCELLED)
  - ❌ Accès à toutes les autres pages admin

### Rôle Magasinier
- **Accès** : Uniquement à la page `/admin/orders`
- **Permissions** :
  - ✅ Voir uniquement les commandes avec statut : CONFIRMED, SHIPPED, DELIVERED
  - ✅ Changer le statut en SHIPPED (Expédiée)
  - ✅ Changer le statut en DELIVERED (Livrée)
  - ❌ Voir les commandes PENDING ou CANCELLED
  - ❌ Accès à toutes les autres pages admin

## Modifications Backend

### 1. Fichier : `backend/src/routes/admins.ts`
- Ajout des rôles `commercial` et `magasinier` dans le schéma de validation Zod
- Mise à jour de la validation des rôles dans l'endpoint PATCH `/api/admins/:id/role`

### 2. Fichier : `backend/src/routes/orders.ts`

#### GET `/api/orders`
- Ajout du filtrage basé sur le rôle :
  - **Magasinier** : Ne voit que les commandes CONFIRMED, SHIPPED, DELIVERED
  - **Commercial** et autres rôles : Voient toutes les commandes

#### PATCH `/api/orders/:id/status`
- Ajout de la logique de contrôle des permissions :
  - **Commercial** : Peut uniquement mettre CONFIRMED ou CANCELLED
  - **Magasinier** : Peut uniquement mettre SHIPPED ou DELIVERED (et seulement pour les commandes déjà CONFIRMED ou SHIPPED)
  - **Super Admin / Editor** : Peuvent tout faire

## Modifications Frontend

### 1. Fichier : `frontend/src/data/mock-admin-data.ts`
- Mise à jour du type `AdminUser` pour inclure les nouveaux rôles

### 2. Fichier : `frontend/src/layouts/AdminLayout.tsx`
- Mise à jour du menu de navigation :
  - La page "Commandes" est maintenant accessible aux rôles : `commercial` et `magasinier`
  - Les autres pages restent accessibles uniquement aux rôles existants

### 3. Fichier : `frontend/src/pages/admin/Orders.tsx`
- Ajout de la récupération du rôle utilisateur depuis localStorage
- Ajout de deux fonctions helper :
  - `canUpdateStatus(status)` : Vérifie si l'utilisateur peut effectuer une action de changement de statut
  - `isOrderVisible(order)` : Vérifie si une commande doit être visible pour l'utilisateur
- Mise à jour du filtrage des commandes pour appliquer `isOrderVisible`
- Mise à jour de l'interface utilisateur :
  - Boutons d'action conditionnels dans le panneau de détails
  - Menu dropdown avec actions conditionnelles
  - Bouton "Annuler" visible uniquement pour Commercial et rôles supérieurs

### 4. Fichier : `frontend/src/pages/admin/AdminUsers.tsx`
- Ajout des options "Commercial" et "Magasinier" dans les sélecteurs de rôle
- Descriptions des permissions pour chaque rôle

### 5. Fichier : `frontend/src/components/ProtectedRoute.tsx`
- Ajout de la logique de redirection automatique :
  - Les utilisateurs Commercial et Magasinier sont automatiquement redirigés vers `/admin/orders` s'ils tentent d'accéder à d'autres pages admin

## Flux de Travail

### Scénario Commercial
1. Le Commercial se connecte à l'application
2. Il est automatiquement redirigé vers `/admin/orders`
3. Il voit toutes les commandes (PENDING, CONFIRMED, etc.)
4. Il peut :
   - Confirmer les commandes en attente
   - Annuler des commandes
5. Une fois confirmée, la commande devient visible pour le Magasinier

### Scénario Magasinier
1. Le Magasinier se connecte à l'application
2. Il est automatiquement redirigé vers `/admin/orders`
3. Il voit uniquement les commandes CONFIRMED, SHIPPED, DELIVERED
4. Il peut :
   - Marquer une commande CONFIRMED comme SHIPPED
   - Marquer une commande SHIPPED comme DELIVERED

## Sécurité

### Côté Backend
- Tous les endpoints sont protégés par le middleware `authenticate`
- Le middleware `authorize` vérifie les rôles autorisés
- Validation supplémentaire dans la logique métier pour les actions spécifiques

### Côté Frontend
- Filtrage des commandes visibles selon le rôle
- Affichage conditionnel des boutons d'action
- Redirection automatique pour empêcher l'accès non autorisé
- Messages d'erreur clairs en cas de tentative d'action non autorisée

## Tests Recommandés

1. **Test Commercial** :
   - Créer un utilisateur avec le rôle Commercial
   - Vérifier qu'il ne peut accéder qu'à `/admin/orders`
   - Vérifier qu'il peut confirmer et annuler des commandes
   - Vérifier qu'il ne peut pas expédier ou livrer des commandes

2. **Test Magasinier** :
   - Créer un utilisateur avec le rôle Magasinier
   - Vérifier qu'il ne voit que les commandes CONFIRMED, SHIPPED, DELIVERED
   - Vérifier qu'il peut marquer comme SHIPPED ou DELIVERED
   - Vérifier qu'il ne peut pas confirmer ou annuler des commandes

3. **Test Redirection** :
   - Tenter d'accéder à `/admin/products` avec un compte Commercial
   - Vérifier la redirection automatique vers `/admin/orders`

## Notes Importantes

- Les rôles sont stockés dans la base de données et dans le token JWT
- Le localStorage est utilisé pour la persistance côté client
- Toute modification de rôle nécessite une nouvelle connexion pour prendre effet
- Les Super Admin peuvent gérer tous les rôles via la page `/admin/users`
