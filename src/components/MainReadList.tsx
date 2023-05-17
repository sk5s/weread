import { Preferences } from '@capacitor/preferences';
import key from '../lib/storage.json'
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IonBadge, IonItem, IonList, IonRippleEffect } from '@ionic/react';
import { useHistory } from 'react-router';
import { on } from '../lib/Event';
import { useLongPress } from 'use-long-press';
import { SettingsContext } from '../SettingsContext';

export default function MainReadList() {
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
  }, [])
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
            <IonItem key={e.id} id={"listItem+"+e.id} onClick={() => {history.push(`/detail/${e.id}`);}} {...bind()} className='ion-activatable ripple-parent'>
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
          )
        })
      } else {
        row.push(<IonItem key="nodata">{t("data.noData")}</IonItem>);
      }
      return row;
    })()}
    </IonList>
    </>
  )
}
