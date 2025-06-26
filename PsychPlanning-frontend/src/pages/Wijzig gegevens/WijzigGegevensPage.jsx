import WijzigGegevens from '../../components/Mijn profiel/WijzigGegevens';
import useSWRMutation from 'swr/mutation';
import { save } from '../../api';
import AsyncData from '../../components/AsyncData';

const WijzigGegevensPage = () => {

  const { trigger: saveGegevens, error: saveError } = useSWRMutation(
    'users',
    save,
  );

  return (
    <AsyncData error={saveError}>
      <WijzigGegevens
        saveGegevens={saveGegevens}
      />
    </AsyncData>
  );
};

export default WijzigGegevensPage;