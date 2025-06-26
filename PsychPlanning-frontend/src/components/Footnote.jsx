import { Box, Text } from '@chakra-ui/react';

const Footnote = ({ tekst }) => {
  return (
    <Box textAlign={'center'} alignContent={'center'} alignItems={'center'}>
      <Text fontStyle={'italic'} fontSize={'md'} mt={5}>
        {tekst}
      </Text>
    </Box>
  );
};

export default Footnote;