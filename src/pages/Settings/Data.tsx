import DeleteAllData from "../../components/Button/DeleteAllData";
import { useTranslation } from "react-i18next";
import Childpage from "../Layout/ChildPage";

export default function Data() {
  const {t} = useTranslation()
  return (
    <Childpage title={t("pages.data.title")}>
      <DeleteAllData />
    </Childpage>
  )
}
