import { Box, VStack, Text } from '@chakra-ui/react';
import Service from './Service';
import AsyncData from '../AsyncData';
import { getAll, deleteById } from '../../api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

const ServicesLijst = ({ staatOpHomepagina }) => {
  const toast = useToast();
  
  const { data: services = [], isLoading, error } = useSWR('services', getAll);
  
  const { trigger: deleteService, error: deleteError } = useSWRMutation(
    'services',
    deleteById,
  );
  
  const handleDeleteService = useCallback(
    async (id) => {
      try {
        await deleteService(id);
        toast({
          title: 'Service verwijderd',
          description: 'De service is succesvol verwijderd.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: 'Verwijderen mislukt',
          description: 'Er is iets fout gegaan bij het verwijderen van de service.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [deleteService, toast],
  );

  return (
    <AsyncData loading={isLoading} error={error || deleteError}>
      <div>
        <div data-cy="service_lijst">
          {Array.isArray(services) && services.length > 0 ? (
            services.map((service) => (
              <Service
                key={service.id}
                service={service}
                onDelete={handleDeleteService}
                heeftKnop={staatOpHomepagina ? false : true}
              />
            ))
          ) : staatOpHomepagina ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              textAlign="center"
              bg="gray.100"
              boxShadow="md"
              mb={10}
            >
              <Text fontSize="lg" color="gray.500">
                Er zijn momenteel geen services beschikbaar.
              </Text>
            </Box>
          ) : (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              textAlign="center"
              bg="gray.50"
              boxShadow="md"
              mb={10}
            >
              <VStack spacing={4}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.600">
                  Jij biedt nog geen services aan
                </Text>
                <Text fontSize="lg" color="gray.500">
                  Voeg je eerste service toe en maak jouw diensten zichtbaar!
                </Text>
              </VStack>
            </Box>
          )}
        </div>
      </div>
    </AsyncData>
  );
};

export default ServicesLijst;
