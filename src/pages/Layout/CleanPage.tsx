import { IonContent, IonPage } from "@ionic/react";
import { useTranslation } from "react-i18next";
import BackToolbar from "../../components/Menu/BackToolbar";

export default function CleanPage({ children, back, title }) {
  const {t} = useTranslation()
  return (
    <>
      <IonPage>
        {back ? <BackToolbar title={title} /> : <></>}
        <IonContent>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}