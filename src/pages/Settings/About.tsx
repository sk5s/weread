import { useTranslation } from "react-i18next";
import Childpage from "../Layout/ChildPage";
import { IonChip, getPlatforms } from "@ionic/react";
import { App } from "@capacitor/app"
import { useEffect, useState } from "react";
import logo from "../../../resources/icon.png"

export default function About() {
  const {t} = useTranslation()
  const [version, setVersion] = useState("")
  const getVersion = async () => {
    let { version } = await App.getInfo()
    console.log(version)
    setVersion(version)
  }
  useEffect(() => {
    getVersion()
  }, [])
  return (
    <Childpage title={t("pages.settings.about.label",{app: t("app.name")})}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <a href="https://github.com/sk5s/weread" target="_blank" rel="noreferrer">
          <img style={{borderRadius: "8px"}} src={logo} alt="Logo" width="80" height="80" />
        </a>
        <p>
          {t("app.name")} {t("app.versionStr",{versionName: version})}
        </p>
        <p>
          {(() => {
            let platforms: any = [];
            getPlatforms().forEach((p, i) => {
              platforms.push(
                <IonChip key={i} color="dark">
                  {p}
                </IonChip>
              );
            });
            return platforms;
          })()}
        </p>
        <div>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=cyou.sk5s.app.weread"
          >
            <img
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              width="150px"
            />
          </a>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://apt.izzysoft.de/fdroid/index/apk/cyou.sk5s.app.weread"
          >
            <img
              alt="Get it on Google Play"
              src="https://sk5s.cyou/countdate-landing/assets/img/IzzyOnDroid.png"
              width="150px"
            />
          </a>
        </div>
      </div>
      {/* detail */}
      <p style={{ fontSize: "25px", marginLeft: "20px" }}>
        {t("app.slogan")}
      </p>
      <ul style={{ fontSize: "25px" }}>
        <li>
          <a
            href="https://weread.sk5s.cyou/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Landing page
          </a>
        </li>
        <li>
          <a
            href="https://github.com/sk5s/weread"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project Github
          </a>
        </li>
        <li>
          <a
            href="https://github.com/sk5s/weread/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report Bug
          </a>
        </li>
        <li>
          <a
            href="https://github.com/sk5s/weread/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request feature
          </a>
        </li>
      </ul>
    </Childpage>
  )
}
