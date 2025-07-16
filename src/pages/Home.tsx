import { useTranslation } from 'react-i18next';
import MainReadList from '../components/MainReadList';
import GeneralPage from './Layout/GeneralPage';
import { useContext, useEffect } from 'react';
import { SettingsContext } from '../SettingsContext';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { SendIntent } from 'send-intent';
import { validateUrl } from '../lib/utils';

function Home() {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  const history = useHistory()
  useEffect(() => {
    // Receive Send Intent
    SendIntent.checkSendIntentReceived()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((result: any) => {
      if (result) {
        console.log("SendIntent received");
        console.log(JSON.stringify(result));
      }
      if (result.url) {
        const resultUrl = decodeURIComponent(result.url);
        if (validateUrl(resultUrl)){
          history.push("/add?q="+resultUrl);
        } else {
          alert(t("data.sendintent.unsupported"));
        }
      }
    })
    .catch((err) => console.error(err));
  }, [])
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
