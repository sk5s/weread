import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Preferences } from "@capacitor/preferences"
import key from '../../lib/storage.json'
import { useContext, useEffect, useState } from "react"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import DOMPurify from 'isomorphic-dompurify';
import CleanPage from "../Layout/CleanPage"
import { useSwipeable } from 'react-swipeable';
import { StatusBar } from '@capacitor/status-bar';
import { App } from "@capacitor/app"

import "./Detail.css"
import "./DetailPages.css"
import { useIonAlert } from "@ionic/react"
import { SettingsContext } from "../../SettingsContext"

export default function DetailPages() {
  const params = useParams<any>()
  const {t} = useTranslation()
  const [presentAlert] = useIonAlert();
  const [readDataList,setReadDataList] = useState<any>({})
  const [fileData,setFileData] = useState<any>({})
  const [html, setHtml] = useState<any>()

  const [allPage,setAllPage] = useState(1)
  const [page,setPage] = useState(1)
  const [colWidth,setColWidth] = useState("500px")
  const [somethingInDivClicked,setSomethingInDivClicked] = useState(false)
  const context = useContext(SettingsContext)

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
      setHtml(`<h1 style="font-weight: bold;">${fileData.title}</h1>`+safeHtml)
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
    if (document.getElementById("readout")!.offsetWidth > 300){
      setColWidth(document.getElementById("readout")!.offsetWidth.toString() + "px")
    }
    if (document.getElementById("readin") !== null){
      if (document.getElementById("readin")?.offsetWidth !== null){
        let newAllPage = parseInt((Math.round(document.getElementById('readin')!.scrollWidth / document.getElementById('readin')!.offsetWidth)).toString())
        console.log("allpage: " +newAllPage)
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
    // console.log(readoutw);
    if (document.getElementById('readin') === null) return
    document.getElementById('readin')!.scrollLeft = (page-1) * readoutw;
    // console.log((page-1) * readoutw)
  }
  const updateATag = () => {
    Array.from(document.getElementById("readin").getElementsByTagName("a")).forEach((e) => {
      e.addEventListener("click", async (event) => {
        event.preventDefault()
        setSomethingInDivClicked(true)
        console.log("clicked", e.href)
        presentAlert({
          header: t("pages.detail.confirm.title", { url: e.href}),
          message: e.href,
          cssClass: context.imode ? "nodrop" : "",
          buttons: [{
            text: t("app.confirm.cancel"),
            role: 'cancel',
            handler: () => {
              console.log("cancel")
              setSomethingInDivClicked(false)
            },
          },
          {
            text: t("app.confirm.yes"),
            role: 'confirm',
            handler: () => {
              console.log("confirm")
              setSomethingInDivClicked(false)
              window.open(e.href,'_blank','noopener=yes,noreferrer=yes')
            },
          },],
        })
      })
    })
  }
  useEffect(() => {
    updateAllPage()
    App.addListener("backButton", () => {
      showStatusBar()
    })
    hideStatusBar()
    updateATag()
  },[html])
  const hideStatusBar = async () => {
    await StatusBar.hide();
  };
  const showStatusBar = async () => {
    await StatusBar.show();
  };
  const handleDivClicked = async (e) => {
    if (somethingInDivClicked) return
    let fullWidth = document.getElementById('readin')!.offsetWidth
    let clickWidth = fullWidth / 5
    console.log(e)
    if (e.clientX <= clickWidth){
      previouspage()
    } else if (e.clientX >= fullWidth - clickWidth){
      nextpage()
    } else if (!somethingInDivClicked){
      let info = await StatusBar.getInfo()
      if (info.visible){
        hideStatusBar()
      } else {
        showStatusBar()
      }
    }
  }
  return (
    <CleanPage>
      <div style={{height:"100%",width:"100%"}}>
        <div>
          <span>{page} / {allPage}</span>
        </div>
        <div style={{height:"98%",width:"100%",display:"flex",flexDirection:"column"}} {...handlers} onClick={(e) => handleDivClicked(e)}>
          <div style={{position:"relative",flex:1,overflowX: "hidden"}} id="readout">
            <div id='readin' style={{columnWidth: colWidth}} >
              <div className="html" key={params.articleId} dangerouslySetInnerHTML={{__html: html}} />
            </div>
          </div>
        </div>
      </div>
    </CleanPage>
  )
}