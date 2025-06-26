import { Heading, Text, Button, Icon, Tr, Td } from '@chakra-ui/react';
import { IoTrashOutline } from 'react-icons/io5';
import { memo } from 'react';
import { useAuth } from '../../contexts/auth';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const Afspraak = memo(function Afspraak({
  id,
  datum,
  klant_id,
  psycholoog_id,
  service_id,
  formulier_nodig,
  opmerking,
  onDelete,
  psychologen = [],
  services = [],
  klanten = [],
}) {
  const handleDelete = () => {
    onDelete(id);
  };

  const serviceNaam =
    service_id && services.find((service) => service.id === service_id)
      ?.naam || 'Service niet meer beschikbaar';

  const psycholoogNaam =
    psychologen.find((psycholoog) => psycholoog.id === psycholoog_id)
      ?.naam || `Psycholoog niet bestaand: id=${psycholoog_id}`;

  const klant = klanten.find((klant) => klant.id === klant_id);
  const klantNaam = klant
    ? `${klant.voornaam} ${klant.naam}`
    : `Klant niet bestaand: id=${klant_id}`;

  const dataconst = dateFormat.format(new Date(datum));

  const { user } = useAuth();
  const roles = user ? user.roles : [];

  return (
    <Tr>
      <Td>
        <Heading as="h3" size="md" mb={3} color="gray.700">
          {serviceNaam}
        </Heading>
      </Td>
      <Td>
        <Text>{dataconst}</Text>
      </Td>
      {
        roles === 'klant' ?
          (
            <Td>
              <Text>{psycholoogNaam}</Text>
            </Td>
          ) : (
            <Td>
              <Text>{klantNaam}</Text>
            </Td >
          )
      }
      <Td>
        <Text>{opmerking}</Text>
      </Td>
      <Td>
        <Text>
          <strong>{formulier_nodig ? 'Ja' : 'Nee'}</strong>
        </Text>
      </Td>
      <Td>
        <Button
          mt={4}
          colorScheme="red"
          leftIcon={<Icon as={IoTrashOutline} />}
          onClick={handleDelete}
          size="sm"
        >
          Verwijderen
        </Button>
      </Td>
    </Tr >
  );
});

export default Afspraak;
