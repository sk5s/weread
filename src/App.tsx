import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Add from './pages/Add'
import DeleteAll from './pages/Hidden/DeleteAll';

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

import Detail from './pages/Detail/Detail';
import MainMenu from './components/Menu/MainMenu';
import Edit from './pages/Detail/Edit';
import DetailPages from './pages/Detail/DetailPages';

const getConfig = () => {
  let config:any = {
    hardwareBackButton: true,
  };
  // if (mode.eink === "true") {
  //   config = {
  //     ...config,
  //     animated: false,
  //   }
  // }
  
  return config;
};

setupIonicReact(getConfig());

function App() {
  return (
    <IonApp>
      <IonReactRouter>
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
          <Route path="/detail/:articleId" component={Detail} />
          <Route path="/detailpages/:articleId" component={DetailPages} />
          <Route path="/edit/:articleId" component={Edit} />
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
