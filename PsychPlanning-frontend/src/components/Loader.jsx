import { Spinner, Flex } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Flex direction="column" align="center" justify="center">
      <Spinner size="xl" />
      <span style={{ visibility: 'hidden' }}>Loading...</span>
    </Flex>
  );
}
