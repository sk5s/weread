import { Preferences } from '@capacitor/preferences';
import key from '../lib/storage.json'
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IonBadge, IonItem, IonList, IonRippleEffect, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { motion } from "motion/react"
import { useHistory } from 'react-router';
import { on } from '../lib/Event';
import { useLongPress } from 'use-long-press';
import { SettingsContext } from '../SettingsContext';
import logo from "../../resources/icon.png"

export default function MainReadList({list}) {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  const history = useHistory();
  let readData:any[] = []
  const checkData = async () => {
    const { value } = await Preferences.get({ key:  key.read});
    if (value === null) {
      setReadDataList([]);
      return
    }
    if (value) {
      readData = JSON.parse(value);
    }
    setReadDataList(readData.reverse())
  };
  const [readDataList, setReadDataList] = useState<any[]>([]);
  useEffect(() => {
    checkData()
    on("weread:listChange", () => checkData())
  }, []);
  const bind = useLongPress((e:any) => {
    console.log('Long pressed! ',e.target.id.split("+")[1]);
    history.push('/edit/'+e.target.id.split("+")[1])
  });
  return (
    <>
    <IonList>
    {(() => {
      let row:any[] = [];
      if (readDataList.length) {
        readDataList.forEach((e,i) => {
          row.push(
            <motion.div
              key={e.id}
              initial={context.imode ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={context.imode ? { duration: 0 } : { duration: 0.3, delay: 0.2 + i * 0.05 }}
            >
              <IonItem id={"listItem+"+e.id} onClick={() => {
                if (list === "horizontal"){
                  history.push(`/read/horizontal/${e.id}`)
                }else {
                  history.push(`/read/normal/${e.id}`);
                }
              }} {...bind()} className={`ion-activatable ripple-parent`}>
                {
                  context.imode ? 
                  <></> :
                  <IonRippleEffect></IonRippleEffect>
                }
                <div style={{pointerEvents:"none"}}>
                  <h5>{e.title}</h5>
                  <IonBadge color="dark">{(() => new Date(parseInt(e.date)).toISOString().split("T")[0].split("-").join(" / "))()}</IonBadge>
                </div>
              </IonItem>
            </motion.div>
          )
        })
      } else {
        row.push(
          <motion.div
            key="nodata"
            initial={context.imode ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={context.imode ? { duration: 0 } : { duration: 0.5, delay: 1 }}
          >
            <IonCard className="fade-in-nodata">
              <IonCardContent className="ion-text-center">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: "2rem", paddingBottom: "2rem" }}>
                  <img src={logo} alt="No data" style={{borderRadius: '8px'}} width="80" height="80" />
                  <p style={{marginTop: '8px'}}>{t("data.noData")}</p>
                  <IonButton color='dark' routerLink='/add'>{t("menu.add")}</IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </motion.div>
        );
      }
      return row;
    })()}
    </IonList>
    </>
  )
}
