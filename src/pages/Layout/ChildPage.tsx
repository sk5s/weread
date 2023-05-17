import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../SettingsContext";
import { useContext } from "react";

export default function Childpage({ children, title }) {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  return (
    <>
      <IonPage>
        <IonHeader className={context.imode ? "noShadow" : ""}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={t("app.navigate.back")}></IonBackButton>
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