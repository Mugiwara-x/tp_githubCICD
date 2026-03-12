# taskmanagement
Application de gestion de tâches

**Jade TAFILI**
**Rôle : Tests d'intégration & E2E Selenium**  
**Branche : `test-selenium`**

---

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

---

### Tests d'intégration API (`tests/integration/api.test.js`)

Outil utilisé : **Supertest + Jest**

Les tests vérifient les endpoints REST de l'API avec authentification JWT :

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

---

### Tests E2E Selenium (`tests/e2e/selenium.test.js`)

Outil utilisé : **Selenium WebDriver + Jest**  
Navigateur : **Chrome (headless)**

Les tests simulent un parcours utilisateur complet :

| Test | Description | Résultat |
|---|---|---|
| 1 | Charger la page de login | ✅ |
| 2 | Se connecter avec les identifiants valides | ✅ |
| 3 | Créer une nouvelle tâche | ✅ |
| 4 | Vérifier que la tâche apparaît dans la liste | ✅ |

**Erreurs rencontrées :**

- **SessionNotCreatedError: ChromeDriver version 146 / Chrome version 145** → Incompatibilité de version entre ChromeDriver installé et Chrome local. Résolu en installant la version correspondante : `npm install --save-dev chromedriver@145`.
- **Timeout 5000ms dépassé** → Le timeout par défaut de Jest est insuffisant pour Selenium. Résolu en passant le timeout à 15000ms sur chaque test et en ajoutant un `beforeAll` avec timeout de 30000ms.

---

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
