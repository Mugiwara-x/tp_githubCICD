const request = require('supertest');
// On importe votre vrai serveur avec toutes ses vraies routes et sa vraie base de données en mémoire
const app = require('../../server'); 

describe('Scénario complet sans isolation (Test d\'intégration)', () => {
  
  // Variables pour garder en mémoire les vraies données entre les tests
  let vraiToken = '';
  let idTacheCreee = '';

  test('1. Créer un vrai utilisateur (Register)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'integration@test.com',
        password: 'mon-mot-de-passe',
        name: 'Testeur'
      });

    expect(response.statusCode).toBe(201);
    // Le serveur a VRAIMENT ajouté cet utilisateur dans le tableau "users"
  });

  test('2. Se connecter avec ce vrai utilisateur (Login)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'integration@test.com',
        password: 'mon-mot-de-passe'
      });

    expect(response.statusCode).toBe(200);
    // Le serveur a VRAIMENT généré un JWT avec la vraie clé secrète
    vraiToken = response.body.token; 
  });

  test('3. Créer une vraie tâche dans le tableau', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${vraiToken}`) // On utilise le vrai token
      .send({
        title: 'Faire les courses',
        description: 'Acheter du lait',
        priority: 'high'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Faire les courses');
    
    // On sauvegarde le vrai ID généré par le serveur (uuidv4)
    idTacheCreee = response.body.id; 
  });

  test('4. Mettre à jour cette même tâche', async () => {
    const response = await request(app)
      .put(`/api/tasks/${idTacheCreee}`) // On cible la vraie tâche créée juste avant
      .set('Authorization', `Bearer ${vraiToken}`)
      .send({
        status: 'done' // On change le statut
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('done');
    expect(response.body.title).toBe('Faire les courses'); // Le titre n'a pas dû changer
  });

  test('5. Supprimer la tâche définitivement', async () => {
    // Étape A : On supprime
    const resDelete = await request(app)
      .delete(`/api/tasks/${idTacheCreee}`)
      .set('Authorization', `Bearer ${vraiToken}`);
    
    expect(resDelete.statusCode).toBe(204);

    // Étape B : On vérifie qu'elle n'existe VRAIMENT plus
    const resGet = await request(app)
      .get(`/api/tasks/${idTacheCreee}`)
      .set('Authorization', `Bearer ${vraiToken}`);
      
    expect(resGet.statusCode).toBe(404); // Le serveur doit nous répondre "Tâche non trouvée"
  });
});