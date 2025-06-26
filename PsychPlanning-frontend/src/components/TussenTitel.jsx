import { Heading } from '@chakra-ui/react';

const TussenTitel = ({ titel }) => {
  return (
    <Heading as="h2" size='lg' color='gray.700' textAlign='left' margin={5}>
      {titel}
    </Heading>
  );
};

export default TussenTitel;
