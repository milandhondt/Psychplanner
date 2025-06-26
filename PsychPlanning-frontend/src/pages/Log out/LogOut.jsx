import { useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import { Box, Center, Heading, Spinner, Text } from '@chakra-ui/react';

const LogOut = () => {
  const { isAuthed, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <Center
      h="100vh"
      bg="gray.100"
      p={4}
    >
      <Box
        textAlign="center"
        p={6}
        borderRadius="md"
        boxShadow="base"
        bg="white"
        w="full"
        maxW="400px"
      >
        {isAuthed ? (
          <>
            <Spinner size="lg" color="gray.500" mb={4} />
            <Heading as="h1" size="md" mb={2} color="gray.800">
              Uitloggen...
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Even geduld terwijl je wordt afgemeld.
            </Text>
          </>
        ) : (
          <>
            <Heading as="h1" size="xl" mb={2} color="gray.800">
              Je bent afgemeld
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Je kunt deze pagina sluiten of opnieuw inloggen wanneer je wilt.
            </Text>
          </>
        )}
      </Box>
    </Center>
  );
};

export default LogOut;
