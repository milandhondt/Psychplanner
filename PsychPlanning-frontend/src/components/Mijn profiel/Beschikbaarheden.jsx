import { Box } from '@chakra-ui/react';
import BeschikbaarhedenLijst from '../Beschikbaarheden/BeschikbaarhedenLijst';
import BeschikbaarheidForm from '../Beschikbaarheden/BeschikbaarheidForm';
import useSWRMutation from 'swr/mutation';
import { save } from '../../api';
import AsyncData from '../AsyncData';

const Beschikbaarheden = () => {
  const { trigger: saveBeschikbaarheid, error: saveError} = useSWRMutation(
    'beschikbaarheden',
    save,
  );

  return (
    <Box p={6}>
      <BeschikbaarhedenLijst/>
      <AsyncData error={saveError}>
        <BeschikbaarheidForm
          saveBeschikbaarheid={saveBeschikbaarheid}
        />
      </AsyncData>
    </Box>
  );

};

export default Beschikbaarheden;
