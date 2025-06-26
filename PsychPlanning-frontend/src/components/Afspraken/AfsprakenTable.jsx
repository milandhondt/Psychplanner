import { Table, Thead, Tbody, Th, Tr } from '@chakra-ui/react';
import Afspraak from './Afspraak';
import TussenTitel from '../TussenTitel';
import { useAuth } from '../../contexts/auth';

function AfsprakenTable({ afspraken, onDelete, services, psychologen, klanten }) {
  const { user } = useAuth();
  const roles = user ? user.roles : [];

  if (afspraken.length === 0) {
    return (<TussenTitel titel={'Er zijn nog geen afspraken.'} />);
  }

  return (
    <>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <Table>
          <Thead>
            <Tr>
              <Th>Service</Th>
              <Th>Datum</Th>
              {
                roles === 'klant' ? (
                  <Th>Psycholoog</Th>
                ) : (
                  <Th>Klant</Th>
                )
              }
              <Th>Opmerking</Th>
              <Th>Formulier nodig</Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {afspraken.map((afspraak) => (
              <Afspraak
                key={afspraak.id}
                {...afspraak}
                onDelete={onDelete}
                services={services}
                psychologen={psychologen}
                klanten={klanten}
              />))}
          </Tbody>
        </Table>
      </div>
    </>);
}

export default AfsprakenTable;