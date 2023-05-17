import { IonButton, useIonAlert } from "@ionic/react";
import { useTranslation } from "react-i18next";
import key from "../../lib/storage.json"
import { Preferences } from "@capacitor/preferences";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { trigger } from "../../lib/Event";
import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";

export default function DeleteAllData() {
  const {t} = useTranslation()
  const [presentAlert] = useIonAlert()
  const context = useContext(SettingsContext)
  const handleRemoveAll = () => {
    presentAlert({
      header: t("data.edit.deleteAll"),
      cssClass: context.imode ? "nodrop" : "",
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
          removeAll()
        },
      },],
    })
  }
  const removeAll = async () => {
    let readData = []
    const { value } = await Preferences.get({ key:  key.read});
    if (value === null) return;
    if (value) {
      readData = JSON.parse(value);
    }
    readData.forEach(async (e, i) => {
      await Filesystem.rmdir({
        path: e.id,
        directory: Directory.Data,
        recursive: true
      })
    })
    await Preferences.remove({ key: key.read });
    await Preferences.remove({ key: key.settings });
    trigger("weread:listChange")
  };
  return (
    <IonButton color="dark" onClick={() => handleRemoveAll()}>{t("data.edit.deleteAll")}</IonButton>
  )
}
