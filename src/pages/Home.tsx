import { useTranslation } from 'react-i18next';
import MainReadList from '../components/MainReadList';
import GeneralPage from './Layout/GeneralPage';

function Home() {
  const {t} = useTranslation()
  return (
    <GeneralPage title={t("app.name")} menuId="menu-home">
      <MainReadList />
    </GeneralPage>
  );
}

export default Home;
