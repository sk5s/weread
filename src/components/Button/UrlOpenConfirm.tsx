import { IonButton, IonIcon, useIonAlert, useIonToast } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { globeSharp } from "ionicons/icons";
import { Clipboard } from "@capacitor/clipboard";

import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";
import { truncateURI } from "../../lib/utils";

export default function UrlOpenConfirm({ url }: { url: string }) {
  const { t } = useTranslation();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const context = useContext(SettingsContext);
  return (
    <IonButton
      color="dark"
      fill="clear"
      onClick={() => {
        presentAlert({
          header: t("pages.detail.confirm.title"),
          message: truncateURI(url),
          cssClass: context.imode ? "nodrop" : "",
          buttons: [
            {
              text: t("app.confirm.cancel"),
              role: "cancel",
              handler: () => {
                console.log("cancel");
              },
            },
            {
              text: t("pages.detail.confirm.copyUrl"),
              handler: async () => {
                try {
                  await Clipboard.write({ string: url });
                  presentToast(t("app.copy.success"), 4000);
                } catch (error) {
                  console.error("Failed to copy URL to clipboard:", error);
                }
              },
            },
            {
              text: t("pages.detail.confirm.openUrl"),
              role: "confirm",
              handler: () => {
                console.log("confirm");
                window.open(url, "_blank", "noopener=yes,noreferrer=yes");
              },
            },
          ],
        });
      }}
    >
      <IonIcon slot="icon-only" icon={globeSharp}></IonIcon>
    </IonButton>
  );
}
