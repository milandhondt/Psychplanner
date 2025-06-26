export const mockAfspraken = [
  {
    id: 1,
    datum: '2024-10-11T18:13:00',
    klant_id: 2,
    psycholoog_id: 1,
    service_id: 1,
    status: 'In behandeling',
    formulierNodig: false,
  },
  {
    id: 2,
    datum: '2024-10-12T12:19:00',
    klant_id: 3,
    psycholoog_id: 1,
    service_id: 3,
    status: 'Afgelopen',
    formulierNodig: true,
  },
  {
    id: 3,
    datum: '2024-10-13T11:48:00',
    klant_id: 4,
    psycholoog_id: 1,
    service_id: 4,
    status: 'Geannuleerd',
    formulierNodig: true,
  },
];

export const mockServices = [
  {
    id: 1,
    naam: 'Intake gesprek',
    duur: 90,
    prijs: 60,
  },
  {
    id: 2,
    naam: 'Vervolg gesprek',
    duur: 90,
    prijs: 40,
  },
];

export const mockPsychologen = [
  {
    id: 1,
    naam: 'Sara De Block',
    email: 'saradeblock@gmail.com',
    telefoon: '+32478435411',
    ervaring: 8,
  },
  {
    id: 2,
    naam: 'Milan Dhondt',
    email: 'milandhondt@gmail.com',
    telefoon: '+32429872593',
    ervaring: 2,
  },
  {
    id: 3,
    naam: 'Veerle Van Herreweghe',
    email: 'veerlevh@gmail.com',
    telefoon: '+32403860372',
    ervaring: 5,
  },
];

export const mockBeschikbaarheden = [
  {
    id: 1,
    psycholoog_id: 2,
    datum_begin: '2024-10-13T11:48:00',
    datum_eind: '2024-10-13T13:48:00',
  },
  {
    id: 2,
    psycholoog_id: 1,
    datum_begin: '2024-10-15T12:00:00',
    datum_eind: '2024-10-15T17:30:00',
  },
  {
    id: 3,
    psycholoog_id: 1,
    datum_begin: '2024-10-26T09:27:00',
    datum_eind: '2024-10-26T13:59:00',
  },
  {
    id: 4,
    psycholoog_id: 3,
    datum_begin: '2024-10-29T18:17:00',
    datum_eind: '2024-10-29T19:47:00',
  },
];

export const mockKlanten = [
  {
    id: 1,
    naam: 'Barry Bart',
    email: 'barrybart@gmail.com',
    telefoon: '+32698427658',
    adres: {
      straat: 'Baanse weg',
      nr:5,
      postcode: 9964,
      stad: 'Barryland',
    },
    geboortedatum: '1985-08-06T08:37:00',
    huisarts: 'Dr. Vandervueren',
  },
  {
    id: 2,
    naam: 'Gerrit Verschraegen',
    email: 'gerryverschr@gmail.com',
    telefoon: '+32459681236',
    adres: {
      straat: 'Stationstraat',
      nr:96,
      postcode: 1245,
      stad: 'Treinia',
    },
    geboortedatum: '2000-11-19T15:16:00',
    huisarts: 'Dr. De Mager',
  },
  {
    id: 3,
    naam: 'Jens Vruycke',
    email: 'jensie123@gmail.com',
    telefoon: '+32452398622',
    adres: {
      straat: 'Eikenlaan',
      nr:78,
      postcode: 1951,
      stad: 'Surrey',
    },
    geboortedatum: '1999-06-05T05:07:00',
    huisarts: 'Dr. Sure',
  },
];
