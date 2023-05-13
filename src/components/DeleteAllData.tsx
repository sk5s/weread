import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import key from "../lib/storage.json"
import { Preferences } from "@capacitor/preferences";
import { Directory, Filesystem } from "@capacitor/filesystem";

export default function DeleteAllData() {
  const {t} = useTranslation()
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
  };
  return (
    <IonButton onClick={() => removeAll()}>{t("data.edit.deleteAll")}</IonButton>
  )
}
