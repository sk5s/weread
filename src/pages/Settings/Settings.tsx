import { useTranslation } from "react-i18next";
import GeneralPage from "../Layout/GeneralPage";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../SettingsContext";
import { Preferences } from "@capacitor/preferences";
import key from "../../lib/storage.json"
import { trigger } from "../../lib/Event";
import { useHistory } from "react-router";
import allLang from '../../i18n/all.json'
import { Device, DeviceInfo } from "@capacitor/device";

export default function Settings() {
  const {t,i18n} = useTranslation()
  const history = useHistory()
  const context = useContext(SettingsContext)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(null);
  const changeSetting = async (settingKey: string, settingValue: any) => {
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
        <div style={{width: "100%"}}>
          <IonToggle onIonChange={(e) => changeSetting("imode",e.target.checked)} checked={context.imode} labelPlacement="start" justify="space-between">{t("pages.settings.imode.label")}</IonToggle>
          <small>{t("pages.settings.imode.description")}</small>
        </div>
      </IonItem>
    )
  }
  const DevModeToggle = () => {
    return (
      <IonItem>
        <div style={{width: "100%"}}>
          <IonToggle onIonChange={(e) => changeSetting("devMode",e.target.checked)} checked={context.devMode} labelPlacement="start" justify="space-between">{t("pages.settings.devMode.label")}</IonToggle>
          <small>{t("pages.settings.devMode.description")}</small>
        </div>
      </IonItem>
    )
  }
  const StatusBarToggle = () => {
    return (
      <IonItem>
        <div style={{width: "100%"}}>
          <IonToggle onIonChange={(e) => changeSetting("hideStatusBar",e.target.checked)} checked={context.hideStatusBar} labelPlacement="start" justify="space-between">{t("pages.settings.hideStatusBar.label")}</IonToggle>
          <small>{t("pages.settings.hideStatusBar.description")}</small>
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
          <IonHeader className={context.imode ? "ion-no-border" : ""}>
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
              <IonRadioGroup ref={input} value={context.lang}>
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

  const ChangeTheme = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<any>(null);
    const confirm = () => {
      modal.current?.dismiss(input.current?.value, 'confirm');
    }
    const onWillDismiss = (ev: any) => {
      if (ev.detail.role === 'confirm') {
        console.log(ev.detail.data)
        changeSetting("theme", ev.detail.data)
      }
    }

    const themes = [
      {
        id: 'light',
        label: t("pages.settings.theme.light"),
      },
      {
        id: 'dark',
        label: t("pages.settings.theme.dark"),
      },
      {
        id: 'system',
        label: t("pages.settings.theme.system"),
      },
    ]
    return (
      <>
        <IonItem detail={true} id="open-theme-modal">
          <IonLabel>{t("pages.settings.theme.label")}</IonLabel>
        </IonItem>
        <IonModal ref={modal} trigger="open-theme-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader className={context.imode ? "ion-no-border" : ""}>
            <IonToolbar>
              <IonTitle>{t("pages.settings.theme.label")}</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  {t("app.confirm.yes")}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonRadioGroup ref={input} value={context.theme}>
              {(() => {
                let rows: any = [];
                themes.map((element) => {
                  rows.push(
                    <IonItem key={element.id}>
                      <IonRadio aria-label={element.label} justify="space-between" value={element.id}>
                        <h6>{element.label}</h6>
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
  const DataPage = () => {
    return (
      <IonItem detail={true} onClick={() => history.push("/data")}>
        <IonLabel>{t("pages.settings.data.label")}</IonLabel>
      </IonItem>
    )
  }
  const InfoPage = () => {
    return (
      <IonItem detail={true} onClick={() => history.push("/about")}>
        <IonLabel>{t("pages.settings.about.label",{app: t("app.name")})}</IonLabel>
      </IonItem>
    )
  }
  const FontPage = () => {
    return (
      <IonItem detail={true} onClick={() => history.push("/font")}>
        <IonLabel>{t("pages.settings.font.label")}</IonLabel>
      </IonItem>
    )
  }

  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceInfoObject = await Device.getInfo();
      setDeviceInfo(deviceInfoObject);
    }
    getDeviceInfo();
  }, [])

  return (
    <GeneralPage title={t("menu.settings")} menuId="menu-home">
      <IonList>
        <ChangeTheme />
        {/* Disable inkMode toggle for iOS devices, since inkMode makes page return not functioning. */}
        {deviceInfo?.platform === "android" ?
        <IModeToggle /> : null}
        {/* <StatusBarToggle /> */}
        <ChangeLang />
        <FontPage />
        <DataPage />
        <DevModeToggle />
        <InfoPage />
      </IonList>
    </GeneralPage>
  )
}
