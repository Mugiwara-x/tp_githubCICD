const request = require('supertest');
const app = require('../../backend/server');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password' });

  token = res.body.token;
});

describe('API Tasks - Tests d\'intégration', () => {

  describe('GET /tasks', () => {
    it('doit retourner un tableau de tâches avec status 200', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /tasks', () => {
    it('doit créer une nouvelle tâche avec status 201', async () => {
      const newTask = {
        title: 'Tâche de test',
        description: 'Créée via test d\'intégration',
        priority: 'haute',
        status: 'todo',
        assignee: 'Jade'
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newTask.title);
    });

    it('doit refuser une tâche sans titre (status 400)', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Sans titre' });

      expect(res.statusCode).toBe(400);
    });
  });


  describe('DELETE /tasks/:id', () => {
    it('doit supprimer une tâche existante avec status 200', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'À supprimer', priority: 'basse', status: 'todo' });

      const id = created.body.id;

      const res = await request(app)
        .delete(`/api/tasks/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });

    it('doit retourner 404 si la tâche n\'existe pas', async () => {
      const res = await request(app)
        .delete('/api/tasks/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

});