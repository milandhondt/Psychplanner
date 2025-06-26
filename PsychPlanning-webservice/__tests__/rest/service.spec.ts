import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { login, loginPsycholoog } from '../helpers/login';
import { prisma } from '../../src/data';

const data = {
  services: [
    {
      id: 1,
      naam: 'Intake gesprek',
      duur: 60,
      prijs: 30,
      beschrijving: 'Hier kijken we hoe ik jou het beste kan helpen.',
    },
    {
      id: 2,
      naam: 'Vervolg gesprek',
      duur: 45,
      prijs: 20,
      beschrijving: 'In dit gesprek maken we progressie op vorige week.',
    },
  ],
};

const dataToDelete = {
  services: [1, 2],
};

describe('Services', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let psycholoogAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    psycholoogAuthHeader = await loginPsycholoog(request);
  });

  const url = '/api/services';

  describe('GET /api/services', () => {
    beforeAll(async () => {
      await prisma.service.createMany({ data: data.services });
    });

    afterAll(async () => {
      await prisma.service.deleteMany({
        where: { id: { in: dataToDelete.services } },
      });
    });

    it('it should 200 and return all services for the signed in user', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            naam: 'Intake gesprek',
            duur: 60,
            prijs: 30,
            beschrijving: 'Hier kijken we hoe ik jou het beste kan helpen.',
          },
          {
            id: 2,
            naam: 'Vervolg gesprek',
            duur: 45,
            prijs: 20,
            beschrijving: 'In dit gesprek maken we progressie op vorige week.',
          },
        ]),
      );
    });

    it('it should 200 and return all services for the signed in user', async () => {
      const response = await request.get(url).set('Authorization', psycholoogAuthHeader);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            naam: 'Intake gesprek',
            duur: 60,
            prijs: 30,
            beschrijving: 'Hier kijken we hoe ik jou het beste kan helpen.',
          },
          {
            id: 2,
            naam: 'Vervolg gesprek',
            duur: 45,
            prijs: 20,
            beschrijving: 'In dit gesprek maken we progressie op vorige week.',
          },
        ]),
      );
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

  });

  describe('GET /api/services/:id', () => {
    beforeAll(async () => {
      await prisma.service.createMany({ data: data.services });
    });

    afterAll(async () => {
      await prisma.service.deleteMany({
        where: { id: { in: dataToDelete.services } },
      });
    });

    it('should 200 and return the requested service', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual(
        {
          id: 1,
          naam: 'Intake gesprek',
          duur: 60,
          prijs: 30,
          beschrijving: 'Hier kijken we hoe ik jou het beste kan helpen.',
        },
      );
    });

    it('should 404 when requesting a non existent service', async () => {
      const id = 100;
      const response = await request.get(`${url}/${id}`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: `Er bestaat geen service met id ${id}`,
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid service id', async () => {
      const response = await request.get(`${url}/ongeldig`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  describe('POST /api/services', () => {
    beforeAll(async () => {
      await prisma.service.createMany({ data: data.services });
    });

    afterAll(async () => {
      await prisma.service.deleteMany({
        where: { id: { in: dataToDelete.services } },
      });
    });

    it('should 201 and return the created service', async () => {
      const response = await request.post(url).send({
        naam: 'Rouw begeleiding',
        duur: 90,
        prijs: 30,
        beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
      })
        .set('Authorization', authHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('Rouw begeleiding');
      expect(response.body.duur).toBe(90);
      expect(response.body.prijs).toBe(30);
      expect(response.body.beschrijving).toBe('Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?');
    });

    it('should 400 when trying to add a service with a bad "naam"', async () => {
      const response = await request.post(url)
        .send({
          naam: 45,
          duur: 30,
          prijs: 30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed, check details for more information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when trying to add a service with a bad "duur"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          duur: -30,
          prijs: 30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed, check details for more information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when trying to add a service with a bad "prijs"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          prijs: -30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed, check details for more information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when trying to add a service with a bad "beschrijving"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          prijs: 30,
          beschrijving: 45,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed, check details for more information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing "naam"', async () => {
      const response = await request.post(url)
        .send({
          duur: 30,
          prijs: 30,
          beschrijving: 45,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

    it('should 400 when missing "duur"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          prijs: 30,
          beschrijving: 45,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('duur');
    });

    it('should 400 when missing "prijs"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          beschrijving: 45,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('prijs');
    });

    it('should 400 when missing "beschrijving"', async () => {
      const response = await request.post(url)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          prijs: 30,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('beschrijving');
    });

  });

  describe('PUT /api/services/:id', () => {
    beforeAll(async () => {
      await prisma.service.createMany({ data: data.services });
    });

    afterAll(async () => {
      await prisma.service.deleteMany({
        where: { id: { in: dataToDelete.services } },
      });
    });

    it('should 400 when missing "naam"', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          duur: 30,
          prijs: 30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

    it('should 400 when missing "duur"', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          naam: 'Rouw begeleiding',
          prijs: 30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('duur');
    });

    it('should 400 when missing "prijs"', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          beschrijving: 'Zit je met gevoelens die rondom een sterfgeval die je niet kwijt kunt?',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('prijs');
    });

    it('should 400 when missing "beschrijving"', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          naam: 'Rouw begeleiding',
          duur: 30,
          prijs: 30,
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('beschrijving');
    });

  });

  describe('DELETE /api/services/:id', () => {

    beforeAll(async () => {
      await prisma.service.createMany({ data: data.services });
    });

    afterAll(async () => {
      await prisma.service.deleteMany({
        where: { id: { in: dataToDelete.services } },
      });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing service', async () => {
      const response = await request.delete(`${url}/5`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No service with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid service id', async () => {
      const response = await request.get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });
});
