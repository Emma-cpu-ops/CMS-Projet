# Échoppe Tech & Mode — Front-end E-commerce

Application web e-commerce moderne conçue en **React (Vite)**, connectée à un CMS headless **Strapi** (avec mode démo autonome intégré).

---

##  Le Parcours Utilisateur

### 1.  Accueil & Découverte (`/`)
* **Présentation** : Découverte de la boutique et de son univers.
* **Indicateur de statut** : Affiche en temps réel si l'application est connectée à Strapi ou en mode démo.
* **Sélection** : Mise en avant immédiate des 3 premiers articles phares.

### 2.  Catalogue & Filtres (`/catalogue`)
* **Navigation par catégories** : Filtrage rapide par tags (Tech, Mode, etc.).
* **Grille de produits** : Affichage responsive avec photo, titre, catégorie et prix.
* **Compteur** : Indique en direct le nombre d'articles affichés.

### 3.  Fiche Produit (`/produit/:slug`)
* **Détails complets** : Visuel grand format, description détaillée et prix unitaire.
* **Personnalisation** : Choix de la quantité souhaitée.
* **Ajout au panier** : Bouton d'action avec notification instantanée de confirmation.

### 4.  Panier & Commande (`/panier`)
* **Gestion en direct** : Ajustement des quantités, suppression ligne par ligne ou vidage complet.
* **Récapitulatif** : Calcul automatique du sous-total et du montant total.
* **Validation** : Simulation d'achat sécurisée avec confirmation de commande.

### 5.  Connexion & Compte (`/connexion`)
* **Double mode** : Bascule facile entre connexion et inscription.
* **Persistance** : Authentification via JWT Strapi (ou stockage local sécurisé en mode démo).

---

##  Démarrage Rapide

### Prérequis
* Node.js (version 18 ou supérieure recommandée)

### Lancer le front-end

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

---

## 🔗 Variables d'environnement (Optionnel)

Pour connecter l'application à votre propre instance Strapi, créez un fichier `.env` dans le dossier `frontend` :

```env
VITE_STRAPI_URL=http://localhost:1337
```
