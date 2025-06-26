import { Button, Box, Heading, HStack, useToast } from '@chakra-ui/react';
import TextArea from '../TextArea';
import Inputveld from '../Inputveld';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const LEGE_SERVICE = {
  naam: '',
  duur: '',
  prijs: '',
  beschrijving: '',
};

const validatieRegels = {
  naam: {
    required: 'Naam is verplicht',
  },
  duur: {
    required: 'Duur is verplicht',
    valueAsNumber: true,
  },
  prijs: {
    required: 'Prijs is verplicht',
    valueAsNumber: true,
  },
  beschrijving: {
    required: 'Beschrijving is verplicht',
  },
};

const ServiceForm = ({ service = LEGE_SERVICE, saveService }) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: service.naam,
      duur: service.duur,
      prijs: service.prijs,
      beschrijving: service.beschrijving,
    },
  });
  
  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = methods;
  
  const onSubmit = async (values) => {
    if (!isValid) return;
  
    try {
      await saveService(
        {
          id: service?.id,
          ...values,
        },
        {
          throwOnError: false,
          onSuccess: () => {
            toast({
              title: 'Service opgeslagen',
              description: 'De service is succesvol toegevoegd.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            navigate('/mijn-profiel/mijn-services');
            reset(LEGE_SERVICE);
          },
        },
      );
    } catch (error) {
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een probleem opgetreden bij het opslaan van de service. Probeer het later opnieuw.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    reset(LEGE_SERVICE);
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      my={5}
    >
      <FormProvider {...methods}>
        <form data-cy='formulier_service' onSubmit={handleSubmit(onSubmit)}>
          <Heading as="h3" size="md" mb={4}>
            Nieuwe service toevoegen
          </Heading>
          <Inputveld
            label="Naam"
            naam="naam"
            type="text"
            required
            validatieregels={validatieRegels.naam}
            data-cy='naam_input_service'
            id='naam_input_service'
          />
          <Inputveld
            label="Duur (in minuten)"
            naam="duur"
            type="number"
            required
            validatieregels={validatieRegels.duur}
            data-cy='duur_input'
            id='duur_input'
          />
          <Inputveld
            label="Prijs"
            naam="prijs"
            type="number"
            required
            validatieregels={validatieRegels.prijs}
            data-cy='prijs_input'
            id='prijs_input'
          />
          <TextArea
            label="Beschrijving"
            naam="beschrijving"
            tekst="Voeg hier een korte beschrijving toe"
            required
            data-cy='beschrijving_input'
            id='beschrijving_input'
          />
          <HStack mt={5} justify="space-between">
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              isDisabled={isSubmitting}
              data-cy='btn_cancel'
              id='btn_cancel'
            >
              Annuleren
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              data-cy='btn_submit_service'
              id='btn_submit_service'
            >
              Toevoegen
            </Button>

          </HStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ServiceForm;
