import { Box, Text, Link, Flex } from '@chakra-ui/react';

const jaar = new Date().getFullYear();

const Footer = () => {

  return (
    <Box as="footer" bg="gray.700" color="white" py={6} px={8}>
      <Flex
        justify="space-between"
        direction={['column', 'column', 'row']}
        mb={4}
      >
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Contact
          </Text>
          <Text>Email: <Link href="mailto:sara.de.block7@gmail.com" color="blue.300">
            sara.de.block7@gmail.com</Link></Text>
          <Text>Telefoon: +32 470 04 95 20</Text>
        </Box>
      </Flex>

      <Text textAlign="center" fontSize="sm">
        © {jaar} Psycholoog Sara. Alle rechten voorbehouden.
      </Text>
    </Box>
  );
};

export default Footer;
