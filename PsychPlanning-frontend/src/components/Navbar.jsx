import { Box, Flex, IconButton, Stack, Text, Collapse } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useAuth } from '../contexts/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthed } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box bg="gray.700" color="white" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <NavLink to="/home">
          <Text fontSize="3xl" fontWeight="bold" _hover={{ color: 'gray.200' }}>Naam Psycholoog</Text>
        </NavLink>

        <IconButton
          icon={<HamburgerIcon />}
          variant="outline"
          color="white"
          aria-label="Open het navigatiemenu"
          display={{ md: 'none' }}
          onClick={toggleMenu}
          _hover={{ bg: 'gray.600' }}
        />

        <Flex display={{ base: 'none', md: 'flex' }} alignItems="center">
          <Stack direction="row" spacing={16} alignItems="center">
            <NavLink to="/mijn-profiel/wijzig-gegevens">
              <Text fontSize={'xl'} _hover={{ color: 'gray.200' }}>Mijn profiel</Text>
            </NavLink>
            <NavLink to="/afspraak-plannen/afspraken">
              <Text fontSize={'xl'} _hover={{ color: 'gray.200' }}>Afspraak plannen</Text>
            </NavLink>
            {
              isAuthed ? (
                <NavLink to="/logout">
                  <Text fontSize={'xl'} _hover={{ color: 'gray.200' }}
                  >Afmelden</Text>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <Text fontSize={'xl'} _hover={{ color: 'gray.200' }}>Log in</Text>
                </NavLink>
              )
            }
          </Stack>
        </Flex >
      </Flex >

      <Collapse in={isOpen} animateOpacity>
        <Stack
          spacing={4}
          alignItems="center"
          display={{ base: 'flex', md: 'none' }}
          py={4}
        >
          <NavLink to="/mijn-profiel/wijzig-gegevens">
            <Text fontSize={'2xl'} >Mijn profiel</Text>
          </NavLink>
          <NavLink to="/afspraak-plannen/afspraken">
            <Text fontSize={'2xl'}>Afspraak plannen</Text>
          </NavLink>
          {
            isAuthed ? (
              <NavLink to="/logout">
                <Text fontSize={'2xl'}>Log out</Text>
              </NavLink>
            ) : (
              <NavLink to="/login">
                <Text fontSize={'2xl'}>Log in</Text>
              </NavLink>
            )
          }
        </Stack>
      </Collapse>
    </Box >
  );
};

export default Navbar;
