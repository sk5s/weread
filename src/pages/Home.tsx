import { useTranslation } from 'react-i18next';
import MainReadList from '../components/MainReadList';
import GeneralPage from './Layout/GeneralPage';
import { useContext } from 'react';
import { SettingsContext } from '../SettingsContext';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router';

function Home() {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  const history = useHistory()
  return (
    <GeneralPage title={t("app.name")} menuId="menu-home">
      <MainReadList list={context.defaultReadView} />
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => {history.push("/add")}} color="dark">
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </GeneralPage>
  );
}

export default Home;
