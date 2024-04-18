import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../SettingsContext";

export default function BackToolbar({
  title
}:{
  title?: string;
}) {
  const context = useContext(SettingsContext)
  const {t} = useTranslation()
  return (
    <IonHeader className={context.imode ? "ion-no-border" : ""}>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton text={t("app.navigate.back")}></IonBackButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}
