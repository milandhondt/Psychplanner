import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';
import { prisma } from '../../src/data';
import Role from '../../src/core/roles';

const data = {
  users: [
    {
      id: 20,
      naam: 'Verhulst',
      voornaam: 'Gert',
      email: 'gertverhulst@gmail.com',
      password_hash: '123456789',
      telefoon: '+329450594803',
      roles: JSON.stringify([Role.KLANT]),
      geboortedatum: new Date('1990-10-15T12:00:00'),
      huisarts: 'Dr. Samson',
      nr: 5,
      postcode: 9000,
      stad: 'Gent',
      straat: 'Gertlaan',
    },
    {
      id: 21,
      naam: 'De Praeter',
      voornaam: 'Jannes',
      email: 'jannesdepraeter@gmail.com',
      password_hash: '123456789',
      telefoon: '+32508495830',
      roles: JSON.stringify([Role.PSYCHOLOOG]),
    },
  ],
};

const dataToDelete = {
  users: [1, 2, 20, 21],
};

describe('Services', () => {
  let request: supertest.Agent;
  let authHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/users';

  describe('GET /api/users', () => {
    beforeAll(async () => {
      await prisma.user.createMany({ data: data.users });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('it should 200 and return all users', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(4);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            voornaam: 'voornaam test user',
            naam: 'naam test user',
            email: 'test.user@hogent.be',
            telefoon: '+32478569521',
            roles: JSON.stringify([Role.KLANT]),
          },
          {
            id: 2,
            voornaam: 'voornaam psycholoog user',
            naam: 'naam psycholoog User',
            email: 'psycholoog.user@hogent.be',
            telefoon: '+32569852369',
            roles: JSON.stringify([Role.PSYCHOLOOG]),
          },
          {
            id: 20,
            naam: 'Verhulst',
            voornaam: 'Gert',
            email: 'gertverhulst@gmail.com',
            telefoon: '+329450594803',
            roles: JSON.stringify([Role.KLANT]),
          },
          {
            id: 21,
            naam: 'De Praeter',
            voornaam: 'Jannes',
            email: 'jannesdepraeter@gmail.com',
            telefoon: '+32508495830',
            roles: JSON.stringify([Role.PSYCHOLOOG]),
          },
        ]),
      );
    });

    it('should return 401 for non-authenticated users', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(401);
    });

    it('should return the logged-in user when id is "me"', async () => {
      const response = await request
        .get(`${url}/me`)
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });
    
    it('should return 404 for non-existing users', async () => {
      const response = await request
        .get(`${url}/9999`)
        .set('Authorization', authHeader);
      expect(response.status).toBe(404);
    });
    
  });
});
