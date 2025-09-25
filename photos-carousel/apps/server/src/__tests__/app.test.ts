import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app.js';

describe('server routes', () => {
  it('creates picker sessions', async () => {
    const response = await request(app).post('/picker/session').send({});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sessionId');
  });

  it('lists media items after session ready', async () => {
    const session = await request(app).post('/picker/session').send({});
    expect(session.status).toBe(200);
    const sessionId = session.body.sessionId;
    await new Promise((resolve) => setTimeout(resolve, 3100));
    const list = await request(app).get('/media').query({ sessionId });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.items)).toBe(true);
  });
});
