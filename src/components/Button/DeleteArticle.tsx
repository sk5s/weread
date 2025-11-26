import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
import key from "../../lib/storage.json"
import { Preferences } from "@capacitor/preferences";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { trigger } from "../../lib/Event";
import { useHistory } from "react-router";

export default function DeleteArticle({id}:{id:string}) {
  const {t} = useTranslation()
  const history = useHistory()
  const removeArticle = async () => {
    let readData = []
    const { value } = await Preferences.get({ key:  key.read});
    if (value === null) return;
    if (value) {
      readData = JSON.parse(value);
      readData = readData.filter((item) => {
        return String(item.id) !== String(id);
      })
    }
    await Filesystem.rmdir({
      path: id,
      directory: Directory.Data,
      recursive: true
    })
    
    // Remove viewer settings for this article
    const viewerData = await Preferences.get({ key: key.viewer });
    if (viewerData.value) {
      let viewerSettings = JSON.parse(viewerData.value);
      delete viewerSettings[id];
      await Preferences.set({
        key: key.viewer,
        value: JSON.stringify(viewerSettings),
      });
    }
    
    let content = JSON.stringify(readData);
    await Preferences.set({
      key: key.read,
      value: content,
    });
    trigger("weread:listChange")
    history.push("/home")
  };
  return (
    <IonButton color="dark" onClick={() => removeArticle()}>{t("data.edit.deleteArticle")}</IonButton>
  )
}
