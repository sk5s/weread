import { IonContent, IonPage } from "@ionic/react";
import { useTranslation } from "react-i18next";

export default function CleanPage({ children }) {
  const {t} = useTranslation()
  return (
    <>
      <IonPage>
        <IonContent className='ion-padding'>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}