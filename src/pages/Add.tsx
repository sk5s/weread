import { IonButton, IonChip, IonCol, IonGrid, IonInput, IonItem, IonProgressBar, IonRow, useIonAlert } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import key from '../lib/storage.json'
import { v4 as uuidv4 } from 'uuid';
import { useHistory, useLocation, useParams } from 'react-router';
import { Readability } from '@mozilla/readability';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { on, trigger } from '../lib/Event';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import sanitize from 'sanitize-filename';
import GeneralPage from './Layout/GeneralPage';
import { SettingsContext } from '../SettingsContext';
import { validateUrl } from '../lib/utils';

function Add() {
  const {t} = useTranslation()
  const history = useHistory();
  let location = useLocation();
  const context = useContext(SettingsContext);
  const [presentAlert] = useIonAlert();
  const useQuery = () => new URLSearchParams(location.search);
  
  const query = useQuery();
  const [inputUrl, setInputUrl] = useState<string>(query.get("q"));
  const [valid, setValid] = useState<boolean>(validateUrl(query.get("q")));
  const [progress, setProgress] = useState(0)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState<any>()

  useEffect(() => {
    setInputUrl(query.get("q"))
    setValid(validateUrl(query.get("q")))
  }, [location])

  let readList = [];
  const doGet = async (url:string|undefined|null) => {
    if (url === "" || url === null || url === undefined) return
    setProgress(0.2)
    const options = {
      url
    };
    setTimeout(async () => {
      setProgress(0.55)
      try{
        const response: HttpResponse = await CapacitorHttp.get(options);
        let doc = new DOMParser().parseFromString(response.data, "text/html");
        let myarticle = new Readability(doc).parse();
        setProgress(0.85)
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
          setProgress(1)
        }
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
        // Handle the error appropriately, e.g., display an error message to the user
        presentAlert({
          header: t("pages.add.failedToFetch.header"),
          message: t("pages.add.failedToFetch.message"),
          cssClass: context.imode ? "nodrop" : "",
          buttons: [
          {
            text: t("app.confirm.yes"),
            role: 'confirm'
          },],
        })
        setProgress(0);
      }
    }, 300);
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
    setProgress(0)
  }
  return (
    <GeneralPage title={t("pages.add.title")} menuId="menu-add">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonItem style={{marginLeft: "-10px"}}>
              <IonInput type='url' value={inputUrl} onIonInput={(e) => {setInputUrl(e.detail.value!);setValid(validateUrl(e.detail.value!));}} label={`${t("pages.add.label.inputUrl")}`} labelPlacement="stacked" placeholder="https://"></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              color="dark"
              disabled={(inputUrl === "" || !valid)}
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
              <IonProgressBar color="dark" value={progress}></IonProgressBar>
            </IonCol>
          </IonRow>
          :
          <IonRow>
            <IonCol>
              <IonChip color="dark">{t("pages.add.warn")}</IonChip>
            </IonCol>
          </IonRow>
        }
        {(progress === 1 && title === "") && (
          <h1>{t("pages.add.extractFailed")}</h1>
        )}
        <div style={{display: title === "" ? "none" : ""}}>
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
                color="dark"
                expand="full"
                onClick={() => clearForm()}
              >
                {t("pages.add.label.clearButton")}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                color="dark"
                expand="full"
                disabled={progress !== 1}
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
