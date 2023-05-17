import { useContext } from "react"
import { SettingsContext } from "../../SettingsContext"
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from "@ionic/react"
import { arrowDownSharp, arrowForwardSharp } from "ionicons/icons"
import { useHistory } from "react-router"

export default function DetailPagesToolbar({to,id}) {
  const context = useContext(SettingsContext)
  const history = useHistory()
  return (
    <></>
    // <IonHeader className={context.imode ? "noShadow" : ""}>
    //   <IonToolbar>
    //     <IonButtons slot="start">
    //       <IonButton color="dark" fill="clear" onClick={() => {
    //         history.push(to+id)
    //       }}>
    //         {
    //           to === "/detailpagesvertical/" ?
    //           <IonIcon icon={arrowDownSharp}></IonIcon> : 
    //           <IonIcon icon={arrowForwardSharp}></IonIcon>
    //         }
    //       </IonButton>
    //     </IonButtons>
    //   </IonToolbar>
    // </IonHeader>
  )
}
