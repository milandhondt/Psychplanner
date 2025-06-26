import { Box, Button, useToast, Text } from '@chakra-ui/react';
import Footnote from '../Footnote';
import Inputveld from '../Inputveld';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { useCallback } from 'react';

const LEGE_FORM = {
  voornaam: '',
  naam: '',
  email: '',
  telefoonnr: '',
  geboortedatum: new Date(),
  straat: '',
  huisnummer: '',
  postcode: '',
  stad: '',
  huisarts: '',
};

const validatieRegels = {
  voornaam: {
    required: 'Voornaam is verplicht',
  },
  naam: {
    required: 'Naam is verplicht',
  },
  email: {
    required: 'Email is verplicht',
  },
  telefoonnr: {
    required: 'Telefoonnr is verplicht',
  },
  wachtwoord: {
    required: 'Wachtwoord is verplicht',
  },
  geboortedatum: {
    required: 'Geboortedatum is verplicht',
    valueAsDate: true,
  },
  straat: {
    required: 'Straat is verplicht',
  },
  huisnummer: {
    required: 'Huisnummer is verplicht',
    valueAsNumber: true,
  },
  postcode: {
    required: 'Postcode is verplicht',
    valueAsNumber: true,
  },
  stad: {
    required: 'Stad is verplicht',
  },
};

const WijzigGegevens = ({ gegevens = LEGE_FORM, saveGegevens }) => {
  const toast = useToast();

  const { user } = useAuth();
  const user_id = user ? user.id : null;
  const user_role = user ? user.roles : 'klant';

  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: gegevens.naam,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting }, reset,
  } = methods;

  const handleCancel = useCallback(() => {
    navigate({
      pathname: '/login',
    });
    reset();
  }, [reset, navigate]);

  const onSubmit = async (waarden) => {
    if (!isValid) return;
    await saveGegevens({
      id: user_id,
      roles: [user_role],
      ...waarden,
    }).then(() => {
      reset(LEGE_FORM);
      navigate('/');
      toast({
        title: 'Gegevens gewijzigd!',
        description: 'Je gegevens werden succesvol gewijzigd!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }).catch((error) => {
      let errorMessage = 'Er ging iets fout bij het wijzigen van je gegevens';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: 'Fout, probeer het opnieuw',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <>
      <Box maxW="600px" mx="auto" p={5} bg="gray.50" borderRadius="md" shadow="md" mb={5}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Gegevens aanpassen
            </Text>
            <Inputveld
              label="Voornaam"
              type="text"
              naam="voornaam"
              placeholder="voornaam"
              validatieregels={validatieRegels.voornaam}
              required={true}
            />

            <Inputveld
              label="Naam"
              type="text"
              naam="naam"
              placeholder="naam"
              validatieregels={validatieRegels.naam}
              required={true}
            />

            <Inputveld
              label="Telefoon"
              type="text"
              naam="telefoon"
              placeholder="telefoonnummer"
              validatieregels={validatieRegels.telefoon}
              required={true}
            />

            <Inputveld
              label="Email"
              type="text"
              naam="email"
              placeholder="emailadres"
              validatieregels={validatieRegels.email}
              required={true}
            />

            <Inputveld
              label="Wachtwoord"
              type="password"
              naam="password"
              placeholder="wachtwoord"
              validatieregels={validatieRegels.password}
              required={true}
            />

            <Inputveld
              label="Geboortedatum"
              naam="geboortedatum"
              type="date"
              validatieregels={validatieRegels.geboortedatum}
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
              validatieregels={validatieRegels.straat}
              required={true}
            />
            <Inputveld
              label="Huisnummer"
              naam="nr"
              type="number"
              placeholder={'huisnummer'}
              validatieregels={validatieRegels.huisnummer}
              required={true}
            />
            <Inputveld
              label="Postcode"
              naam="postcode"
              type="number"
              validatieregels={validatieRegels.postcode}
              required={true}
            />
            <Inputveld
              label="Stad"
              naam="stad"
              type="text"
              validatieregels={validatieRegels.stad}
              required={true}
            />

            <Box display="flex" justifyContent="center" mt={4}>
              <Button colorScheme="blue" type='submit' disabled={isSubmitting} onClick={handleSubmit}>
                Bevestig
              </Button>
              <Button colorScheme='red' ml={10} onClick={handleCancel}>
                Annuleren
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box >
      <Footnote tekst={'Let op: Zorg ervoor dat je alle informatie correct invult.'} />
    </>
  );
};

export default WijzigGegevens;
