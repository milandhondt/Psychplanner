import { useCallback } from 'react';
import Inputveld from '../../components/Inputveld';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useAuth } from '../../contexts/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react';
import Error from '../../components/Error';

const validationRules = {
  email: { required: 'email is vereist' },
  password: { required: 'wachtwoord is vereist' },
};

const LogIn = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const methods = useForm();

  const { handleSubmit } = methods;

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate, search],
  );

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
      p={4}
    >
      <FormProvider {...methods}>
        <Box
          maxW={{ base: 'full', sm: '400px' }}
          w="100%"
          p={{ base: 6, sm: 8 }}
          borderRadius="lg"
          boxShadow="xl"
          bg="white"
        >
          <form onSubmit={handleSubmit(handleLogin)}>
            <Heading
              as="h1"
              size="lg"
              mb={6}
              textAlign="center"
            >
              Log in
            </Heading>
            <Error error={error} />
            <VStack spacing={4}>
              <Inputveld
                label="E-mail"
                type="text"
                naam="email"
                placeholder="emailadres"
                validatieregels={validationRules.email}
                data-cy='email_input'
              />

              <Inputveld
                label="Wachtwoord"
                type='password'
                naam="password"
                placeholder="wachtwoord"
                validatieregels={validationRules.password}
                data-cy='password_input'
              />

            </VStack>

            <Text fontSize="md" mt={4} textAlign="center">
              Nog geen account? Registreer{' '}
              <ChakraLink
                textDecoration="underline"
                color="blue.500"
                as={Link}
                to="/registreer"
              >
                hier
              </ChakraLink>
            </Text>

            <VStack spacing={4} mt={6}>
              <Button colorScheme="blue" type="submit" width="full" data-cy='submit_btn'
              >
                Log in
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                width="full"
                onClick={handleCancel}
              >
                Annuleren
              </Button>
            </VStack>
          </form>
        </Box>
      </FormProvider>
    </Flex>
  );
};

export default LogIn;
