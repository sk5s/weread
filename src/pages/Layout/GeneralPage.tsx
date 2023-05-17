import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "./GeneralPage.css"
import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";

export default function GeneralPage({ children, title, menuId }) {
  const context = useContext(SettingsContext)
  return (
    <>
      <IonPage id={menuId}>
        <IonHeader className={context.imode ? "noShadow" : ""}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}