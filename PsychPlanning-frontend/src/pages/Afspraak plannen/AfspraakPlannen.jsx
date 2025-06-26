import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { save, getAll, getAfsprakenByKlantId, getAfsprakenByPsycholoogId } from '../../api';
import useSWRMutation from 'swr/mutation';
import NieuweAfspraak from '../../components/Afspraken/NieuweAfspraak';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import Afspraken from '../../components/Afspraken/Afspraken';
import { useAuth } from '../../contexts/auth';

const AfspraakPlannen = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [geselecteerdeTab, setGeselecteerdeTab] = useState(0);

  useEffect(() => {
    if (location.pathname.includes('afspraken')) {
      setGeselecteerdeTab(0);
    } else if (location.pathname.includes('nieuwe-afspraak')) {
      setGeselecteerdeTab(1);
    }
  }, [location]);

  const handleTabChange = (index) => {
    setGeselecteerdeTab(index);
    if (index === 0) {
      navigate('/afspraak-plannen/afspraken');
    } else if (index === 1) {
      navigate('/afspraak-plannen/nieuwe-afspraak');
    }
  };

  const { data: users = [], isLoadingU, errorU } = useSWR('users', getAll);
  const psychologen = users.filter((u) => u.roles == 'psycholoog');
  const klanten = users.filter((u) => u.roles == 'klant');

  const { data: services = [], isLoading, error } = useSWR('services', getAll);

  const { trigger: saveAfspraak, error: saveError } = useSWRMutation(
    'afspraken',
    save,
  );

  const { user } = useAuth();
  const user_id = user ? user.id : null;
  const roles = user ? user.roles : [];

  const { data: afspraken = [], isLoading: isLoadingA, error: errorA } =
    useSWR(user_id, roles.includes('psycholoog') ? getAfsprakenByPsycholoogId : getAfsprakenByKlantId);

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
        <TabList mb="1em">
          <Tab>Afspraken</Tab>
          {roles.includes('psycholoog') ? (<></>) : (<Tab>Nieuwe afspraak</Tab>
          )}
        </TabList>
        <AsyncData error={error || errorU || errorA} loading={isLoading || isLoadingU || isLoadingA}>
          <TabPanels>
            <TabPanel>
              <Afspraken services={services} psychologen={psychologen} afspraken={afspraken} klanten={klanten} />
            </TabPanel>
            {roles.includes('psycholoog') ? (<></>) : (<TabPanel>
              <NieuweAfspraak services={services} psychologen={psychologen}
                saveAfspraak={saveAfspraak} saveError={saveError} />
            </TabPanel>)
            }

          </TabPanels>
        </AsyncData>
      </Tabs>
    </div>
  );
};

export default AfspraakPlannen;
