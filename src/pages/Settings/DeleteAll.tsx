import DeleteAllData from "../../components/Button/DeleteAllData";
import { useTranslation } from "react-i18next";
import Childpage from "../Layout/ChildPage";

export default function DeleteAll() {
  const {t} = useTranslation()
  return (
    <Childpage title={t("pages.delete.title")}>
      <DeleteAllData />
    </Childpage>
  )
}
