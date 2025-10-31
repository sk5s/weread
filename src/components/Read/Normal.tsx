import { useContext } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { IonButton, IonIcon } from "@ionic/react"
import { pencilSharp, swapHorizontalSharp, swapVerticalSharp } from "ionicons/icons"
import { useHistory } from "react-router"
import UrlOpenConfirm from "../Button/UrlOpenConfirm"
import HtmlContent from "./HtmlContent"
import { SettingsContext } from "../../SettingsContext"

export default function Normal() {
  const globalSettings = useContext(SettingsContext)
  const article = useContext<any>(DetailContext)
  const history = useHistory()
  return (
    <>
      <div style={{margin: "15px", paddingBottom: "24px"}}>
        <h1 style={{fontWeight: "bold"}}>{article.title}</h1>
        <div style={{width: "100%", display: "flex", justifyContent: "right"}}>
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
