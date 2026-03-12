# Gestionnaire de Tâches Web
# GENOT Sandor | KHALDI Yanis | TAFILI Jade 
#Classe 3IABD1


Application web collaborative de gestion de tâches développée dans le cadre d'un projet d'examen.

---

## Lancer l'application

**Terminal 1 — Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm start
```

**Accès :**
- URL : `http://localhost:3000`
- Email : `admin@test.com`
- Mot de passe : `password`

---

## Workflow Git

Le projet utilise le **GitHub Flow** avec les branches suivantes :

| Branche | Responsable | Contenu |
|---|---|---|
| `feature/test-unit` | Personne 1 | Tests unitaires Jest |
| `feature/test-selenium` | Jade | Tests intégration + E2E Selenium |
| `feature/ci-cd` | Personne 3 | Pipeline CI/CD GitHub Actions |

Chaque fonctionnalité a été développée dans une branche dédiée puis intégrée dans `main` via Pull Request.

---

## Partie 1 — Tests Unitaires

**Rôle : Tests unitaires Jest**  
**Branche : `feature/test-unit`**

### Installation et lancement
```bash
cd backend
npm test
```

### Fichiers de tests
```
backend/
└── tests/
    └── unit/
        ├── jest_test.js
        └── title_test.js
```

### Ce qui est testé

- Bon fonctionnement des fonctions métier
- Validité des données
- Comportement attendu des différentes parties du code

### Résultats
```
PASS backend/tests/unit/jest_test.js
PASS backend/tests/unit/title_test.js

Tests : tous passés ✅
```

---

## Partie 2 — Tests d'intégration & E2E Selenium

**Rôle : Tests d'intégration API + Tests E2E**  
**Branche : `feature/test-selenium`**

### Installation
```bash
cd tests
npm install
```

### Lancer les tests
```bash
# Tests d'intégration API
npm run test:integration

# Tests E2E Selenium
npm run test:e2e
```

### Tests d'intégration API (`tests/integration/api.test.js`)

Outil utilisé : **Supertest + Jest**

| Endpoint | Test | Résultat |
|---|---|---|
| `GET /api/tasks` | Retourne un tableau avec status 200 | ✅ |
| `POST /api/tasks` | Crée une tâche avec status 201 | ✅ |
| `POST /api/tasks` | Refuse une tâche sans titre (status 400) | ✅ |
| `DELETE /api/tasks/:id` | Supprime une tâche existante (status 204) | ✅ |
| `DELETE /api/tasks/:id` | Retourne 404 si la tâche n'existe pas | ✅ |

**Erreurs rencontrées :**

- **Cannot find module '../../backend/app'** → Le fichier s'appelait `server.js` et non `app.js`. Correction du chemin dans le fichier de test.
- **Cannot find module 'express'** → Les dépendances du backend n'étaient pas installées. Résolu avec `npm install` dans le dossier `backend/`.
- **Status 401 sur toutes les routes** → Les routes sont protégées par JWT. Ajout d'un `beforeAll` pour se connecter et récupérer le token avant chaque test.
- **Status 204 au lieu de 200 sur DELETE** → Le backend renvoie 204 (No Content) ce qui est correct. Correction de l'assertion dans le test.

### Tests E2E Selenium (`tests/e2e/selenium.test.js`)

Outil utilisé : **Selenium WebDriver + Jest**  
Navigateur : **Chrome (headless)**

| Test | Description | Résultat |
|---|---|---|
| 1 | Charger la page de login | ✅ |
| 2 | Se connecter avec les identifiants valides | ✅ |
| 3 | Créer une nouvelle tâche | ✅ |
| 4 | Vérifier que la tâche apparaît dans la liste | ✅ |

**Erreurs rencontrées :**

- **SessionNotCreatedError: ChromeDriver version 146 / Chrome version 145** → Incompatibilité de version. Résolu avec `npm install --save-dev chromedriver@145`.
- **Timeout 5000ms dépassé** → Timeout insuffisant pour Selenium. Résolu en passant à 15000ms par test et 30000ms pour le `beforeAll`.

### Résultats finaux
```
PASS integration/api.test.js
  ✓ GET /tasks - retourne un tableau (5ms)
  ✓ POST /tasks - crée une tâche (3ms)
  ✓ POST /tasks - refuse sans titre (2ms)
  ✓ DELETE /tasks/:id - supprime une tâche (5ms)
  ✓ DELETE /tasks/:id - 404 si inexistante (2ms)

Tests : 5 passed, 5 total

PASS e2e/selenium.test.js
  ✓ doit charger la page de login (435ms)
  ✓ doit se connecter avec les identifiants valides (503ms)
  ✓ doit créer une nouvelle tâche (1165ms)
  ✓ doit afficher la tâche créée dans la liste (23ms)

Tests : 4 passed, 4 total
```

---

## Partie 3 — CI/CD GitHub Actions

**Rôle : Intégration Continue**  
**Branche : `feature/ci-cd`**

### Fichier de configuration
```
.github/
└── workflows/
    └── ci.yml
```

### Pipeline CI/CD

La pipeline se déclenche automatiquement lors d'un **push** ou d'une **Pull Request**.

**Étapes du pipeline :**

1. Récupération du repository
2. Installation de Node.js
3. Installation des dépendances backend (`npm install`)
4. Installation des dépendances frontend (`npm install`)
5. Exécution des tests automatiquement

### Résultats

La pipeline est visible dans **GitHub → Actions** et permet de vérifier automatiquement que le projet fonctionne correctement à chaque modification du code.
```
✅ CI Pipeline #4 — Merge pull request — main — 19s
```

---

## Récapitulatif

| Partie | Outil | Tests | Statut |
|---|---|---|---|
| Tests unitaires | Jest | `npm test` dans `/backend` | ✅ |
| Tests intégration | Supertest | `npm run test:integration` dans `/tests` | ✅ |
| Tests E2E | Selenium | `npm run test:e2e` dans `/tests` | ✅ |
| CI/CD | GitHub Actions | Automatique sur push/PR | ✅ |