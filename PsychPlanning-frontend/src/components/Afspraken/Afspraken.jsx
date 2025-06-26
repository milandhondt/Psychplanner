import { Box } from '@chakra-ui/react';
import Titel from '../Titel';
import AfsprakenLijst from './AfsprakenLijst';

const Afspraken = ({ services, psychologen, afspraken, klanten }) => {

  return (
    <Box p={5}>
      <Titel titel="Mijn afspraken" />
      <AfsprakenLijst services={services} psychologen={psychologen} afspraken={afspraken} klanten={klanten} />
    </Box>
  );
};

export default Afspraken;
