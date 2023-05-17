import { useTranslation } from "react-i18next";
import GeneralPage from "../Layout/GeneralPage";
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import { useContext, useRef } from "react";
import { SettingsContext } from "../../SettingsContext";
import { Preferences } from "@capacitor/preferences";
import key from "../../lib/storage.json"
import { trigger } from "../../lib/Event";
import { useHistory } from "react-router";
import allLang from '../../i18n/all.json'

export default function Settings() {
  const {t,i18n} = useTranslation()
  const history = useHistory()
  const context = useContext(SettingsContext)
  const changeSetting = async (settingKey, settingValue) => {
    let newSettings = {...context}
    newSettings[settingKey] = settingValue
    await Preferences.set({
      key: key.settings,
      value: JSON.stringify(newSettings)
    })
    trigger("weread:settingsChange")
  }
  const IModeToggle = () => {
    return (
      <IonItem>
        <div>
          <IonToggle onIonChange={(e) => changeSetting("imode",e.target.checked)} checked={context.imode}>{t("pages.settings.imode.label")}</IonToggle>
          <small>{t("pages.settings.imode.description")}</small>
        </div>
      </IonItem>
    )
  }
  const ChangeLang = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<any>(null);
    const confirm = () => {
      modal.current?.dismiss(input.current?.value, 'confirm');
    }
    const onWillDismiss = (ev) => {
      if (ev.detail.role === 'confirm') {
        console.log(ev.detail.data)
        i18n.changeLanguage(ev.detail.data);
        changeSetting("lang",ev.detail.data)
      }
    }
    return (
      <>
        <IonItem detail={true} id="open-lang-modal">
          <IonLabel>{t("pages.settings.changeLang.label")}</IonLabel>
        </IonItem>
        <IonModal ref={modal} trigger="open-lang-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader className={context.imode ? "noShadow" : ""}>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>{t("app.confirm.cancel")}</IonButton>
              </IonButtons>
              <IonTitle>{t("pages.settings.changeLang.label")}</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  {t("app.confirm.yes")}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonRadioGroup ref={input}>
              {(() => {
                let rows: any = [];
                allLang.data.map((element) => {
                  rows.push(
                    <IonItem key={element.code}>
                      <IonRadio aria-label={element.name} justify="space-between" value={element.code}>
                        <h6>{element.name}</h6>
                        <small>{t("pages.settings.changeLang.by",{by : element.by})}</small>
                      </IonRadio>
                    </IonItem>
                  );
                });
                return rows;
              })()}
              </IonRadioGroup>
            </IonList>
          </IonContent>
        </IonModal>
      </>
    )
  }
  const DeletePage = () => {
    return (
      <IonItem detail={true} onClick={() => history.push("/delete")}>
        <IonLabel>{t("pages.settings.delete.label")}</IonLabel>
      </IonItem>
    )
  }
  return (
    <GeneralPage title={t("menu.settings")} menuId="menu-home">
      <IonList>
        <IModeToggle />
        <ChangeLang />
        <DeletePage />
      </IonList>
    </GeneralPage>
  )
}