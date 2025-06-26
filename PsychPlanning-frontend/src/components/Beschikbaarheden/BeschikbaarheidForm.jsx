import {
  Box, Button, FormControl, FormLabel, Heading, HStack, useToast, Text,
  Alert, AlertIcon, AlertTitle, AlertDescription,
} from '@chakra-ui/react';
import Inputveld from '../Inputveld';
import { useForm, FormProvider } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth';

const LEGE_BESCHIKBAARHEID = {
  datum_start: new Date(),
  datum_eind: new Date(),
  psycholoog_id: '',
};

const validatieRegels = {
  datum_start: {
    required: 'Start tijd is vereist',
    valueAsDate: false,
  },
  datum_eind: {
    required: 'Eind tijd is vereist',
    valueAsDate: false,
  },
  psycholoog_id: {
    required: 'Psycholoog id is vereist',
    valueAsNumber: true,
  },
};

const datumEnTijdGecombineerd = (datum, tijd) => {
  const [uur, minuut] = tijd.split(':').map(Number);
  const gecombineerdeDatum = new Date(datum);
  gecombineerdeDatum.setHours(uur, minuut, 0, 0);
  return gecombineerdeDatum;
};

const BeschikbaarheidForm = ({ beschikbaarheid = LEGE_BESCHIKBAARHEID, saveBeschikbaarheid }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gekozenDatum, setgekozenDatum] = useState(new Date());

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      datum_start: '',
      datum_eind: '',
      psycholoog_id: user?.id || '',
    },
  });

  const handleCancel = () => {
    methods.reset(LEGE_BESCHIKBAARHEID);
    setgekozenDatum(new Date());
  };

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;

    const datum_start = datumEnTijdGecombineerd(gekozenDatum, values.datum_start);
    const datum_eind = datumEnTijdGecombineerd(gekozenDatum, values.datum_eind);

    const duur = datum_eind - datum_start;

    if (duur < 60 * 60 * 1000) {
      toast({
        title: 'Beschikbaarheid te kort!',
        description: 'De beschikbaarheid moet minstens 1 uur lang zijn.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const gebruikteWaarden = {
      datum_start,
      datum_eind,
      psycholoog_id: user?.id,
    };

    try {
      await saveBeschikbaarheid(
        {
          id: beschikbaarheid?.id,
          ...gebruikteWaarden,
        },
        {
          throwOnError: false,
          onSuccess: () => {
            toast({
              title: 'Beschikbaarheid opgeslagen',
              description: 'De beschikbaarheid is succesvol toegevoegd.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            navigate('/mijn-profiel/beschikbaarheden');
            reset(LEGE_BESCHIKBAARHEID);
            setgekozenDatum(new Date());
          },
        },
      );
    } catch (error) {
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een probleem opgetreden bij het opslaan van de beschikbaarheid. Probeer het later opnieuw.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={5} bg="gray.50" borderRadius="md" shadow="md" mb={5}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading as="h2" size="lg" mb={5}>
            Beschikbaarheid instellen
          </Heading>
          <Alert status="info" mb={5} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle mb={2}>Opgepast!</AlertTitle>
              <AlertDescription>
                Geef uw beschikbaarheden in <strong>per uur! </strong>
                Bijvoorbeeld, als u beschikbaar bent van 12:00 tot 15:00,
                voer dan drie aparte beschikbaarheden in:
                <Text mt={2}>
                  1. 12:00 - 13:00<br />
                  2. 13:00 - 14:00<br />
                  3. 14:00 - 15:00
                </Text>
              </AlertDescription>
            </Box>
          </Alert>

          <FormControl mb={4} isRequired>
            <FormLabel>Datum Selecteren</FormLabel>
            <DatePicker
              inline
              selected={gekozenDatum}
              onChange={(date) => setgekozenDatum(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Selecteer een datum"
            />
          </FormControl>

          <Inputveld
            label="Start tijd"
            naam="datum_start"
            type="time"
            required
            validatieregels={validatieRegels.datum_start}
          />

          <Inputveld
            label="Eind tijd"
            naam="datum_eind"
            type="time"
            required
            validatieregels={validatieRegels.datum_eind}
          />

          <HStack mt={5} justify="space-between">
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              isDisabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              data-cy="btn_submit"
            >
              Toevoegen
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default BeschikbaarheidForm;
