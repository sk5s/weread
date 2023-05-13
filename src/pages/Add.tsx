import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonMenuButton, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import MainMenu from '../components/Menu/MainMenu';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import key from '../lib/storage.json'
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import { Readability } from '@mozilla/readability';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { trigger } from '../lib/Event';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import sanitize from 'sanitize-filename';
import GeneralPage from './Layout/GeneralPage';

function Add() {
  const {t} = useTranslation()
  const history = useHistory();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [progress, setProgress] = useState(0)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState<any>()
  const validateUrl = (str:string) => {
    let url;
    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }
  let readList = [];
  const doGet = async (url:string|undefined|null) => {
    if (url === "" || url === null || url === undefined) return
    setProgress(0.5)
    const options = {
      url
    };
    setTimeout(async () => {
      const response: HttpResponse = await CapacitorHttp.get(options);
      let doc = new DOMParser().parseFromString(response.data, "text/html");
      let myarticle = new Readability(doc).parse();
      if (myarticle !== null) {
        setTitle(myarticle.title)
        setSummary(myarticle.excerpt)
        console.log(myarticle)
        setContent({
          title: myarticle.title,
          length: myarticle.length,
          content: myarticle.content,
          url: inputUrl
        })
        setProgress(0.95)
        setTimeout(() => {
          setProgress(0)
        }, 700);
      }
    }, 1000);
  };
  const addNewWeRead = async (newItem: {
    title: any;
    date: string;
    summary?: string;
  }) => {
    if (!newItem.title) return;
    const { value } = await Preferences.get({ key: key.read });
    if (value) {
      readList = JSON.parse(value);
    } else {
      readList = [];
    }
    let readId = uuidv4()
    saveArticleToData(readId, content)
    readList.push({
      id: readId,
      title: newItem.title,
      date: newItem.date,
      summary: newItem.summary
    });
    clearForm()
    let prefcontent = JSON.stringify(readList);
    console.log(content)
    history.push("/home");
    await Preferences.set({
      key: key.read,
      value: prefcontent,
    });
    trigger("weread:listChange")
  };
  const saveArticleToData = async (fileName:string,content: any) => {
    await Filesystem.mkdir({
      path: fileName,
      directory: Directory.Data,
    })
    await Filesystem.writeFile({
      path: `${fileName}/content.txt`,
      data: JSON.stringify(content),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  }
  const clearForm = () => {
    setTitle("")
    setContent({})
    setSummary("")
    setInputUrl("")
  }
  return (
    <GeneralPage title={t("app.name")}>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonInput type='url' value={inputUrl} onIonInput={(e) => {if (validateUrl(e.detail.value!)) {setInputUrl(e.detail.value!);setValid(true);}else{setValid(false)}}} label={`${t("pages.add.label.inputUrl")}`} labelPlacement="stacked" placeholder="https://"></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              disabled={(inputUrl === "" || !valid) || title != ""}
              expand="full"
              onClick={() => {
                doGet(inputUrl)
              }}
            >
              {t("pages.add.label.getButton")}
            </IonButton>
          </IonCol>
        </IonRow>
        {
          progress ? 
          <IonRow>
            <IonCol>
              <IonProgressBar value={progress}></IonProgressBar>
            </IonCol>
          </IonRow>
          : <></>
        }
        <div style={{display: title == "" ? "none" : ""}}>
          <IonRow>
            <IonCol>
              <h1>{title}</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {summary}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                expand="full"
                onClick={() => clearForm()}
              >
                {t("pages.add.label.clearButton")}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="full"
                onClick={() => {
                  addNewWeRead({
                    title: sanitize(title),
                    date: new Date().getTime().toString(),
                    summary
                  })
                }}
              >
                {t("pages.add.label.addButton")}
              </IonButton>
            </IonCol>
          </IonRow>
        </div>
      </IonGrid>
    </GeneralPage>
  );
}

export default Add;
