import { ScrapbookData, PhotoCard } from '@/types';

const STORAGE_KEY = 'scrapbook.photos.v1';

export const saveToStorage = (photos: PhotoCard[]): void => {
  if (typeof window === 'undefined') return;
  
  const data: ScrapbookData = {
    photos,
    version: '1.0',
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): PhotoCard[] | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data: ScrapbookData = JSON.parse(stored);
    return data.photos || null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const exportToJSON = (photos: PhotoCard[]): void => {
  const data: ScrapbookData = {
    photos,
    version: '1.0',
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'scrapbook-data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

