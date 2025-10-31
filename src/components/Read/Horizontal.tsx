import { useContext, useEffect, useState } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { useSwipeable } from "react-swipeable"
import { IonRange } from "@ionic/react"
import { useTranslation } from "react-i18next"
import HtmlContent from "./HtmlContent"

export default function Horizontal() {
  const article = useContext<any>(DetailContext)
  const {t} = useTranslation()
  const [somethingInDivClicked,setSomethingInDivClicked] = useState(false)
  const [controlShow, setControlShow] = useState(false)
  const [allPage,setAllPage] = useState(1)
  const [page,setPage] = useState(1)
  const updateAllPage = () => {
    if (document.getElementById("horizontal_readin") !== null){
      if (document.getElementById("horizontal_readin")?.offsetWidth !== null){
        let newAllPage = parseInt((Math.round(document.getElementById('horizontal_readin')!.scrollWidth / document.getElementById('horizontal_readin')!.offsetWidth)).toString())
        console.log("allpage: " +newAllPage)
        if (isNaN(newAllPage)) return
        setAllPage(newAllPage)
      }
    }
  }
  const turnToPage = (page) => {
    console.log("newpage: "+page)
    if (page <= 0) return;
    let element = document.getElementById('horizontal_readout');
    if (element === null) return;
    let theCSSprop = window
      .getComputedStyle(element, null)
      .getPropertyValue('width');
    let readoutw = parseInt(theCSSprop.split('px')[0])
    if (document.getElementById('horizontal_readin') === null) return
    document.getElementById('horizontal_readin')!.scrollLeft = (page-1) * readoutw;
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
    onSwipedLeft: nextpage,
    onSwipedRight: previouspage
  })
  const handleDivClicked = async (e) => {
    if (somethingInDivClicked) return
    let fullWidth = document.getElementById('horizontal_container')!.offsetWidth
    let clickWidth = fullWidth / 4
    if (e.clientX <= clickWidth){
      previouspage()
    } else if (e.clientX >= fullWidth - clickWidth){
      nextpage()
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
    <div style={{paddingTop: "var(--ion-safe-area-top, 0)", paddingBottom: "var(--ion-safe-area-bottom, 0)", width: "100%", height: "100%"}}>
      <div style={{position:"fixed",left: article.columnGap + "px"}}>
        <span>{page} / {allPage}</span>
      </div>
      <div id="horizontal_container" style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}} {...handlers} onClick={(e) => handleDivClicked(e)}>
          <div id="horizontal_readout" style={{position:"relative",overflowX: "hidden", flex: 1}}>
            <div id="horizontal_readin" style={{touchAction: "none", position: "absolute", overflowX: "scroll", height: "100%", columnWidth: "500px",columnGap: article.columnGap*2+"px",paddingLeft: article.columnGap+"px",paddingRight: article.columnGap+"px",paddingTop:"20px",paddingBottom: "20px"}} >
              <HtmlContent type="horizontal" setSomethingInDivClicked={setSomethingInDivClicked} />
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
    </div>
  )
}
