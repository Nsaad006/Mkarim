# Règles de Validation des Transitions de Statut

## Vue d'ensemble
Ce document décrit les règles strictes de validation pour les changements de statut des commandes selon le rôle de l'utilisateur.

## Statuts des Commandes

Les commandes peuvent avoir les statuts suivants :
- **PENDING** : En attente (commande nouvellement créée)
- **CONFIRMED** : Confirmée (validée par le Commercial)
- **SHIPPED** : Expédiée (en cours de livraison)
- **DELIVERED** : Livrée (reçue par le client)
- **CANCELLED** : Annulée
- **RETURNED** : Retournée

## Règles par Rôle

### 🔵 Commercial

#### Action : CONFIRMER (PENDING → CONFIRMED)
- ✅ **Autorisé** : Uniquement si la commande est en statut **PENDING**
- ❌ **Interdit** : Si la commande est déjà CONFIRMED, SHIPPED, DELIVERED, ou CANCELLED

**Exemple** :
```
PENDING → CONFIRMED ✅
CONFIRMED → CONFIRMED ❌ (déjà confirmée)
SHIPPED → CONFIRMED ❌ (déjà expédiée)
DELIVERED → CONFIRMED ❌ (déjà livrée)
CANCELLED → CONFIRMED ❌ (annulée)
```

#### Action : ANNULER (→ CANCELLED)
- ✅ **Autorisé** : Si la commande est en statut **PENDING** ou **CONFIRMED**
- ❌ **Interdit** : Si la commande est déjà SHIPPED, DELIVERED, ou CANCELLED

**Exemple** :
```
PENDING → CANCELLED ✅
CONFIRMED → CANCELLED ✅
SHIPPED → CANCELLED ❌ (déjà expédiée, trop tard)
DELIVERED → CANCELLED ❌ (déjà livrée)
CANCELLED → CANCELLED ❌ (déjà annulée)
```

**Logique** : Une fois qu'une commande est expédiée, le Commercial ne peut plus l'annuler car elle est entre les mains du transporteur ou du client.

### 🟢 Magasinier

#### Action : EXPÉDIER (CONFIRMED → SHIPPED)
- ✅ **Autorisé** : Uniquement si la commande est en statut **CONFIRMED**
- ❌ **Interdit** : Si la commande est PENDING, SHIPPED, DELIVERED, ou CANCELLED

**Exemple** :
```
PENDING → SHIPPED ❌ (pas encore confirmée)
CONFIRMED → SHIPPED ✅
SHIPPED → SHIPPED ❌ (déjà expédiée)
DELIVERED → SHIPPED ❌ (déjà livrée)
CANCELLED → SHIPPED ❌ (annulée)
```

#### Action : LIVRER (SHIPPED → DELIVERED)
- ✅ **Autorisé** : Uniquement si la commande est en statut **SHIPPED**
- ❌ **Interdit** : Si la commande est PENDING, CONFIRMED, DELIVERED, ou CANCELLED

**Exemple** :
```
PENDING → DELIVERED ❌ (pas encore confirmée ni expédiée)
CONFIRMED → DELIVERED ❌ (pas encore expédiée)
SHIPPED → DELIVERED ✅
DELIVERED → DELIVERED ❌ (déjà livrée)
CANCELLED → DELIVERED ❌ (annulée)
```

### 👑 Super Admin / Éditeur

- ✅ **Autorisé** : Toutes les transitions de statut
- Aucune restriction

## Flux de Travail Normal

```
1. Client passe commande
   ↓
   PENDING (En attente)
   ↓
2. Commercial confirme
   ↓
   CONFIRMED (Confirmée)
   ↓
3. Magasinier expédie
   ↓
   SHIPPED (Expédiée)
   ↓
4. Magasinier marque comme livrée
   ↓
   DELIVERED (Livrée)
```

## Flux Alternatif : Annulation

### Annulation Précoce (par Commercial)
```
PENDING → CANCELLED ✅
CONFIRMED → CANCELLED ✅
```

### Annulation Tardive (impossible pour Commercial)
```
SHIPPED → CANCELLED ❌
DELIVERED → CANCELLED ❌
```

**Note** : Seul le Super Admin peut annuler une commande déjà expédiée ou livrée.

## Implémentation

### Backend (`backend/src/routes/orders.ts`)

```typescript
// Validation pour Commercial
if (user.role === 'commercial') {
    const order = await prisma.order.findUnique({ where: { id } });
    
    // CONFIRMER : uniquement si PENDING
    if (status === 'CONFIRMED' && order.status !== 'PENDING') {
        return res.status(403).json({
            error: 'Vous ne pouvez confirmer que les commandes en attente'
        });
    }
    
    // ANNULER : uniquement si PENDING ou CONFIRMED
    if (status === 'CANCELLED' && !['PENDING', 'CONFIRMED'].includes(order.status)) {
        return res.status(403).json({
            error: 'Vous ne pouvez annuler que les commandes en attente ou confirmées'
        });
    }
}
```

### Frontend (`frontend/src/pages/admin/Orders.tsx`)

```typescript
// Fonction de validation
const canPerformAction = (order: Order, targetStatus: string): boolean => {
    const currentStatus = order.status.toUpperCase();
    
    if (userRole === 'commercial') {
        if (targetStatus === 'CONFIRMED') {
            return currentStatus === 'PENDING';
        }
        if (targetStatus === 'CANCELLED') {
            return ['PENDING', 'CONFIRMED'].includes(currentStatus);
        }
    }
    
    if (userRole === 'magasinier') {
        if (targetStatus === 'SHIPPED') {
            return currentStatus === 'CONFIRMED';
        }
        if (targetStatus === 'DELIVERED') {
            return currentStatus === 'SHIPPED';
        }
    }
    
    return false;
};

// Utilisation dans les boutons
<Button
    disabled={!canPerformAction(order, 'CONFIRMED')}
    onClick={() => handleStatusChange(order.id, "CONFIRMED")}
>
    Confirmer
</Button>
```

## Messages d'Erreur

### Backend
- `"Vous ne pouvez confirmer que les commandes en attente"`
- `"Vous ne pouvez annuler que les commandes en attente ou confirmées"`
- `"Cette commande ne peut plus être modifiée"`
- `"Magasinier can only update confirmed or shipped orders"`

### Frontend
- Les boutons sont désactivés (grisés) si l'action n'est pas autorisée
- Un message d'erreur toast s'affiche si la tentative échoue côté backend

## Sécurité

### Double Validation
1. **Frontend** : Désactivation des boutons (UX)
2. **Backend** : Validation stricte (Sécurité)

### Principe
Même si un utilisateur malveillant contourne la validation frontend, le backend rejettera toujours les actions non autorisées.

## Exemples de Scénarios

### Scénario 1 : Flux Normal
```
1. Client commande → PENDING
2. Commercial confirme → CONFIRMED ✅
3. Magasinier expédie → SHIPPED ✅
4. Magasinier livre → DELIVERED ✅
```

### Scénario 2 : Annulation Rapide
```
1. Client commande → PENDING
2. Commercial annule → CANCELLED ✅
```

### Scénario 3 : Annulation Après Confirmation
```
1. Client commande → PENDING
2. Commercial confirme → CONFIRMED ✅
3. Commercial annule → CANCELLED ✅
```

### Scénario 4 : Tentative d'Annulation Tardive (Bloquée)
```
1. Client commande → PENDING
2. Commercial confirme → CONFIRMED ✅
3. Magasinier expédie → SHIPPED ✅
4. Commercial tente d'annuler → ERREUR ❌
   Message: "Vous ne pouvez annuler que les commandes en attente ou confirmées"
```

### Scénario 5 : Tentative de Confirmation Multiple (Bloquée)
```
1. Client commande → PENDING
2. Commercial confirme → CONFIRMED ✅
3. Commercial tente de confirmer à nouveau → BOUTON DÉSACTIVÉ ❌
```

## Tests Recommandés

### Test 1 : Commercial - Confirmer Commande PENDING
- ✅ Doit réussir

### Test 2 : Commercial - Confirmer Commande SHIPPED
- ❌ Doit échouer avec message d'erreur

### Test 3 : Commercial - Annuler Commande PENDING
- ✅ Doit réussir

### Test 4 : Commercial - Annuler Commande CONFIRMED
- ✅ Doit réussir

### Test 5 : Commercial - Annuler Commande SHIPPED
- ❌ Doit échouer avec message d'erreur

### Test 6 : Magasinier - Expédier Commande CONFIRMED
- ✅ Doit réussir

### Test 7 : Magasinier - Expédier Commande PENDING
- ❌ Doit échouer (bouton désactivé)

### Test 8 : Magasinier - Livrer Commande SHIPPED
- ✅ Doit réussir

### Test 9 : Magasinier - Livrer Commande CONFIRMED
- ❌ Doit échouer (bouton désactivé)
