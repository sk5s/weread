import { useTranslation } from "react-i18next";
import Childpage from "../Layout/ChildPage";
import { IonItem, IonLabel, IonRange } from "@ionic/react";
import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";
import { Preferences } from "@capacitor/preferences";
import key from "../../lib/storage.json"
import { trigger } from "../../lib/Event";

export default function Font() {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  
  const changeSetting = async (settingKey: string, settingValue: any) => {
    let newSettings = {...context}
    newSettings[settingKey] = settingValue
    await Preferences.set({
      key: key.settings,
      value: JSON.stringify(newSettings)
    })
    trigger("weread:settingsChange")
  }

  return (
    <Childpage title={t("pages.settings.font.title")}>
      <IonItem>
        <div style={{width: "100%"}}>
          <IonLabel>{t("pages.settings.font.defaultFontSize.label")}</IonLabel>
          <IonRange 
            min={12}
            max={48}
            value={context.defaultFontSize || 24}
            pin={true}
            onIonChange={(e) => changeSetting("defaultFontSize", e.detail.value as number)}
          >
            <div slot="start">12</div>
            <div slot="end">48</div>
          </IonRange>
          <small>{t("pages.settings.font.defaultFontSize.description")}</small>
        </div>
      </IonItem>
    </Childpage>
  )
}
