import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useEffect, useState } from "react"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from 'isomorphic-dompurify';
import Childpage from "../Layout/ChildPage"
import { IonButton, IonIcon, useIonAlert } from "@ionic/react"
import { globeSharp } from "ionicons/icons"

export default function Detail() {
  const params = useParams<any>()
  const {t} = useTranslation()
  const [presentAlert] = useIonAlert();
  const [readDataList,setReadDataList] = useState<any>({})
  const [fileData,setFileData] = useState<any>({})
  const [html, setHtml] = useState<any>()
  const getItemData = async () => {
    let readData = []
    const { value } = await Preferences.get({ key: key.read });
    if (value === null) return;
    if (value) {
      readData = JSON.parse(value);
      readData = readData.filter((item: any) => {
        return String(item.id) === String(params.articleId);
      });
    }
    console.log(readData)
    setReadDataList(readData[0])
  };
  const getFileData = async () => {
    setHtml(`<p>${t("data.loading")}</p>`)
    if (params.articleId){
      const contents = await Filesystem.readFile({
        path: `${params.articleId}/content.txt`,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      console.log('secrets:', contents);
      setFileData(JSON.parse(contents.data))
      const safeHtml = DOMPurify.sanitize(JSON.parse(contents.data).content);
      const doc = new DOMParser().parseFromString(safeHtml, 'text/html');
      setHtml(safeHtml)
    }
  }
  useEffect(() => {
    getItemData()
  }, [params.articleId])
  useEffect(() => {
    getFileData()
  }, [readDataList])
  return (
    <Childpage title={readDataList.title}>
      {params.articleId
      ? <>
      <h1>{fileData.title}</h1>
      <div style={{width: "100%", display: "flex", justifyContent: "right"}}>
        <IonButton fill="clear" size="small" onClick={() => {
          presentAlert({
            header: t("pages.detail.confirm.title", { url: fileData.url}),
            message: fileData.url,
            buttons: [{
              text: t("app.confirm.cancel"),
              role: 'cancel',
              handler: () => {
                console.log("cancel")
              },
            },
            {
              text: t("app.confirm.yes"),
              role: 'confirm',
              handler: () => {
                console.log("confirm")
                window.open(fileData.url,'_blank','noopener=yes,noreferrer=yes')
              },
            },],
          })
        }}>
          <IonIcon slot="icon-only" icon={globeSharp}></IonIcon>
        </IonButton>
      </div>
      </>
      : <></>
      }
      <div key={params.articleId} dangerouslySetInnerHTML={{__html: html}} />
    </Childpage>
  )
}
