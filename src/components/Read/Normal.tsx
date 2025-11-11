import { useContext } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { IonButton, IonIcon, useIonAlert } from "@ionic/react"
import { pencilSharp, swapHorizontalSharp, swapVerticalSharp, volumeHighSharp, stopCircleSharp } from "ionicons/icons"
import { useHistory } from "react-router"
import UrlOpenConfirm from "../Button/UrlOpenConfirm"
import HtmlContent from "./HtmlContent"
import { SettingsContext } from "../../SettingsContext"
import { useTts } from "./useTts"
import { useTranslation } from "react-i18next"

export default function Normal() {
  const globalSettings = useContext(SettingsContext)
  const article = useContext<any>(DetailContext)
  const history = useHistory()
  const { t } = useTranslation()
  const [presentAlert] = useIonAlert()
  
  const { isTtsActive, startTts, stopTts } = useTts((error) => {
    presentAlert({
      header: t("pages.read.ttsError"),
      message: error,
      buttons: [t("app.confirm.ok")],
    })
  })

  return (
    <>
      <div style={{margin: "15px", paddingBottom: "24px"}}>
        <h1 style={{fontWeight: "bold"}}>{article.title}</h1>
        <div style={{width: "100%", display: "flex", justifyContent: "right"}}>
          {
            isTtsActive
            ? <IonButton color="dark" fill="clear" onClick={() => stopTts()}>
                <IonIcon slot="icon-only" icon={stopCircleSharp}></IonIcon>
              </IonButton>
            : <IonButton color="dark" fill="clear" onClick={() => startTts(article.html)}>
                <IonIcon slot="icon-only" icon={volumeHighSharp}></IonIcon>
              </IonButton>
          }
          <IonButton color="dark" fill="clear" onClick={() => {
            history.push("/read/horizontal/"+article.id)
          }}>
            <IonIcon slot="icon-only" icon={swapHorizontalSharp}></IonIcon>
          </IonButton>

          {
            globalSettings.devMode ?
            <IonButton color="dark" fill="clear" onClick={() => {
              history.push("/read/vertical/"+article.id)
            }}>
              <IonIcon slot="icon-only" icon={swapVerticalSharp}></IonIcon>
            </IonButton>
            :<></>
          }
          
          <IonButton color="dark" fill="clear" onClick={() => {
            history.push("/edit/"+article.id)
          }}>
            <IonIcon slot="icon-only" icon={pencilSharp}></IonIcon>
          </IonButton>
          <UrlOpenConfirm url={article.url} />
        </div>
        <HtmlContent type="normal" />
      </div>
    </>
  )
}