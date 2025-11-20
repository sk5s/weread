import { Filesystem, Directory } from '@capacitor/filesystem';

export interface ExportManifest {
  version: string;
  exportDate: string;
  appVersion: string;
  dataStructure: {
    preferences: string[];
    articlesCount: number;
  };
}

export const getExportFileName = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `weread-backup-${year}-${month}-${day}.zip`;
};

export const createManifest = async (
  articlesCount: number,
  appVersion: string
): Promise<ExportManifest> => {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    appVersion,
    dataStructure: {
      preferences: ['read', 'settings'],
      articlesCount,
    },
  };
};

export const validateImportData = (manifest: any): boolean => {
  if (!manifest || typeof manifest !== 'object') {
    return false;
  }
  
  if (!manifest.version || !manifest.exportDate || !manifest.dataStructure) {
    return false;
  }
  
  if (!Array.isArray(manifest.dataStructure.preferences)) {
    return false;
  }
  
  if (typeof manifest.dataStructure.articlesCount !== 'number') {
    return false;
  }
  
  return true;
};

export const parseManifest = async (manifestPath: string): Promise<ExportManifest | null> => {
  try {
    const contents = await Filesystem.readFile({
      path: manifestPath,
      directory: Directory.Cache,
      encoding: 'utf8' as any,
    });
    
    const manifest = JSON.parse(contents.data as string);
    
    if (!validateImportData(manifest)) {
      return null;
    }
    
    return manifest as ExportManifest;
  } catch (error) {
    console.error('Error parsing manifest:', error);
    return null;
  }
};
