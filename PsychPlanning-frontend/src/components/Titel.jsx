import { Heading } from '@chakra-ui/react';

const Titel = ({ titel }) => {
  return (
    <Heading as="h1" size='xl' color='gray.700' textAlign='left' margin={5}>
      {titel}
    </Heading>
  );
};

export default Titel;
