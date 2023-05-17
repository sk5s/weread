import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Add from './pages/Add'
import Detail from './pages/Detail/Detail';
import MainMenu from './components/Menu/MainMenu';
import Edit from './pages/Detail/Edit';
import DetailPages from './pages/Detail/DetailPages';
import DeleteAll from './pages/Settings/DeleteAll';
import Settings from './pages/Settings/Settings';
import DetailPagesVertical from './pages/Detail/DetailPagesVertical';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import key from './lib/storage.json'
import defaultSettings from "./lib/defaultSettings.json"
import { SettingsContext } from './SettingsContext';
import { on } from './lib/Event';
import { Device } from '@capacitor/device';
import { useTranslation } from 'react-i18next';

const getConfig = () => {
  let config:any = {
    hardwareBackButton: true,
    animated: !defaultSettings.imode
  };
  
  return config;
};

setupIonicReact(getConfig());


function App() {
  const {t,i18n} = useTranslation()
  const [settings, setSettings] = useState<any>(defaultSettings)
  const getSettings = async () => {
    const { value } = await Preferences.get({ key:  key.settings});
    if (value === null) {
      let newSaveDefault = {...defaultSettings}
      let deviceLanguageCode = "";
      let deviceLanguageCodeObject = await Device.getLanguageCode();
      deviceLanguageCode = deviceLanguageCodeObject.value
      console.log(deviceLanguageCode)
      if (deviceLanguageCode === "zh") {
        deviceLanguageCode = "zh-TW"
      } else {
        deviceLanguageCode = "en"
      }
      newSaveDefault.lang = deviceLanguageCode
      await Preferences.set({
        key: key.settings,
        value: JSON.stringify(newSaveDefault)
      })
      setSettings(newSaveDefault)
      console.log(newSaveDefault)
      i18n.changeLanguage(newSaveDefault.lang)
    } else {
      let parsedSettings = JSON.parse(value)
      console.log(parsedSettings)
      setSettings(parsedSettings)
      setupIonicReact({
        animated: !parsedSettings.imode
      })
      i18n.changeLanguage(parsedSettings.lang)
    }
  }
  useEffect(() => {
    getSettings()
    on("weread:settingsChange", () => {
      getSettings()
    })
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <SettingsContext.Provider value={settings}>
          <MainMenu menuId="menu-main" />
          <IonRouterOutlet id='menu-main'>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/add">
              <Add />
            </Route>
            <Route exact path="/delete">
              <DeleteAll />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route path="/detail/:articleId" component={Detail} />
            <Route path="/detailpages/:articleId" component={DetailPages} />
            <Route path="/detailpagesvertical/:articleId" component={DetailPagesVertical} />
            <Route path="/edit/:articleId" component={Edit} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </SettingsContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
