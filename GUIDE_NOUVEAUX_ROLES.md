# Guide : Créer des Utilisateurs avec les Nouveaux Rôles

## ✅ Configuration Complète

Les rôles **Commercial** et **Magasinier** sont maintenant disponibles lors de la création et modification d'utilisateurs.

## 📝 Comment Créer un Nouvel Utilisateur

### Étape 1 : Accéder à la Page Utilisateurs
1. Connectez-vous avec un compte **Super Admin**
2. Naviguez vers `/admin/users` (menu "Utilisateurs")

### Étape 2 : Créer un Nouvel Utilisateur
1. Cliquez sur le bouton **"Ajouter un Admin"**
2. Remplissez le formulaire :
   - **Nom complet** : Ex. "Mohamed Alami"
   - **Email** : Ex. "mohamed@mkarim.ma"
   - **Mot de passe** : Minimum 6 caractères
   - **Rôle** : Sélectionnez parmi :

#### Rôles Disponibles

| Rôle | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | Accès Total | Toutes les pages et actions |
| **Éditeur** | Gestion Commandes/Produits | Dashboard, Commandes, Produits, Catégories, Livraison, Clients, Messages, Analytics |
| **Observateur** | Lecture seule | Même accès que l'Éditeur mais en lecture seule |
| **Commercial** ⭐ | Confirmer/Annuler Commandes | Uniquement page Commandes - Peut confirmer et annuler |
| **Magasinier** ⭐ | Expédier/Livrer Commandes | Uniquement page Commandes - Peut expédier et livrer les commandes confirmées |

### Étape 3 : Sauvegarder
- Cliquez sur **"Inviter"**
- L'utilisateur est créé et peut maintenant se connecter

## 🔄 Modifier le Rôle d'un Utilisateur Existant

1. Sur la page `/admin/users`
2. Cliquez sur l'icône **crayon** (✏️) à côté de l'utilisateur
3. Sélectionnez le nouveau rôle dans le menu déroulant
4. (Optionnel) Changez le mot de passe
5. Cliquez sur **"Enregistrer"**

## 🧪 Test des Nouveaux Rôles

### Test Commercial
```
1. Créer un utilisateur avec le rôle "Commercial"
2. Se connecter avec ce compte
3. Vérifier :
   ✓ Redirection automatique vers /admin/orders
   ✓ Menu ne montre que "Commandes"
   ✓ Peut voir toutes les commandes
   ✓ Boutons "Confirmer" et "Annuler" disponibles
   ✗ Boutons "Expédier" et "Livrer" non disponibles
```

### Test Magasinier
```
1. Créer un utilisateur avec le rôle "Magasinier"
2. Se connecter avec ce compte
3. Vérifier :
   ✓ Redirection automatique vers /admin/orders
   ✓ Menu ne montre que "Commandes"
   ✓ Voit uniquement les commandes CONFIRMED, SHIPPED, DELIVERED
   ✓ Boutons "Expédier" et "Livrer" disponibles
   ✗ Boutons "Confirmer" et "Annuler" non disponibles
   ✗ Ne voit pas les commandes PENDING
```

## 📊 Flux de Travail Recommandé

```
1. Client passe commande → Statut: PENDING
                              ↓
2. Commercial confirme     → Statut: CONFIRMED
                              ↓
3. Magasinier expédie     → Statut: SHIPPED
                              ↓
4. Magasinier livre       → Statut: DELIVERED
```

## 🔐 Sécurité

- ✅ Backend : Validation des rôles dans le schéma Zod
- ✅ Backend : Middleware d'autorisation sur tous les endpoints
- ✅ Frontend : Redirection automatique vers /admin/orders
- ✅ Frontend : Filtrage des commandes selon le rôle
- ✅ Frontend : Boutons d'action conditionnels

## 💡 Conseils

1. **Pour le Commercial** : Créez un compte dédié pour chaque commercial de votre équipe
2. **Pour le Magasinier** : Créez un compte pour le responsable d'entrepôt
3. **Séparation des responsabilités** : Chaque rôle a des permissions limitées pour éviter les erreurs
4. **Traçabilité** : Chaque action est liée à un utilisateur spécifique

## ⚠️ Important

- Les utilisateurs doivent se **reconnecter** après un changement de rôle
- Seul le **Super Admin** peut créer et modifier les utilisateurs
- Le compte principal `admin@mkarim.ma` ne peut pas être supprimé ou modifié
