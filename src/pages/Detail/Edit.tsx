import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useEffect, useState } from "react"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from 'isomorphic-dompurify';
import Childpage from "../Layout/ChildPage"
import UrlOpenConfirm from "../../components/Button/UrlOpenConfirm"
import DeleteArticle from "../../components/Button/DeleteArticle"

export default function Edit() {
  const params = useParams<any>()
  const {t} = useTranslation()
  const [readDataList,setReadDataList] = useState<any>({})
  const [fileData,setFileData] = useState<any>({})
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
        <h1 style={{fontWeight: "bold", userSelect: "none"}}>{fileData.title}</h1>
        <DeleteArticle id={params.articleId} />
        <UrlOpenConfirm url={fileData.url} />
      </>
      : <></>
      }
    </Childpage>
  )
}
