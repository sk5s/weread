import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useEffect, useState } from "react"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from 'isomorphic-dompurify';
import CleanPage from "../Layout/CleanPage"
import { useSwipeable } from 'react-swipeable';

import "./Detail.css"
import "./DetailPages.css"

export default function DetailPages() {
  const params = useParams<any>()
  const {t} = useTranslation()
  const [readDataList,setReadDataList] = useState<any>({})
  const [fileData,setFileData] = useState<any>({})
  const [html, setHtml] = useState<any>()

  const [allPage,setAllPage] = useState(1)
  const [page,setPage] = useState(1)
  const [colWidth,setColWidth] = useState("500px")

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
      setHtml(`<h1 style={{fontWeight: "bold"}}>${fileData.title}</h1>`+safeHtml)
    }
  }
  useEffect(() => {
    getItemData()
  }, [params.articleId])
  useEffect(() => {
    getFileData()
  }, [readDataList])

  const nextpage = () => {
    if (page === allPage) return
    console.log("next", page+1)
    if (page + 1 > allPage) setPage(allPage)
    turnToPage(page + 1)
    setPage((page:any) => page + 1);
  }
  const previouspage = () => {
    if (page <= 1) return
    console.log("previous", page-1)
    if (page + 1 > allPage) setPage(allPage)
    turnToPage(page - 1)
    setPage((page:any) => page - 1);
  }
  const handlers = useSwipeable({
    onSwipedLeft: nextpage,
    onSwipedRight: previouspage
  })
  const updateAllPage = () => {
    setColWidth(document.getElementById("readout")!.offsetWidth.toString() + "px")
    if (document.getElementById("readin") !== null){
      if (document.getElementById("readin")?.offsetWidth !== null){
        let newAllPage = parseInt((document.getElementById('readin')!.scrollWidth / document.getElementById('readin')!.offsetWidth).toString())
        if (isNaN(newAllPage)) return
        setAllPage(newAllPage)
        setPage(1)
      }
    }
  }
  const turnToPage = (page) => {
    console.log("newpage: "+page)
    if (page <= 0) return;
    let element = document.getElementById('readout');
    if (element === null) return;
    let theCSSprop = window
      .getComputedStyle(element, null)
      .getPropertyValue('width');
    let readoutw = parseInt(theCSSprop.split('px')[0])
    console.log(readoutw);
    if (document.getElementById('readin') === null) return
    document.getElementById('readin')!.scrollLeft = (page-1) * readoutw;
    console.log((page-1) * readoutw)
  }
  useEffect(() => {
    updateAllPage()
  },[html])
  return (
    <CleanPage>
      <div>
        <span>{page} / {allPage}</span>
      </div>
      <div style={{height:"100%",width:"100%",display:"flex",flexDirection:"column"}} {...handlers}>
        <div style={{position:"relative",flex:1,overflowX: "hidden"}} id="readout">
          <div id='readin' style={{columnWidth: colWidth}} >
            <div className="html" key={params.articleId} dangerouslySetInnerHTML={{__html: html}} />
          </div>
        </div>
      </div>
    </CleanPage>
  )
}
