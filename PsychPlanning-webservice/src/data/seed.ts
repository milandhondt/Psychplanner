import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../core/password';
import roles from '../core/roles';

const prisma = new PrismaClient();

async function main() {

  const passwordHash = await hashPassword('12345678');
  await prisma.afspraak.deleteMany();
  await prisma.beschikbaarheid.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();

  // Seed services
  await prisma.service.createMany({
    data: [
      {
        id: 1,
        naam: 'Intake gesprek',
        duur: 90,
        prijs: 60,
        beschrijving: 'Inleidend gesprek om te praten over waar ik jou bij kan helpen',
      },
      {
        id: 2,
        naam: 'Vervolg gesprek',
        duur: 60,
        prijs: 40,
        beschrijving: 'Een gesprek waarbij we verder werken op voorgaande gesprekken, en progressie proberen boeken',
      },
    ],
  });

  // Seed users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        voornaam: 'Thomas',
        naam: 'Aelbrecht',
        email: 'thomas.aelbrecht@hogent.be',
        telefoon: '+32459687175',
        password_hash: passwordHash,
        roles: roles.PSYCHOLOOG,
      },
      {
        id: 2,
        voornaam: 'Pieter',
        naam: 'Van Der Helst',
        email: 'pieter.vanderhelst@hogent.be',
        telefoon: '+32698521749',
        password_hash: passwordHash,
        roles: roles.PSYCHOLOOG,
      },
      {
        id: 3,
        voornaam: 'Karine',
        naam: 'Samyn',
        email: 'karine.samyn@hogent.be',
        telefoon: '+32698741256',
        password_hash: passwordHash,
        roles: roles.PSYCHOLOOG,
      },
      {
        id: 4,
        voornaam: 'Barry',
        naam: 'Bart',
        email: 'barrybart@gmail.com',
        telefoon: '+32394857610',
        password_hash: passwordHash,
        roles: roles.KLANT,
        geboortedatum: new Date('2000-10-15T12:00:00'),
        huisarts: 'Dr. Dhondt',
        straat: 'Tulpenlaan',
        nr: 5,
        postcode: 9080,
        stad: 'Lochristi',
      },
      {
        id: 5,
        voornaam: 'Gert',
        naam: 'Van Steenberghe',
        email: 'gertvstb@gmail.com',
        telefoon: '+32958009164',
        password_hash: passwordHash,
        roles: roles.KLANT,
        geboortedatum: new Date('1989-05-04T02:00:00'),
        huisarts: 'Dr. Vandenburie',
        straat: 'Gentsebaan',
        nr: 12,
        postcode: 9000,
        stad: 'Gent',
      },
      {
        id: 6,
        voornaam: 'Charla',
        naam: 'Vervleugd',
        email: 'charlavervl@gmail.com',
        telefoon: '+32478903726',
        password_hash: passwordHash,
        roles: roles.KLANT,
        geboortedatum: new Date('2004-01-17T12:05:00'),
        straat: 'Steenweg',
        nr: 545,
        postcode: 1246,
        stad: 'Kirgizistad',
      },
    ],
  });

  // Seed afspraken
  await prisma.afspraak.createMany({
    data: [
      {
        id: 1,
        datum: new Date('2024-10-11T18:13:00'),
        klant_id: 4,
        psycholoog_id: 1,
        service_id: 1,
        formulier_nodig: false,
        opmerking: 'Dit is een testopmerking, nr 1!',
      },
      {
        id: 2,
        datum: new Date('2024-10-12T12:19:00'),
        klant_id: 5,
        psycholoog_id: 2,
        service_id: 1,
        formulier_nodig: true,
        opmerking: 'Dit is een testopmerking, nr 2!',
      },
      {
        id: 3,
        datum: new Date('2024-10-13T11:48:00'),
        klant_id: 6,
        psycholoog_id: 1,
        service_id: 1,
        formulier_nodig: true,
        opmerking: 'Dit is een testopmerking, nr 3!',
      },
      {
        id: 4,
        datum: new Date('2024-10-13T11:48:00'),
        klant_id: 6,
        psycholoog_id: 3,
        service_id: 1,
        formulier_nodig: true,
        opmerking: 'Dit is een testopmerking, nr 4!',
      },
    ],
  });

  // Seed beschikbaarheden
  await prisma.beschikbaarheid.createMany({
    data: [
      {
        id: 1,
        psycholoog_id: 1,
        datum_start: new Date('2024-10-15T12:00:00'),
        datum_eind: new Date('2024-10-15T13:00:00'),
      },
      {
        id: 2,
        psycholoog_id: 1,
        datum_start: new Date('2024-10-26T09:00:00'),
        datum_eind: new Date('2024-10-26T10:00:00'),
      },
      {
        id: 3,
        psycholoog_id: 1,
        datum_start: new Date('2024-10-26T10:00:00'),
        datum_eind: new Date('2024-10-26T11:00:00'),
      },{
        id: 4,
        psycholoog_id: 1,
        datum_start: new Date('2024-10-26T11:00:00'),
        datum_eind: new Date('2024-10-26T12:00:00'),
      },
      {
        id: 5,
        psycholoog_id: 2,
        datum_start: new Date('2024-10-13T12:00:00'),
        datum_eind: new Date('2024-10-13T13:00:00'),
      },
      {
        id: 6,
        psycholoog_id: 2,
        datum_start: new Date('2024-10-13T13:00:00'),
        datum_eind: new Date('2024-10-13T14:00:00'),
      },
      {
        id: 7,
        psycholoog_id: 2,
        datum_start: new Date('2024-10-13T14:00:00'),
        datum_eind: new Date('2024-10-13T15:00:00'),
      },
      {
        id: 8,
        psycholoog_id: 2,
        datum_start: new Date('2024-10-16T12:00:00'),
        datum_eind: new Date('2024-10-16T13:00:00'),
      },
      {
        id: 9,
        psycholoog_id: 3,
        datum_start: new Date('2024-10-13T13:00:00'),
        datum_eind: new Date('2024-10-13T14:00:00'),
      },
      {
        id: 10,
        psycholoog_id: 3,
        datum_start: new Date('2024-10-13T14:00:00'),
        datum_eind: new Date('2024-10-13T15:00:00'),
      },
      {
        id: 11,
        psycholoog_id: 3,
        datum_start: new Date('2024-10-16T12:00:00'),
        datum_eind: new Date('2024-10-16T13:00:00'),
      },
    ],
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
