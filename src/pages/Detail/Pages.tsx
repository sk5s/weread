import { useEffect, useState } from "react"
import { DetailContext } from "./Context"
import { useParams } from "react-router"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useTranslation } from "react-i18next"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from "isomorphic-dompurify"
import CleanPage from "../Layout/CleanPage"
import Horizontal from "../../components/Read/Horizontal"
import Normal from "../../components/Read/Normal"
import Vertical from "../../components/Read/Vertical"

export default function Pages() {
  const {t} = useTranslation()
  const [articleData, setArticleData] = useState<any>({})
  const [readDataList,setReadDataList] = useState<any>()
  const params = useParams<any>()
  const setData = (key, value) => {
    setArticleData((old) => {
      let newobj = {...old}
      newobj[key] = value
      return newobj
    })
  }
  const getItemData = async () => {
    let readData = []
    const { value } = await Preferences.get({ key: key.read });
    if (value === null) return;
    if (value) {
      readData = JSON.parse(value);
      readData = readData.filter((item: any) => {
        return String(item.id) === String(params.id);
      });
    }
    // console.log(readData[0])
    setReadDataList(readData[0])
    setData("title",readData[0].title)
    setData("date",readData[0].date)
    setData("summary",readData[0].summary)
  }
  const getFileData = async () => {
    // setData("html",`<p>${t("data.loading")}</p>`)
    if (params.id){
      const contents = await Filesystem.readFile({
        path: `${params.id}/content.txt`,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      console.log('secrets:', contents);
      let doc = new DOMParser().parseFromString(JSON.parse(contents.data).content, 'text/html');
      Array.from(doc.getElementsByTagName("a")).forEach((e) => {
        e.relList.add("noopener","noreferrer")
      })
      const safeHtml = DOMPurify.sanitize(doc.documentElement.innerHTML);
      setData("html",safeHtml)
      setData("url",JSON.parse(contents.data).url)
      setData("columnGap","15")
    }
  }
  // Read data
  useEffect(() => {
    getItemData()
    setData("id",params.id)
  }, [params.id])
  useEffect(() => {
    getFileData()
  }, [readDataList])
  return (
    <CleanPage back={params.view === "normal"} title={articleData.title}>
      <DetailContext.Provider value={articleData}>
        {params.view === "normal" ? <Normal /> : <></>}
        {params.view === "horizontal" ? <Horizontal /> : <></>}
        {params.view === "vertical" ? <Vertical /> : <></>}
      </DetailContext.Provider>
    </CleanPage>
  )
}
