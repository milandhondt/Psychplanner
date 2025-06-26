import Beschikbaarheid from './Beschikbaarheid';
import AsyncData from '../AsyncData';
import { getAll, deleteById, getBeschikbaarhedenByPsycholoogId } from '../../api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../../contexts/auth';

const BeschikbaarhedenLijst = () => {
  const toast = useToast();

  const { user } = useAuth();
  const user_id = user ? user.id : null;

  const { data: beschikbaarheden = [], isLoading: isLoadingB, error: errorB } =
    useSWR(`users/${user_id}/beschikbaarheden`, getBeschikbaarhedenByPsycholoogId);

  const { data: users = [], isLoadingP, errorP } = useSWR('users', getAll);
  const psychologen = users.filter((u) => u.roles == 'psycholoog');

  const { trigger: deleteBeschikbaarheid, error: deleteError } = useSWRMutation(
    'beschikbaarheden',
    deleteById,
  );

  const handleDeleteBeschikbaarheid = useCallback(
    async (id) => {
      try {
        await deleteBeschikbaarheid(id);
        toast({
          title: 'Beschikbaarheid verwijderd',
          description: 'De beschikbaarheid is succesvol verwijderd.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        console.log(deleteError);
        toast({
          title: 'Verwijderen mislukt',
          description: 'Er is iets fout gegaan bij het verwijderen van de beschikbaarheid.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [deleteBeschikbaarheid, deleteError, toast],
  );

  return (
    <AsyncData loading={isLoadingB | isLoadingP} error={errorB | errorP}>
      {
        beschikbaarheden.map((beschikbaarheid) => (
          <Beschikbaarheid
            key={beschikbaarheid.id}
            beschikbaarheid={beschikbaarheid}
            onDelete={handleDeleteBeschikbaarheid}
            psychologen={psychologen}
          />
        ))
      }
    </AsyncData>
  );
};

export default BeschikbaarhedenLijst;
