import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  useToast,
  Radio,
  RadioGroup,
  Text,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import Inputveld from '../../components/Inputveld';
import { useAuth } from '../../contexts/auth';
import Error from '../../components/Error';

export default function Register() {
  const { error, loading, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const methods = useForm();

  const { getValues, handleSubmit, reset } = methods;

  const [role, setRole] = useState('klant');

  const handleCancel = useCallback(() => {
    navigate({
      pathname: '/login',
    });
    reset();
  }, [reset, navigate]);

  const handleRegister = useCallback(
    async (formData) => {
      const dataMetRol = { ...formData, roles: [role] };
      const loggedIn = await register(dataMetRol);
      if (loggedIn) {
        navigate({
          pathname: '/',
          replace: true,
        });
        toast({
          title: 'Registratie voltooid',
          description: 'Je bent succesvol geregistreerd!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [register, navigate, toast, role],
  );

  const validationRules = {
    voornaam: { required: 'Voornaam is verplicht' },
    naam: { required: 'Naam is verplicht' },
    email: { required: 'Email is verplicht' },
    telefoon: { required: 'Telefoon is verplicht' },
    password: { required: 'Wachtwoord is verplicht' },
    confirmPassword: {
      required: 'Bevestiging van wachtwoord is verplicht',
      validate: (value) => {
        const password = getValues('password');
        return password === value || 'Wachtwoorden komen niet overeen';
      },
    },
    geboortedatum: { required: 'Geboortedatum is verplicht' },
    huisnummer: { required: 'Huisnummer is verplicht' },
    postcode: { required: 'Postcode is verplicht' },
    stad: { required: 'Stad is verplicht' },
  };

  return (
    <FormProvider {...methods}>
      <Box
        maxW="md"
        mx="auto"
        my={8}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        bg="gray.50"
      >
        <Heading as="h1" size="lg" mb={6}>
          Registreren
        </Heading>

        <Error error={error} />

        <form onSubmit={handleSubmit(handleRegister)}>
          <VStack spacing={4} align="stretch">
            <Inputveld
              label="Voornaam"
              type="text"
              naam="voornaam"
              placeholder="voornaam"
              validatieregels={validationRules.voornaam}
              required={true}
            />

            <Inputveld
              label="Naam"
              type="text"
              naam="naam"
              placeholder="naam"
              validatieregels={validationRules.naam}
              required={true}
            />

            <Inputveld
              label="Telefoon"
              type="text"
              naam="telefoon"
              placeholder="telefoonnummer"
              validatieregels={validationRules.telefoon}
              required={true}
            />

            <Inputveld
              label="Email"
              type="text"
              naam="email"
              placeholder="emailadres"
              validatieregels={validationRules.email}
              required={true}
            />

            <Inputveld
              label="Wachtwoord"
              type="password"
              naam="password"
              placeholder="wachtwoord"
              validatieregels={validationRules.password}
              required={true}
            />

            <RadioGroup
              name="role"
              defaultValue="klant"
              onChange={(value) => setRole(value)}
            >
              <HStack spacing={4}>
                <Radio value="klant">Ik ben klant</Radio>
                <Radio value="psycholoog">Ik ben psycholoog</Radio>
              </HStack>
            </RadioGroup>

            {role === 'klant' ? (
              <>
                <Inputveld
                  label="Geboortedatum"
                  naam="geboortedatum"
                  type="date"
                  validatieregels={validationRules.geboortedatum}
                  required={true}
                />
                <Inputveld
                  label="Huisarts"
                  naam="huisarts"
                  type="text"
                  required={false}
                />
                <Text fontSize="lg" fontWeight="bold" mt={3} mb={1}>
                  Adres
                </Text>
                <Inputveld
                  label="Straat"
                  naam="straat"
                  type="text"
                  validatieregels={validationRules.straat}
                  required={true}
                />
                <Inputveld
                  label="Huisnummer"
                  naam="nr"
                  type="number"
                  placeholder={'huisnummer'}
                  validatieregels={validationRules.huisnummer}
                  required={true}
                />
                <Inputveld
                  label="Postcode"
                  naam="postcode"
                  type="number"
                  validatieregels={validationRules.postcode}
                  required={true}
                />
                <Inputveld
                  label="Stad"
                  naam="stad"
                  type="text"
                  validatieregels={validationRules.stad}
                  required={true}
                />
              </>
            ) : (
              <></>
            )}

            <HStack justify="space-between" mt={4}>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                w="full"
              >
                Registreren
              </Button>
              <Button
                colorScheme="gray"
                onClick={handleCancel}
                w="full"
                variant="outline"
              >
                Annuleren
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </FormProvider>
  );
}
