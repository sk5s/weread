import { IonButton, IonProgressBar, useIonAlert, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { CapacitorZip } from '@capgo/capacitor-zip';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import key from '../../lib/storage.json';
import { SettingsContext } from '../../SettingsContext';
import { parseManifest } from '../../lib/exportImportUtils';
import { trigger } from '../../lib/Event';

import './ImportData.css';

export default function ImportData() {
  const { t } = useTranslation();
  const context = useContext(SettingsContext);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const importData = async () => {
    try {
      console.log('[Import] Starting import process');
      // Pick zip file
      const result = await FilePicker.pickFiles({
        types: ['application/zip'],
      });

      if (!result.files || result.files.length === 0) {
        console.log('[Import] No file selected');
        return;
      }

      setIsImporting(true);
      setProgress(0.1);

      const file = result.files[0];
      console.log('[Import] File object:', JSON.stringify({
        name: file.name,
        path: file.path,
        mimeType: file.mimeType,
        size: file.size,
        hasData: !!file.data,
      }));
      
      setProgress(0.2);

      // Create temp extraction directory
      const extractDir = 'weread-import-temp';
      try {
        await Filesystem.rmdir({
          path: extractDir,
          directory: Directory.Cache,
          recursive: true,
        });
      } catch (e) {
        // Directory doesn't exist, that's fine
      }

      await Filesystem.mkdir({
        path: extractDir,
        directory: Directory.Cache,
      });
      console.log('[Import] Created extraction directory');

      setProgress(0.3);

      // Get file paths for unzipping
      const destExtractUri = await Filesystem.getUri({
        path: extractDir,
        directory: Directory.Cache,
      });

      const zipCopyUri = await Filesystem.getUri({
        path: 'weread-import.zip',
        directory: Directory.Cache,
      });

      // Copy file to cache
      try {
        await FilePicker.copyFile({
        from: file.path!,
        to: zipCopyUri.uri,
      });
        console.log('[Import] File copied to cache');
      } catch (error) {
        console.error('[Import] Error copying file:', error);
        throw error;
      }

      // Convert URIs to file paths (remove file://)
      const sourceZipPath = zipCopyUri.uri.replace('file://', '');
      const destExtractPath = destExtractUri.uri.replace('file://', '');

      console.log('[Import] Source zip path:', sourceZipPath);
      console.log('[Import] Destination extract path:', destExtractPath);

      // Unzip the file
      await CapacitorZip.unzip({
        source: sourceZipPath,
        destination: destExtractPath,
      });
      console.log('[Import] Unzipped successfully');

      setProgress(0.4);

      const baseDataPath = `${extractDir}/weread-export-temp`;

      // Validate manifest
      const manifest = await parseManifest(`${baseDataPath}/manifest.json`);
      if (!manifest) {
        throw new Error('Invalid backup file');
      }

      setProgress(0.5);

      // Read preferences data to get article count
      const preferencesContent = await Filesystem.readFile({
        path: `${baseDataPath}/preferences.json`,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      const importedPreferences = JSON.parse(preferencesContent.data as string);
      const importedArticlesCount = importedPreferences.read?.length || 0;

      // Show confirmation alert with metadata
      const confirmed = await new Promise<boolean>((resolve) => {
        const messageLines = [
          t('data.import.confirm.message'),
          '',
          `${t('data.import.confirm.count')}: ${importedArticlesCount}`,
          `${t('data.import.confirm.date')}: ${new Date(manifest.exportDate).toLocaleString()}`,
          `${t('data.import.confirm.version')}: ${manifest.appVersion}`,
        ];
        
        presentAlert({
          header: t('data.import.confirm.header'),
          message: messageLines.join('\n'),
          cssClass: context.imode ? 'nodrop import-data-pre-wrap' : 'import-data-pre-wrap',
          buttons: [
            {
              text: t('app.confirm.cancel'),
              role: 'cancel',
              handler: () => resolve(false),
            },
            {
              text: t('data.import.confirm.proceed'),
              role: 'confirm',
              handler: () => resolve(true),
            },
          ],
        });
      });

      if (!confirmed) {
        console.log('[Import] User cancelled import');
        setIsImporting(false);
        setProgress(0);
        
        // Clean up extraction directory
        await Filesystem.rmdir({
          path: extractDir,
          directory: Directory.Cache,
          recursive: true,
        });
        
        return;
      }

      setProgress(0.6);

      // Preserve current settings
      const currentSettingsData = await Preferences.get({ key: key.settings });
      const currentSettings = currentSettingsData.value 
        ? JSON.parse(currentSettingsData.value) 
        : {};

      // Settings to preserve
      const preservedSettings = {
        devMode: currentSettings.devMode,
        imode: currentSettings.imode,
        lang: currentSettings.lang,
      };

      // Merge imported settings with preserved ones
      const mergedSettings = {
        ...importedPreferences.settings,
        ...preservedSettings,
      };

      setProgress(0.6);

      // Delete all existing articles
      const existingReadData = await Preferences.get({ key: key.read });
      if (existingReadData.value) {
        const existingArticles = JSON.parse(existingReadData.value);
        for (const article of existingArticles) {
          try {
            await Filesystem.rmdir({
              path: article.id,
              directory: Directory.Data,
              recursive: true,
            });
          } catch (error) {
            console.error(`Error deleting article ${article.id}:`, error);
          }
        }
      }

      setProgress(0.7);

      // Import articles
      const importedArticles = importedPreferences.read || [];
      let importedCount = 0;

      for (const article of importedArticles) {
        try {
          const articleContent = await Filesystem.readFile({
            path: `${baseDataPath}/articles/${article.id}/content.txt`,
            directory: Directory.Cache,
            encoding: Encoding.UTF8,
          });

          await Filesystem.mkdir({
            path: article.id,
            directory: Directory.Data,
          });

          await Filesystem.writeFile({
            path: `${article.id}/content.txt`,
            data: articleContent.data,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
          });

          importedCount++;
          setProgress(0.7 + (importedCount / importedArticles.length) * 0.2);
        } catch (error) {
          console.error(`Error importing article ${article.id}:`, error);
        }
      }

      setProgress(0.9);

      // Save imported preferences
      await Preferences.set({
        key: key.read,
        value: JSON.stringify(importedArticles),
      });

      await Preferences.set({
        key: key.settings,
        value: JSON.stringify(mergedSettings),
      });

      setProgress(1);

      // Clean up extraction directory
      await Filesystem.rmdir({
        path: extractDir,
        directory: Directory.Cache,
        recursive: true,
      });

      // Trigger UI refresh
      trigger('weread:listChange');
      trigger('weread:settingsChange');

      presentToast({
        message: t('data.import.success', { count: importedCount }),
        duration: 4000,
        color: 'success',
      });

    } catch (error) {
      console.error('Import error:', error);
      presentAlert({
        header: t('data.import.error.header'),
        message: t('data.import.error.message'),
        cssClass: context.imode ? 'nodrop' : '',
        buttons: [
          {
            text: t('app.confirm.ok'),
            role: 'confirm',
          },
        ],
      });
    } finally {
      setIsImporting(false);
      setProgress(0);
    }
  };

  return (
    <>
      <IonButton
        color="dark"
        expand="full"
        onClick={importData}
        disabled={isImporting}
      >
        {isImporting ? t('data.import.importing') : t('data.import.button')}
      </IonButton>
      
      {isImporting && (
        <IonProgressBar value={progress} color="dark" />
      )}
    </>
  );
}
