import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { homeSharp, addSharp } from 'ionicons/icons';
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import "./MainMenu.css"

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

export default function MainMenu() {
  const {t} = useTranslation()
  const appPages: AppPage[] = [
    {
      title: t("menu.home"),
      url: '/home',
      iosIcon: homeSharp,
      mdIcon: homeSharp
    },
    {
      title: t("menu.add"),
      url: '/add',
      iosIcon: addSharp,
      mdIcon: addSharp
    }
  ];
  const location = useLocation();
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{t("app.name")}</IonListHeader>
          {/* <IonNote>hi@ionicframework.com</IonNote> */}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  )
}
