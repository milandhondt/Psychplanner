import { Box } from '@chakra-ui/react';
import ServicesLijst from '../Services/ServicesLijst';
import ServiceForm from '../Services/ServiceForm';
import useSWRMutation from 'swr/mutation';
import { save } from '../../api';
import AsyncData from '../AsyncData';
import TussenTitel from '../TussenTitel';

const MijnServices = () => {
  
  const { trigger: saveService, error: saveError } = useSWRMutation(
    'services',
    save,
  );
  
  return (
    <Box p={6}>
      <TussenTitel titel={'Mijn services:'} />
      <ServicesLijst staatOpHomepagina={false} />
      <AsyncData error={saveError}>
        <ServiceForm
          saveService={saveService}
        />
      </AsyncData>
    </Box>
  );
};

export default MijnServices;
