import { useState } from 'react';
import { Select, Box, Stack, useToast, Button } from '@chakra-ui/react';
import useSWRMutation from 'swr/mutation';
import { deleteById } from '../../api';
import AfsprakenTable from './AfsprakenTable';
import {
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react';

const AfsprakenLijst = ({ services, psychologen, afspraken, klanten }) => {
  const [sorteerVolgorde, setSorteerVolgorde] = useState('datumOplopend');
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [afspraakToDelete, setAfspraakToDelete] = useState(null);

  const toast = useToast();

  const { trigger: deleteAfspraak, error: deleteError } = useSWRMutation(
    'afspraken',
    deleteById,
  );

  const handleDeleteClick = (id) => {
    setAfspraakToDelete(id);
    setAlertOpen(true);
  };

  const handleDeleteAfspraak = async () => {
    if (!afspraakToDelete) return;
    try {
      await deleteAfspraak(afspraakToDelete);
      toast({
        title: 'Afspraak succesvol verwijderd',
        description: 'De afspraak is succesvol verwijderd.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Verwijderen mislukt',
        description: 'Er is een fout opgetreden bij het verwijderen van de afspraak.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
      console.log(deleteError);
    } finally {
      setAlertOpen(false);
      window.location.reload();
    }
  };

  const sortedAfspraken = Array.isArray(afspraken) && afspraken.length > 0
    ? afspraken.sort((a, b) => {
      const datumA = new Date(a.datum);
      const datumB = new Date(b.datum);
      return sorteerVolgorde === 'datumOplopend' ? datumA - datumB : datumB - datumA;
    })
    : [];

  return (
    <Box>
      <AlertDialog isOpen={isAlertOpen} onClose={() => setAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Weet je zeker dat je deze afspraak wilt verwijderen?</AlertDialogHeader>
            <AlertDialogBody>
              Als je deze afspraak verwijdert, kan deze niet meer worden hersteld.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setAlertOpen(false)}>Annuleren</Button>
              <Button colorScheme="red" onClick={handleDeleteAfspraak} ml={3}>
                Verwijderen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Stack direction="row" spacing={4} margin={5}>
        <Select
          value={sorteerVolgorde}
          onChange={(e) => setSorteerVolgorde(e.target.value)}
        >
          <option value="datumOplopend">Datum oplopend</option>
          <option value="datumAflopend">Datum aflopend</option>
        </Select>
      </Stack>

      <Box>
        <AfsprakenTable
          afspraken={sortedAfspraken}
          services={services}
          psychologen={psychologen}
          klanten={klanten}
          onDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  );
};

export default AfsprakenLijst;
