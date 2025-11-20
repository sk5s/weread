import DeleteAllData from "../../components/Button/DeleteAllData";
import ExportData from "../../components/Button/ExportData";
import ImportData from "../../components/Button/ImportData";
import { useTranslation } from "react-i18next";
import Childpage from "../Layout/ChildPage";

export default function Data() {
  const {t} = useTranslation()
  return (
    <Childpage title={t("pages.data.title")}>
      <ExportData />
      <ImportData />
      <DeleteAllData />
    </Childpage>
  )
}
