import { IonButton, IonIcon, IonPopover, IonRange } from "@ionic/react"
import { add, remove, settingsOutline } from "ionicons/icons"
import { useTranslation } from "react-i18next"
import { SettingsContext } from "../../SettingsContext"
import { useContext } from "react"

interface ReadingSettingsButtonProps {
  fontSize: number
  triggerId: string
  onFontSizeChange: (newSize: number) => void
}

export default function ReadingSettingsButton({
  fontSize,
  triggerId,
  onFontSizeChange
}: ReadingSettingsButtonProps) {
  const { t } = useTranslation()
  const globalSettings = useContext(SettingsContext);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(48, fontSize + delta))
    onFontSizeChange(newSize)
  }

  return (
    <>
      <IonButton id={triggerId} color="dark" fill="clear">
        <IonIcon slot="icon-only" icon={settingsOutline} />
      </IonButton>
      
      {/* Font Settings Popover */}
      <IonPopover trigger={triggerId} triggerAction="click" dismissOnSelect={false} className={`${globalSettings.imode ? "nodrop" : ""}`}>
        <div style={{ margin: "15px" }}>
          <h4 style={{ margin: "0 0 15px 0" }}>{t("pages.detail.toolbar.fontSize")}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IonButton onClick={() => adjustFontSize(-1)} size="small" fill="clear">
              <IonIcon icon={remove} />
            </IonButton>
            <IonRange
              min={12}
              max={48}
              value={fontSize}
              pin={true}
              onIonChange={(e) => onFontSizeChange(e.detail.value as number)}
              style={{ flex: 1 }}
            />
            <IonButton onClick={() => adjustFontSize(1)} size="small" fill="clear">
              <IonIcon icon={add} />
            </IonButton>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "16px", color: "var(--ion-color-medium)" }}>
            {fontSize}px
          </div>
        </div>
      </IonPopover>
    </>
  )
}
