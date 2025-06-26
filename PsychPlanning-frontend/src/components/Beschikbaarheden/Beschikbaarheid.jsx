import { Box, Heading, Text, Button } from '@chakra-ui/react';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const Beschikbaarheid = ({ beschikbaarheid, onDelete, psychologen }) => {
  const { datum_start, datum_eind, psycholoog_id } = beschikbaarheid;

  const psycholoog = psychologen.find((psycholoog) => psycholoog.id === psycholoog_id);

  const psycholoogNaam = psycholoog
    ? `${psycholoog.naam} ${psycholoog.voornaam}`
    : `Psycholoog niet bestaand: id=${psycholoog_id}`;

  const dataconst_start = dateFormat.format(new Date(datum_start));
  const dataconst_eind = dateFormat.format(new Date(datum_eind));

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      my={5}
    >
      <Heading as="h3" size="md" mb={4} color="gray.700">
        {psycholoogNaam}
      </Heading>
      <Text>
        <strong>Start:</strong> {dataconst_start}
      </Text>
      <Text>
        <strong>Eind:</strong> {dataconst_eind}
      </Text>
      <Button mt={5} colorScheme="red" onClick={() => onDelete(beschikbaarheid.id)}>
        Verwijderen
      </Button>
    </Box>
  );
};

export default Beschikbaarheid;