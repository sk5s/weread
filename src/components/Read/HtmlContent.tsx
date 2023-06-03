import { useContext, useEffect, useState } from "react"
import { DetailContext } from "../../pages/Detail/Context"
import { useTranslation } from "react-i18next";
import { useIonAlert } from "@ionic/react";
import { SettingsContext } from "../../SettingsContext";
import { useHistory } from "react-router";

import viewer from 'react-mobile-image-viewer';
import 'react-mobile-image-viewer/lib/index.css';

export default function HtmlContent({
  setSomethingInDivClicked,
}:{
  setSomethingInDivClicked?:any;
}) {
  if (!setSomethingInDivClicked) {
    setSomethingInDivClicked = (e) => console.log(e)
  }
  const article = useContext<any>(DetailContext)
  const {t} = useTranslation()
  const [presentAlert] = useIonAlert()
  const history = useHistory()
  const globalSettings = useContext(SettingsContext)
  const updateATag = () => {
    console.log("update a tag")
    let handleClick = async (event,e) => {
      event.preventDefault()
      setSomethingInDivClicked(true)
      console.log("clicked", e.href)
      presentAlert({
        header: t("pages.detail.confirm.title", { url: e.href}),
        message: e.href,
        cssClass: globalSettings.imode ? "nodrop" : "",
        buttons: [{
          text: t("app.confirm.cancel"),
          role: 'cancel',
          handler: () => {
            console.log("cancel")
            setSomethingInDivClicked(false)
          },
        },
        {
          text: t("pages.detail.confirm.addUrl"),
          handler: () => {
            console.log("addUrl")
            history.push("/add?q="+e.href)
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
    }
    Array.from(document.getElementById("htmlContent_" + article.id).getElementsByTagName("a")).forEach((e) => {
      let handler = (event) => {
        handleClick(event, e)
      }
      e.onclick = handler
    })
  }
  const updateImgTag = () => {
    Array.from(document.getElementById("htmlContent_" + article.id).getElementsByTagName("img")).forEach((e) => {
      e.onclick = () => {
        viewer({
          urls: [e.src],
          zIndex: 9999,
          doubleTap: true,
        });
      }
    })
  }
  useEffect(() => {
    updateATag()
    updateImgTag()
  },[article.html])
  return (
    <>
    <div id={"htmlContent_" + article.id} className="html" key={article.id} dangerouslySetInnerHTML={{__html: article.html}} />
    </>
  )
}
