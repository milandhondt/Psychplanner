import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { hashPassword } from '../../src/core/password';
import Role from '../../src/core/roles';
import { prisma } from '../../src/data';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword('12345678');
    await prisma.user.createMany({
      data: [
        {
          id: 1,
          voornaam: 'voornaam test user',
          naam: 'naam test user',
          email: 'test.user@hogent.be',
          telefoon: '+32478569521',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.KLANT]),
          straat: 'Stationstraat',
          nr: 24,
          postcode: 9704,
          stad: 'Onbekendiestan',
          huisarts: 'Dr. Dhondt',
        },
        {
          id: 2,
          voornaam: 'voornaam psycholoog user',
          naam: 'naam psycholoog User',
          email: 'psycholoog.user@hogent.be',
          telefoon: '+32569852369',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.PSYCHOLOOG]),
        },
      ],
    });
    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await server.stop();
    await prisma.afspraak.deleteMany();
    await prisma.user.deleteMany();
    await prisma.beschikbaarheid.deleteMany();
    await prisma.service.deleteMany();
  });
}
