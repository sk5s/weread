import { useContext, useEffect, useRef, useState } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { useSwipeable } from "react-swipeable"
import { useTranslation } from "react-i18next"
import HtmlContent from "./HtmlContent"
import { SettingsContext } from "../../SettingsContext"
import ReadingToolbars from "./ReadingToolbars"
import { useViewerContext } from "../../contexts/ViewerContext"

export default function Vertical() {
  const article = useContext<any>(DetailContext)
  const settings = useContext(SettingsContext)
  const {t} = useTranslation()
  const [somethingInDivClicked,setSomethingInDivClicked] = useState(false)
  const [controlShow, setControlShow] = useState(false)
  const [allPage,setAllPage] = useState(1)
  const [page,setPage] = useState(1)
  const { fontSize, saveFontSize } = useViewerContext()
  const updateAllPage = () => {
    const container = document.getElementById("vertical_readin");
    if (!container) return;
    
    // Calculate pages based on scroll height and container height
    const totalHeight = container.scrollHeight;
    const viewportHeight = container.offsetHeight;
    const newAllPage = Math.ceil(totalHeight / viewportHeight);
    
    console.log("allpage: " + newAllPage);
    if (isNaN(newAllPage) || newAllPage <= 0) return;
    setAllPage(newAllPage);
  }

  const turnToPage = (pageNum: number) => {
    console.log("newpage: " + pageNum);
    if (pageNum <= 0 || pageNum > allPage) return;
    
    const container = document.getElementById('vertical_readin');
    if (!container) return;
    
    const viewportHeight = container.offsetHeight;
    const scrollPosition = (pageNum - 1) * viewportHeight;
    
    container.scrollTo({
      top: scrollPosition
    });
  }

  const nextpage = () => {
    if (page >= allPage) return;
    const nextPage = page + 1;
    console.log("next", nextPage);
    turnToPage(nextPage);
    setPage(nextPage);
  }

  const previouspage = () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    console.log("previous", prevPage);
    turnToPage(prevPage);
    setPage(prevPage);
  }
  const hideControl = () => {
    setControlShow(false)
  }
  const showControl = () => {
    setControlShow(true)
  }
  const handlers = useSwipeable({
    onSwipedLeft: previouspage,
    onSwipedRight: nextpage,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true
  })
  const handleDivClicked = async (e: React.MouseEvent) => {
    if (somethingInDivClicked) return;
    const container = document.getElementById('vertical_container');
    if (!container) return;
    
    const fullWidth = container.offsetWidth;
    const clickWidth = fullWidth / 4;
    
    // For vertical-rl layout, left side is next page, right side is previous page
    if (e.clientX <= clickWidth) {
      nextpage();
    } else if (e.clientX >= fullWidth - clickWidth) {
      previouspage();
    } else if (!somethingInDivClicked) {
      setControlShow(!controlShow);
    }
  }
  useEffect(() => {
    updateAllPage()
    setPage(1)
  },[article.html])
  

  return (
    <div style={{paddingTop: "var(--ion-safe-area-top, 0)", paddingBottom: "var(--ion-safe-area-bottom, 0)", width: "100%", height: "100%"}}>
      <ReadingToolbars
        controlShow={controlShow}
        fontSize={fontSize}
        page={page}
        allPage={allPage}
        triggerId="font-settings-trigger-vertical"
        onFontSizeChange={saveFontSize}
        onPageChange={(newPage) => {
          setPage(newPage);
          turnToPage(newPage);
        }}
        direction="rtl"
      />
      
      <div id="vertical_container" style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}} {...handlers} onClick={(e) => handleDivClicked(e)}>
          <div id="vertical_readout" style={{position:"relative",overflow: "hidden", flex: 1, width: "100%"}}>
            <div id="vertical_readin" style={{
              writingMode: "vertical-rl", 
              touchAction: "none", 
              position: "absolute", 
              overflowY: "scroll", 
              overflowX: "hidden",
              width: "100%", 
              height: "100%",
              columnWidth: "500px",
              columnGap: article.columnGap*2+"px",
              paddingTop: article.columnGap+"px",
              paddingBottom: article.columnGap+"px",
              paddingLeft:"15px",
              paddingRight: "15px",
              columnFill: "auto",
              breakInside: "avoid",
              breakAfter: "column"
            }} >
              <HtmlContent type="vertical" setSomethingInDivClicked={setSomethingInDivClicked} fontSize={fontSize} />
            </div>
          </div>
      </div>
    </div>
  )
}
