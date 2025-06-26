import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      p={5}
    >
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        bg="white"
        shadow="lg"
        textAlign="center"
      >
        <Heading as="h1" size="2xl" mb={4} color="red.500">
          Er is een fout opgetreden.
        </Heading>
        <Text fontSize="lg" mb={6}>
          Oeps! Er is geen pagina met de URL <strong>{pathname}</strong>.
        </Text>
        <Button colorScheme="blue" onClick={handleGoHome}>
          Terug naar homepagina
        </Button>
      </Box>
    </Flex>
  );
};

export default NotFound;
