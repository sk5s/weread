import { IonItem, IonLabel, IonList, IonRange, IonListHeader, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../SettingsContext";
import { Preferences } from "@capacitor/preferences";
import key from "../../lib/storage.json";
import { trigger } from "../../lib/Event";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import Childpage from "../Layout/ChildPage";

export default function Speak() {
  const { t } = useTranslation();
  const context = useContext(SettingsContext);
  const [languages, setLanguages] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const langs = await TextToSpeech.getSupportedLanguages();
        if (langs.languages.length === 0) {
          setIsAvailable(false);
        }
        setLanguages(langs.languages);
      } catch (e) {
        console.error("Failed to get languages", e);
        setIsAvailable(false);
      }
    };
    getLanguages();
  }, []);

  const changeSetting = async (settingKey: string, settingValue: any) => {
    let newSettings = { ...context };
    newSettings[settingKey] = settingValue;

    if (settingKey === 'speakLang') {
      let recent = newSettings.recentSpeakLangs || [];
      recent = recent.filter((l: string) => l !== settingValue);
      recent.unshift(settingValue);
      if (recent.length > 5) recent.pop();
      newSettings.recentSpeakLangs = recent;
    }

    await Preferences.set({
      key: key.settings,
      value: JSON.stringify(newSettings),
    });
    trigger("weread:settingsChange");
  };

  if (!isAvailable) {
    return (
      <Childpage title={t("pages.settings.speak.title")}>
        <div style={{ padding: 20, textAlign: 'center' }}>
          <p>{t("pages.settings.speak.unavailable")}</p>
        </div>
      </Childpage>
    )
  }

  const recentLangs = context.recentSpeakLangs || [];
  const allLangs = languages;

  return (
    <Childpage title={t("pages.settings.speak.title")}>
      <IonList>
        <IonListHeader>
          <IonLabel>{t("pages.settings.speak.speed")}</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonRange
            min={0.5}
            max={3.0}
            step={0.1}
            snaps={true}
            ticks={false}
            pin={true}
            value={context.speakRate || 1.0}
            onIonChange={(e) => changeSetting("speakRate", e.detail.value)}
            pinFormatter={(value) => value.toFixed(1)}
          >
            <IonLabel slot="start">0.5x</IonLabel>
            <IonLabel slot="end">3.0x</IonLabel>
          </IonRange>
          <IonLabel slot="end">{(context.speakRate || 1.0).toFixed(1)}x</IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect
            label={t("pages.settings.speak.language")}
            value={context.speakLang || "en-US"}
            onIonChange={(e) => changeSetting("speakLang", e.detail.value)}
            cancelText={t("app.confirm.cancel")}
            okText={t("app.confirm.ok")}
          >
            {recentLangs.length > 0 && (
              <>
                {recentLangs.map((lang: string) => (
                  <IonSelectOption key={`recent-${lang}`} value={lang}>{lang}</IonSelectOption>
                ))}
                <IonSelectOption disabled={true}>──────────</IonSelectOption>
              </>
            )}
            {allLangs.map((lang) => (
              <IonSelectOption key={lang} value={lang}>{lang}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>
    </Childpage>
  );
}
