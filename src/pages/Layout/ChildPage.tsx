import { IonContent, IonPage } from "@ionic/react";
import BackToolbar from "../../components/Menu/BackToolbar";

export default function Childpage({ children, title }) {
  return (
    <>
      <IonPage>
        <BackToolbar title={title} />
        <IonContent className='ion-padding'>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}