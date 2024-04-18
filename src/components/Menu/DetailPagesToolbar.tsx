import { useContext } from "react"
import { SettingsContext } from "../../SettingsContext"
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from "@ionic/react"
import { arrowDownSharp, arrowForwardSharp } from "ionicons/icons"

export default function DetailPagesToolbar({view}) {
  const context = useContext(SettingsContext)
  return (
    <div style={{position: "fixed", width:"100%", zIndex: 1000}}>
      <IonHeader className={context.imode ? "ion-no-border" : ""}>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton color="dark" fill="clear" onClick={() => {
              console.log("change view")
            }}>
              {
                view === "horizontal" ?
                <IonIcon icon={arrowDownSharp}></IonIcon> : 
                <IonIcon icon={arrowForwardSharp}></IonIcon>
              }
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </div>
  )
}
