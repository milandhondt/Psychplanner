import { useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import {
  Box, Button, FormControl, FormLabel, Select,
  Alert, AlertIcon, AlertDescription,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import Footnote from '../Footnote';
import SelectList from '../SelectList';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import useSWR from 'swr';
import { getBeschikbaarhedenByPsycholoogId, deleteById } from '../../api';
import AsyncData from '../AsyncData';
import CheckBox from '../CheckBox';
import TextArea from '../TextArea';
import {
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/auth';
import useSWRMutation from 'swr/mutation';

const LEGE_AFSPRAAK = {
  datum: new Date(),
  opmerking: '',
  formulier_nodig: false,
  klant_id: '',
  psycholoog_id: '',
  service_id: '',
};

const validatieRegels = {
  datum: {
    required: 'Datum is vereist',
    valueAsDate: true,
  },
  klant_id: {
    required: 'Klant id is vereist',
    valueAsNumber: true,
  },
  psycholoog_id: {
    required: 'Psycholoog id is vereist',
    valueAsNumber: true,
  },
  service_id: {
    required: 'Service id is vereist',
    valueAsNumber: true,
  },
};

const filterData = (beschikbaarheden) => {
  const data = [];

  for (const beschikbaarheid of beschikbaarheden) {

    const datum_start = beschikbaarheid.datum_start;

    const datum_start_split_index = datum_start?.indexOf('T');

    const datum_start_split = datum_start.slice(0, datum_start_split_index);

    data.push(new Date(datum_start_split));
  }

  return data;
};

const filterTijden = (beschikbaarheden, gekozenDatum) => {
  const tijden = [];

  if (gekozenDatum) {
    for (const beschikbaarheid of beschikbaarheden) {

      const datum_start = new Date(beschikbaarheid.datum_start);
      const datum_eind = new Date(beschikbaarheid.datum_eind);

      if (gekozenDatum.toLocaleDateString() === datum_start.toLocaleDateString()) {
        let start_tijd = new Date(datum_start);

        while (start_tijd < datum_eind) {
          const volgende_tijd = new Date(start_tijd);
          volgende_tijd.setHours(volgende_tijd.getHours() + 1);

          if (volgende_tijd <= datum_eind) {
            tijden.push(start_tijd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            break;
          }

          start_tijd = volgende_tijd;
        }
      }

    }
  }

  return tijden;
};

const NieuweAfspraak = ({ psychologen = [], services = [], afspraak = LEGE_AFSPRAAK, saveAfspraak }) => {

  const [datum, setDatum] = useState();
  const [gekozenTijd, setGekozenTijd] = useState('');
  const [gekozenPsycholoog, setGekozenPsycholoog] = useState(1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const { user } = useAuth();

  const { data: beschikbaarheden = [], isLoading: isLoadingB, error: errorB } =
    useSWR(`users/${gekozenPsycholoog}/beschikbaarheden`, getBeschikbaarhedenByPsycholoogId);

  const { trigger: deleteBeschikbaarheid, error: deleteError } = useSWRMutation(
    'beschikbaarheden',
    deleteById,
  );

  const handlePsycholoogChange = useCallback((e) => {
    setGekozenPsycholoog(Number(e.target.value));
    setDatum();
    setGekozenTijd('');
  }, []);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      datum: afspraak.datum,
      opmerking: afspraak?.opmerking,
      formulier_nodig: afspraak.formulier_nodig,
      klant_id: user?.id,
      psycholoog_id: afspraak.psycholoog_id,
      service_id: afspraak.service_id,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting }, reset,
  } = methods;

  const onSubmit = async () => {
    if (!isValid) return;
    setAlertOpen(true);
  };

  const handleConfirmAfspraak = async (waarden) => {
    setAlertOpen(false);
    await saveAfspraak({
      ...waarden,
      klant_id: user.id,
    }).then(() => {

      let beschikbaarheid_id = null;
      for (const beschikbaarheid of beschikbaarheden) {
        if (beschikbaarheid.datum_start == waarden.datum.toISOString()) {
          beschikbaarheid_id = beschikbaarheid.id;
        }
      }
      try {
        deleteBeschikbaarheid(beschikbaarheid_id);
      } catch (error) {
        console.error(error);
        console.error(deleteError);
      }
      reset(LEGE_AFSPRAAK);
      navigate('/afspraak-plannen/afspraken');
      window.location.reload();
      toast({
        title: 'Afspraak vastgelegd',
        description: 'Je afspraak is succesvol vastgelegd!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }).catch((error) => {
      let errorMessage = 'Er ging iets fout bij het vastleggen van je afspraak';
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

  const handleTijdChange = (tijd) => {
    setGekozenTijd(tijd);
    if (datum && tijd) {
      const [uren, minuten] = tijd.split(':');
      const nieuweDatum = new Date(datum);
      nieuweDatum.setHours(uren);
      nieuweDatum.setMinutes(minuten);
      setDatum(nieuweDatum);
      methods.setValue('datum', nieuweDatum);
    }
  };

  return (
    <>
      <Box maxW={{ base: '100%', md: '600px' }} mx="auto" p={5} bg="gray.50" borderRadius="md" shadow="md" mb={5}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Alert status="info" mb={5} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertDescription>
                  Voor elke afspraak wordt <strong>1 uur</strong> vastgelegd.
                </AlertDescription>
              </Box>
            </Alert>
            <SelectList
              label={'Psycholoog selecteren'}
              naam={'psycholoog_id'}
              isRequired={true}
              placeholder={'-- Selecteer een psycholoog --'}
              validatieregels={validatieRegels.psycholoog_id}
              items={psychologen}
              isPsychologenLijst={true}
              onChange={handlePsycholoogChange}
              data-cy='psycholoog_select'
            />
            <SelectList
              label={'Service selecteren'}
              naam={'service_id'}
              isRequired={true}
              placeholder={'-- Selecteer een service --'}
              items={services}
              validatieregels={validatieRegels.service_id}
              data-cy='service_select'
            />

            <AsyncData error={errorB} loading={isLoadingB}>
              <FormControl mb={4} isRequired>
                <FormLabel>Datum Selecteren</FormLabel>
                <DatePicker
                  data-cy='datum_input'
                  inline
                  selected={datum}
                  onChange={(datum) => {
                    setDatum(datum);
                    methods.setValue('datum', datum);
                    setGekozenTijd('');
                  }}
                  includeDates={filterData(beschikbaarheden)}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Tijd Selecteren</FormLabel>
                <Select
                  placeholder="-- Selecteer een tijd --"
                  value={gekozenTijd}
                  onChange={(e) => handleTijdChange(e.target.value)}
                  data-cy='tijd_select'
                >
                  {filterTijden(beschikbaarheden, datum).map((tijd, index) => (
                    <option key={index} value={tijd}>
                      {tijd}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </AsyncData>

            <TextArea
              label={'Opmerkingen'}
              naam={'opmerking'}
              tekst={'Heb je een opmerking? Een vraag? Voeg deze hier toe!'}
              required={false}
              data-cy='opmerkingen_input'
            />

            <CheckBox
              naam={'formulier_nodig'}
              required={false}
              tekst={' Formulier voor verzekering nodig'}
              data-cy='formulierNodig_check'
            />

            <Box display="flex" justifyContent="center" mt={4}>
              <Button colorScheme="blue" type='submit' disabled={isSubmitting} data-cy='submit_afspraak'>
                Vastleggen
              </Button>
              <Button colorScheme='red' ml={10}>
                <Link
                  disabled={isSubmitting}
                  to='/afspraak-plannen/afspraken'
                >
                  Annuleren
                </Link>
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box >

      <AlertDialog isOpen={isAlertOpen} onClose={() => setAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Weet je zeker dat je deze afspraak wilt vastleggen?</AlertDialogHeader>
            <AlertDialogBody>
              Als je deze afspraak vastlegt, kan deze niet meer worden gewijzigd.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setAlertOpen(false)}>Annuleren</Button>
              <Button colorScheme="blue" ml={3} onClick={() => handleConfirmAfspraak(methods.getValues())}>
                Bevestigen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Footnote tekst="Opgepast: Als je minder dan 48 uur op voorhand afzegt, 
      dan wordt de afspraak toch in rekening gebracht." />
    </>
  );
};

export default NieuweAfspraak;
