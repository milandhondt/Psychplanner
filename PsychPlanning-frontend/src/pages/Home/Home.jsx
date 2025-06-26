import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ServicesLijst from '../../components/Services/ServicesLijst';
import TussenTitel from '../../components/TussenTitel';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Flex
        direction={['column', 'column', 'row']}
        align="center"
        justify="space-between"
        mb={5}
      >
        <Image
          src="/foto_homepg.jpg"
          alt="Foto van Sara"
          boxSize={['250px', '350px']}
          borderRadius="full"
          objectFit="cover"
          boxShadow="lg"
          mb={[5, 5, 0]}
        />

        <Text ml={[5, 5, 100]} mr={5} textAlign={'center'}>
          Hoi! Ik ben Sara en ik ben hier om je te helpen. Of je nu door een moeilijke tijd gaat
          of gewoon wat extra ondersteuning zoekt, ik bied gesprekken aan die bij jou passen.
          Samen gaan we op zoek naar de juiste balans en maken we ruimte voor persoonlijke groei.
          Je hoeft het niet alleen te doen – ik sta klaar om je te ondersteunen op jouw pad.
        </Text>

      </Flex>

      <TussenTitel titel={'De services die ik aanbied:'} />
      <ServicesLijst staatOpHomepagina={true} />

      <Stack>

        <Button
          colorScheme="blue"
          size="lg"
          margin={5}
          height={10}
          width={[300, 400]}
          alignSelf={'center'}
          onClick={() => navigate('/afspraak-plannen/nieuwe-afspraak')}
        >
          Plan je afspraak
        </Button>
      </Stack>

      <Outlet />
    </Box>
  );
};

export default Home;
