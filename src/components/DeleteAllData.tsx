import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import key from "../lib/storage.json"
import { Preferences } from "@capacitor/preferences";

export default function DeleteAllData() {
  const {t} = useTranslation()
  const removeAll = async () => {
    await Preferences.remove({ key: key.read });
  };
  return (
    <IonButton onClick={() => removeAll()}>{t("data.edit.deleteAll")}</IonButton>
  )
}
