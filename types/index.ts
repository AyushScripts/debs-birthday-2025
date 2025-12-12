export interface PhotoCard {
  id: string;
  src: string;
  x: number;
  y: number;
  caption: string;
  rotation: number;
  scale: number;
}

export interface ScrapbookData {
  photos: PhotoCard[];
  version: string;
}

