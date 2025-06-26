import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';

const MijnProfiel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [geselecteerdeTab, setGeselecteerdeTab] = useState(0);

  const { user } = useAuth();
  const roles = user ? user.roles : [];

  useEffect(() => {
    if (location.pathname.includes('wijzig-gegevens')) {
      setGeselecteerdeTab(0);
    } else if (location.pathname.includes('beschikbaarheden')) {
      setGeselecteerdeTab(1);
    } else if (location.pathname.includes('mijn-services')) {
      setGeselecteerdeTab(2);
    }
  }, [location]);

  const handleTabChange = (index) => {
    setGeselecteerdeTab(index);
    if (index === 0) {
      navigate('/mijn-profiel/wijzig-gegevens');
    } else if (index === 1) {
      navigate('/mijn-profiel/beschikbaarheden');
    } else if (index === 2) {
      navigate('/mijn-profiel/mijn-services');
    }
  };

  return (
    <div>
      <Tabs
        margin={5}
        mt={10}
        isFitted
        variant="solid-rounded"
        onChange={handleTabChange}
        index={geselecteerdeTab}
      >
        <TabList
          mb="1em"
          overflowX="auto"
          whiteSpace="nowrap"
          sx={{
            '@media(max-width: 600px)': {
              flexDirection: 'column',
            },
          }}
        >
          <Tab>Wijzig gegevens</Tab>
          {roles.includes('klant') ? (<></>) : (<Tab>Mijn beschikbaarheden</Tab>)}
          {roles.includes('klant') ? (<></>) : (<Tab data-cy="tab_services">Mijn services</Tab>)}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Outlet />
          </TabPanel>
          {roles.includes('klant') ? (<></>) : (
            <TabPanel>
              <Outlet />
            </TabPanel>
          )}
          {roles.includes('klant') ? (<></>) : (
            <TabPanel>
              <Outlet />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default MijnProfiel;
