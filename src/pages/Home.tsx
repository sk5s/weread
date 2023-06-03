import { useTranslation } from 'react-i18next';
import MainReadList from '../components/MainReadList';
import GeneralPage from './Layout/GeneralPage';
import { useContext } from 'react';
import { SettingsContext } from '../SettingsContext';

function Home() {
  const {t} = useTranslation()
  const context = useContext(SettingsContext)
  return (
    <GeneralPage title={t("app.name")} menuId="menu-home">
      <MainReadList list={context.defaultReadView} />
    </GeneralPage>
  );
}

export default Home;
