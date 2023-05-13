import DeleteAllData from "../../components/DeleteAllData";
import { useTranslation } from "react-i18next";
import GeneralPage from "../Layout/GeneralPage";

export default function DeleteAll() {
  const {t} = useTranslation()
  return (
    <GeneralPage title={t("pages.detail.title")} menuId="menu-delete">
      <DeleteAllData />
    </GeneralPage>
  )
}
