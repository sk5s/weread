import { useContext, useEffect, useState } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { useSwipeable } from "react-swipeable"
import { IonRange } from "@ionic/react"
import { useTranslation } from "react-i18next"
import HtmlContent from "./HtmlContent"

export default function Vertical() {
  const article = useContext<any>(DetailContext)
  const {t} = useTranslation()
  const [somethingInDivClicked,setSomethingInDivClicked] = useState(false)
  const [controlShow, setControlShow] = useState(false)
  const [allPage,setAllPage] = useState(1)
  const [page,setPage] = useState(1)
  const updateAllPage = () => {
    if (document.getElementById("vertical_readin") !== null){
      if (document.getElementById("vertical_readin")?.offsetWidth !== null){
        let newAllPage = parseInt((Math.round(document.getElementById('vertical_readin')!.scrollHeight / document.getElementById('vertical_readin')!.offsetHeight)).toString())
        console.log("allpage: " +newAllPage)
        if (isNaN(newAllPage)) return
        setAllPage(newAllPage)
      }
    }
  }
  const turnToPage = (page) => {
    console.log("newpage: "+page)
    if (page <= 0) return;
    let element = document.getElementById('vertical_readout');
    if (element === null) return;
    let theCSSprop = window
      .getComputedStyle(element, null)
      .getPropertyValue('height');
    let readoutw = parseInt(theCSSprop.split('px')[0])
    if (document.getElementById('vertical_readin') === null) return
    document.getElementById('vertical_readin')!.scrollTop = (page-1) * readoutw;
  }
  const nextpage = () => {
    if (page === allPage) return
    console.log("next", page+1)
    if (page + 1 > allPage) setPage(allPage)
    turnToPage(page + 1)
    setPage((page:any) => page + 1)
  }
  const previouspage = () => {
    if (page <= 1) return
    console.log("previous", page-1)
    if (page + 1 > allPage) setPage(allPage)
    turnToPage(page - 1)
    setPage((page:any) => page - 1)
  }
  const hideControl = () => {
    setControlShow(false)
  }
  const showControl = () => {
    setControlShow(true)
  }
  const handlers = useSwipeable({
    onSwipedLeft: previouspage,
    onSwipedRight: nextpage
  })
  const handleDivClicked = async (e) => {
    if (somethingInDivClicked) return
    let fullWidth = document.getElementById('vertical_container')!.offsetWidth
    let clickWidth = fullWidth / 4
    if (e.clientX <= clickWidth){
      nextpage()
    } else if (e.clientX >= fullWidth - clickWidth){
      previouspage()
    } else if (!somethingInDivClicked){
      if (controlShow){
        hideControl()
      } else {
        showControl()
      }
    }
  }
  useEffect(() => {
    updateAllPage()
    setPage(1)
  },[article.html])
  return (
    <>
      <div style={{position:"fixed",left: article.columnGap + "px"}}>
        <span>{page} / {allPage}</span>
      </div>
      <div id="vertical_container" style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}} {...handlers} onClick={(e) => handleDivClicked(e)}>
          <div id="vertical_readout" style={{position:"relative",overflow: "hidden", flex: 1, width: "100%"}}>
            <div id="vertical_readin" style={{writingMode: "vertical-rl", touchAction: "none", position: "absolute", overflowY: "scroll", width: "100%", columnWidth: "500px",columnGap: article.columnGap*2+"px",paddingTop: article.columnGap+"px",paddingBottom: article.columnGap+"px",paddingLeft:"15px",paddingRight: "15px"}} >
              <HtmlContent type="vertical" setSomethingInDivClicked={setSomethingInDivClicked} />
            </div>
          </div>
      </div>
      {
        false ?
      <div style={{position:"fixed", bottom: "0px", width:"100%", minHeight: "150px", backgroundColor: "var(--background)", borderTop: "1px solid var(--ion-color-light-contrast)"}}>
        <div style={{padding: "15px"}}>
          <IonRange labelPlacement="start" ticks={true} snaps={true} min={0} max={3} onIonChange={({ detail }) => console.log(detail.value)}>
            <div slot="label">{t("pages.detail.control.spaceBetweenPages")}</div>
          </IonRange>
        </div>
      </div>
        : <></>
      }
    </>
  )
}
