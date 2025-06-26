import { Box, Heading, Text, Button } from '@chakra-ui/react';

const Service = ({ service, onDelete, heeftKnop }) => {
  
  const { naam, beschrijving, duur, prijs } = service;

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      my={5}
      data-cy="service_service"
    >
      <Heading as="h3" size="md" mb={4} color="gray.700" data-cy="service_naam">
        {naam}
      </Heading>
      <Text data-cy='service_beschrijving' mb={4}>{beschrijving}</Text>
      <Text data-cy='service_duur'>
        <strong>Duur:</strong> {duur} minuten
      </Text>
      <Text data-cy="service_prijs">
        <strong>Prijs:</strong> €{prijs}
      </Text>
      {heeftKnop ? (<Button data-cy='btn_delete' mt={5} colorScheme="red" onClick={() => onDelete(service.id)}>
        Verwijderen
      </Button>) : <></>}
    </Box>
  );
};

export default Service;