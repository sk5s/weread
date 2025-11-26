import { IonBackButton, IonButtons, IonRange, IonToolbar } from "@ionic/react"
import { useTranslation } from "react-i18next"
import ReadingSettingsButton from "./ReadingSettingsButton"

interface ReadingToolbarsProps {
  controlShow: boolean
  fontSize: number
  page: number
  allPage: number
  triggerId: string
  onFontSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  toolbarPosition?: 'fixed' | 'relative'
  direction?: 'ltr' | 'rtl'
}

export default function ReadingToolbars({
  controlShow,
  fontSize,
  page,
  allPage,
  triggerId,
  onFontSizeChange,
  onPageChange,
  toolbarPosition = 'fixed',
  direction = 'ltr'
}: ReadingToolbarsProps) {
  const { t } = useTranslation()

  const topToolbarStyle = toolbarPosition === 'fixed' 
    ? { position: 'fixed' as const, top: 'calc(var(--ion-safe-area-top, 10px) + 5px)', left: '0', right: '0', zIndex: 1000 }
    : {}

  const bottomToolbarStyle = toolbarPosition === 'fixed'
    ? { position: 'fixed' as const, bottom: 'calc(var(--ion-safe-area-bottom, 10px) + 5px)', left: '0', right: '0', zIndex: 1000 }
    : {}

  const bottomToolbarPadding = toolbarPosition === 'fixed'
    ? { padding: '5px 40px 40px 20px' }
    : { padding: '0 15px' }

  return (
    <>
      {/* Top Toolbar */}
      {controlShow && (
        <>
        <IonToolbar style={topToolbarStyle}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text={t("app.navigate.back")}></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <ReadingSettingsButton 
              fontSize={fontSize}
              triggerId={triggerId}
              onFontSizeChange={onFontSizeChange}
            />
          </IonButtons>
        </IonToolbar>
        </>
      )}

      {/* Bottom Toolbar */}
      {controlShow && (
        <IonToolbar style={bottomToolbarStyle}>
          <div style={{ display: "flex", alignItems: "center", ...bottomToolbarPadding }}>
            <span style={{ marginRight: "10px", fontSize: "14px", minWidth: "80px" }}>{page} / {allPage}</span>
            <IonRange
              min={1}
              max={allPage}
              value={page}
              snaps={true}
              ticks={false}
              onIonChange={(e) => onPageChange(e.detail.value as number)}
              style={{ flex: 1 }}
              dir={direction}
            />
          </div>
        </IonToolbar>
      )}
    </>
  )
}
