import { IonButton, IonIcon, useIonAlert } from "@ionic/react"
import { useTranslation } from "react-i18next";
import { globeSharp } from "ionicons/icons"

export default function UrlOpenConfirm({url}:{url: string;}) {
  const {t} = useTranslation()
  const [presentAlert] = useIonAlert();
  return (
    <IonButton fill="clear" size="small" onClick={() => {
      presentAlert({
        header: t("pages.detail.confirm.title", { url: url}),
        message: url,
        buttons: [{
          text: t("app.confirm.cancel"),
          role: 'cancel',
          handler: () => {
            console.log("cancel")
          },
        },
        {
          text: t("app.confirm.yes"),
          role: 'confirm',
          handler: () => {
            console.log("confirm")
            window.open(url,'_blank','noopener=yes,noreferrer=yes')
          },
        },],
      })
    }}>
      <IonIcon slot="icon-only" icon={globeSharp}></IonIcon>
    </IonButton>
  )
}
