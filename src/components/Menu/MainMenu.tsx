import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { homeSharp, addSharp, trashSharp } from 'ionicons/icons';
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import "./MainMenu.css"
import { SettingsContext } from '../../SettingsContext';
import { useContext } from 'react';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

export default function MainMenu({menuId}:{menuId: string;}) {
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
    },
    {
      title: t("menu.delete"),
      url: '/delete',
      iosIcon: trashSharp,
      mdIcon: trashSharp
    }
  ];
  const location = useLocation();
  const context = useContext(SettingsContext)
  return (
    <IonMenu contentId={menuId} type="overlay" swipeGesture={false} className={context.imode ? "nodrop" : ""}>
      <IonContent>
        <IonList>
          <IonListHeader>{t("app.name")}</IonListHeader>
          {/* <IonNote>hi@ionicframework.com</IonNote> */}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={true}>
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
