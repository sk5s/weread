import { IonButton, IonProgressBar, useIonAlert, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { CapacitorZip } from '@capgo/capacitor-zip';
import { App } from '@capacitor/app';
import key from '../../lib/storage.json';
import { SettingsContext } from '../../SettingsContext';
import { createManifest, getExportFileName } from '../../lib/exportImportUtils';
import { shareSharp } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

export default function ExportData() {
  const { t } = useTranslation();
  const context = useContext(SettingsContext);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFilePath, setExportedFilePath] = useState<string | null>(null);

  const exportData = async () => {
    setIsExporting(true);
    setProgress(0.1);
    
    try {
      console.log('[Export] Starting export process');
      // Get app version
      const appInfo = await App.getInfo();
      const appVersion = appInfo.version;
      console.log('[Export] App version:', appVersion);
      
      setProgress(0.2);
      
      // Create temporary export directory
      const tempDir = 'weread-export-temp';
      try {
        await Filesystem.rmdir({
          path: tempDir,
          directory: Directory.Cache,
          recursive: true,
        });
      } catch (e) {
        // Directory doesn't exist, that's fine
      }
      
      await Filesystem.mkdir({
        path: tempDir,
        directory: Directory.Cache,
      });
      console.log('[Export] Created temp directory');
      
      setProgress(0.3);
      
      // Get preferences data
      const readData = await Preferences.get({ key: key.read });
      const settingsData = await Preferences.get({ key: key.settings });
      
      const preferencesData = {
        read: readData.value ? JSON.parse(readData.value) : [],
        settings: settingsData.value ? JSON.parse(settingsData.value) : {},
      };
      
      // Save preferences to temp directory
      await Filesystem.writeFile({
        path: `${tempDir}/preferences.json`,
        data: JSON.stringify(preferencesData, null, 2),
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      console.log('[Export] Saved preferences, articles count:', preferencesData.read.length);
      
      setProgress(0.4);
      
      // Create articles directory
      await Filesystem.mkdir({
        path: `${tempDir}/articles`,
        directory: Directory.Cache,
      });
      
      // Copy all article files
      const articles = preferencesData.read || [];
      let copiedCount = 0;
      
      for (const article of articles) {
        try {
          const articleContent = await Filesystem.readFile({
            path: `${article.id}/content.txt`,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
          });
          
          await Filesystem.mkdir({
            path: `${tempDir}/articles/${article.id}`,
            directory: Directory.Cache,
          });
          
          await Filesystem.writeFile({
            path: `${tempDir}/articles/${article.id}/content.txt`,
            data: articleContent.data,
            directory: Directory.Cache,
            encoding: Encoding.UTF8,
          });
          
          copiedCount++;
          setProgress(0.4 + (copiedCount / articles.length) * 0.3);
        } catch (error) {
          console.error(`[Export] Error copying article ${article.id}:`, error);
        }
      }
      console.log('[Export] Copied', copiedCount, 'articles');
      
      setProgress(0.7);
      
      // Create manifest
      const manifest = await createManifest(articles.length, appVersion);
      await Filesystem.writeFile({
        path: `${tempDir}/manifest.json`,
        data: JSON.stringify(manifest, null, 2),
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      console.log('[Export] Created manifest');
      
      setProgress(0.8);
      
      // Create zip file - CapacitorZip expects file paths, not URIs
      const zipFileName = getExportFileName();
      
      // Use file paths for zip operation
      const sourcePath = tempDir;
      const destinationPath = zipFileName;
      
      console.log('[Export] Zip source path:', sourcePath);
      console.log('[Export] Zip destination path:', destinationPath);
      
      // Get the cache directory URI to construct full paths
      const cacheUri = await Filesystem.getUri({
        path: '',
        directory: Directory.Cache,
      });
      console.log('[Export] Cache directory URI:', cacheUri.uri);
      
      // Convert URI to file path for Android/iOS
      // The zip plugin needs actual file system paths
      const sourceFullPath = cacheUri.uri.replace('file://', '') + '/' + sourcePath;
      const destFullPath = cacheUri.uri.replace('file://', '') + '/' + destinationPath;
      
      console.log('[Export] Full source path:', sourceFullPath);
      console.log('[Export] Full destination path:', destFullPath);
      
      await CapacitorZip.zip({
        source: sourceFullPath,
        destination: destFullPath,
      });
      console.log('[Export] Zip created successfully');
      
      setProgress(0.9);
      
      // Get the zip file URI for sharing
      const zipUri = await Filesystem.getUri({
        path: zipFileName,
        directory: Directory.Cache,
      });
      console.log('[Export] Zip file URI:', zipUri.uri);
      
      setExportedFilePath(zipUri.uri);
      setProgress(1);
      
      // Clean up temp directory
      await Filesystem.rmdir({
        path: tempDir,
        directory: Directory.Cache,
        recursive: true,
      });
      console.log('[Export] Cleanup complete');
      
      presentToast({
        message: t('data.export.success', { count: articles.length }),
        duration: 4000,
        color: 'success',
      });
      console.log('[Export] Export completed successfully');
      
    } catch (error) {
      console.error('[Export] Export error:', error);
      console.error('[Export] Error details:', JSON.stringify(error, null, 2));
      presentAlert({
        header: t('data.export.error.header'),
        message: t('data.export.error.message'),
        cssClass: context.imode ? 'nodrop' : '',
        buttons: [
          {
            text: t('app.confirm.ok'),
            role: 'confirm',
          },
        ],
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareExport = async () => {
    if (!exportedFilePath) return;
    
    try {
      await Share.share({
        title: t('data.export.share.title'),
        text: t('data.export.share.text'),
        url: exportedFilePath,
        dialogTitle: t('data.export.share.dialog'),
      });
    } catch (error) {
      console.error('[Export] Share error:', error);
      presentToast({
        message: t('data.export.share.error'),
        duration: 3000,
        color: 'danger',
      });
    }
  };

  return (
    <>
      <IonButton
        color="dark"
        expand="full"
        onClick={exportData}
        disabled={isExporting}
      >
        {isExporting ? t('data.export.exporting') : t('data.export.button')}
      </IonButton>
      
      {isExporting && (
        <IonProgressBar value={progress} color="dark" />
      )}
      
      {exportedFilePath && !isExporting && (
        <IonButton
          color="dark"
          expand="full"
          onClick={shareExport}
        >
          <IonIcon slot="start" icon={shareSharp} />
          {t('data.export.share.button')}
        </IonButton>
      )}
    </>
  );
}
