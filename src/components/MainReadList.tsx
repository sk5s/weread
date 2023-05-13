import { Preferences } from '@capacitor/preferences';
import key from '../lib/storage.json'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IonItem, IonList } from '@ionic/react';
import { useHistory } from 'react-router';
import { on } from '../lib/Event';

export default function MainReadList() {
  const {t} = useTranslation()
  const history = useHistory();
  let readData:any[] = []
  const checkData = async () => {
    const { value } = await Preferences.get({ key:  key.read});
    if (value === null) return;
    if (value) {
      readData = JSON.parse(value);
    } else {
      readData = [];
    }
    setReadDataList(readData.reverse())
  };
  const [readDataList, setReadDataList] = useState<any[]>([]);
  useEffect(() => {
    checkData()
    on("weread:listChange", () => checkData())
  }, [])
  return (
    <>
    <IonList>
    {(() => {
      let row:any[] = [];
      if (readDataList.length) {
        readDataList.forEach((e,i) => {
          row.push(
            <IonItem key={e.id} onClick={() => {history.push(`/detail/${e.id}`);}}>
              <h5>{e.title}</h5>
              {(() => new Date(parseInt(e.date)).toDateString())()}
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
