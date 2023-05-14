import { useHistory, useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useEffect, useState } from "react"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from 'isomorphic-dompurify';
import Childpage from "../Layout/ChildPage"
import "./Detail.css"
import UrlOpenConfirm from "../../components/Button/UrlOpenConfirm"
import { IonButton, IonIcon } from "@ionic/react"
import { pencilSharp, bookSharp } from "ionicons/icons"

export default function Detail() {
  const params = useParams<any>()
  const history = useHistory()
  const {t} = useTranslation()
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
      let doc = new DOMParser().parseFromString(JSON.parse(contents.data).content, 'text/html');
      Array.from(doc.getElementsByTagName("a")).forEach((e) => {
        e.relList.add("noopener","noreferrer")
      })
      const safeHtml = DOMPurify.sanitize(doc.documentElement.innerHTML);
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
      <h1 style={{fontWeight: "bold"}}>{fileData.title}</h1>
      <div style={{width: "100%", display: "flex", justifyContent: "right"}}>
        <IonButton fill="clear" onClick={() => {
          history.push("/detailpages/"+params.articleId)
        }}>
          <IonIcon slot="icon-only" icon={bookSharp}></IonIcon>
        </IonButton>
        <IonButton fill="clear" onClick={() => {
          history.push("/edit/"+params.articleId)
        }}>
          <IonIcon slot="icon-only" icon={pencilSharp}></IonIcon>
        </IonButton>
        <UrlOpenConfirm url={fileData.url} />
      </div>
      </>
      : <></>
      }
      <div className="html" key={params.articleId} dangerouslySetInnerHTML={{__html: html}} />
    </Childpage>
  )
}
