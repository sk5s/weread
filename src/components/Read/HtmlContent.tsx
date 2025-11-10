import { useContext, useEffect, useState } from "react";
import { DetailContext } from "../../pages/Detail/Context";
import { useTranslation } from "react-i18next";
import { useIonAlert, IonButton, useIonToast } from "@ionic/react";
import { SettingsContext } from "../../SettingsContext";
import { useHistory } from "react-router";
import { Clipboard } from "@capacitor/clipboard";
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import viewer from "react-mobile-image-viewer";
import "react-mobile-image-viewer/lib/index.css";
import { truncateURI } from "../../lib/utils";

export default function HtmlContent({
  setSomethingInDivClicked,
  type,
}: {
  setSomethingInDivClicked?: any;
  type: "normal" | "vertical" | "horizontal";
}) {
  if (!setSomethingInDivClicked) {
    setSomethingInDivClicked = (e) => console.log(e);
  }
  const article = useContext<any>(DetailContext);
  const { t } = useTranslation();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const history = useHistory();
  const globalSettings = useContext(SettingsContext);
  const [isTtsActive, setIsTtsActive] = useState(false);
  const extractTextFromHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || '';
  };
  const startTts = async () => {
    if (article.html) {
      setIsTtsActive(true);
      const text = extractTextFromHTML(article.html);
      const chunks = text.split(/[\n.,!?;]+/);
      for (let chunk of chunks) {
        const trimmedChunk = chunk.trim();
        if (!trimmedChunk) continue;
        try {
          await TextToSpeech.speak({
            text: trimmedChunk,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
            queueStrategy: 1
          });
        } catch (error) {
          console.error('Error stopping TTS:', error);
          break;
        }
      }
    }
    setIsTtsActive(false);
  }
  const stopTts = async () => {
    try {
      await TextToSpeech.stop()
      setIsTtsActive(false);
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  }
  const updateATag = () => {
    let handleClick = async (event, e) => {
      event.preventDefault();
      setSomethingInDivClicked(true);
      console.log("Clicked: ", e.href);
      presentAlert({
        header: t("pages.detail.confirm.title"),
        message: truncateURI(e.href),
        cssClass: globalSettings.imode ? "nodrop" : "",
        buttons: [
          {
            text: t("app.confirm.cancel"),
            role: "cancel",
            handler: () => {
              setSomethingInDivClicked(false);
            },
          },
          {
            text: t("pages.detail.confirm.addUrl"),
            handler: () => {
              history.push("/add?q=" + e.href);
              setSomethingInDivClicked(false);
            },
          },
          {
            text: t("pages.detail.confirm.copyUrl"),
            handler: async () => {
              try {
                await Clipboard.write({ string: e.href });
                presentToast(t("app.copy.success"), 4000);
              } catch (error) {
                console.error("Failed to copy URL to clipboard:", error);
              }
            },
          },
          {
            text: t("pages.detail.confirm.openUrl"),
            role: "confirm",
            handler: () => {
              setSomethingInDivClicked(false);
              window.open(e.href, "_blank", "noopener=yes,noreferrer=yes");
            },
          },
        ],
      });
    };
    console.log("Refreshing a tags: htmlContent_" + article.id + "_" + type);
    console.log(
      document
        .getElementById("htmlContent_" + article.id + "_" + type)
        .getElementsByTagName("a"),
    );
    Array.from(
      document
        .getElementById("htmlContent_" + article.id + "_" + type)
        .getElementsByTagName("a"),
    ).forEach((e) => {
      if (article.url === null) return;
      try {
        const baseUrl = new URL(article.url);
        const hrefValue = e.getAttribute("href");
        if (hrefValue === null) {
          console.log("No href value found.");
        } else if (hrefValue.startsWith("/")) {
          const absoluteUrl = new URL(hrefValue, baseUrl.origin).href;
          e.setAttribute("href", absoluteUrl);
        } else if (
          new URL(hrefValue).hostname === location.hostname ||
          new URL(hrefValue).hostname === "localhost"
        ) {
          const absoluteUrl = new URL(
            `${baseUrl.pathname.split("/").slice(0, -1).join("/")}${new URL(hrefValue).pathname}`,
            baseUrl.origin,
          ).href;
          console.log(absoluteUrl);
          e.setAttribute("href", absoluteUrl);
        }
        let handler = (event) => {
          handleClick(event, e);
        };
        if (hrefValue !== null && hrefValue !== "") {
          e.onclick = handler;
        }
      } catch (error) {
        console.log(error, article.url);
      }
    });
  };
  const updateImgTag = () => {
    Array.from(
      document
        .getElementById("htmlContent_" + article.id + "_" + type)
        .getElementsByTagName("img"),
    ).forEach((e) => {
      e.onclick = () => {
        viewer({
          urls: [e.src],
          zIndex: 9999,
          doubleTap: true,
        });
      };
    });
  };
  useEffect(() => {
    updateATag();
    updateImgTag();
  }, [article.html]);
  return (
    <>
      {isTtsActive
      ? <IonButton color="dark" onClick={stopTts}>Stop Button</IonButton>
      : <IonButton color="dark" onClick={startTts}>Start Button</IonButton>
      }
      <div
        id={"htmlContent_" + article.id + "_" + type}
        className="html"
        key={article.id}
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </>
  );
}
