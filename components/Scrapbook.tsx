'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoCard as PhotoCardType } from '@/types';
import { saveToStorage, loadFromStorage, clearStorage, exportToJSON } from '@/utils/storage';
import PhotoCard from './PhotoCard';

const DEFAULT_PHOTOS: PhotoCardType[] = [
  {
    id: '1',
    src: '/photos/img-3.jpg',
    x: 100,
    y: 150,
    caption: 'You’re the one I never want to lose.',
    rotation: -12,
    scale: 1,
  },
  {
    id: '2',
    src: '/photos/img-2.jpg',
    x: 350,
    y: 50,
    caption: 'To get in, tell me what name do I call you by?',
    rotation: -1,
    scale: 1,
  },
  {
    id: '3',
    src: '/photos/img-7.jpg',
    x: 600,
    y: 150,
    caption: 'You make love easy.',
    rotation: 10,
    scale: 1,
  },
];

const zIndexMap: Record<string, number> = {
  '1': 5,
  '2': 10,
  '3': 7,
};

export default function Scrapbook() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoCardType[]>(DEFAULT_PHOTOS);
  const [photoCounter, setPhotoCounter] = useState(3);
  const [nameInput, setNameInput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.length > 0) {
      setPhotos(saved);
      const maxId = Math.max(...saved.map(p => parseInt(p.id) || 0));
      setPhotoCounter(maxId + 1);
    }
  }, []);

  // Auto-save to localStorage whenever photos change
  useEffect(() => {
    if (photos.length > 0) {
      saveToStorage(photos);
    }
  }, [photos]);

  const handleUpdate = useCallback((id: string, updates: Partial<PhotoCardType>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggedCardId(id);
  }, []);

  const handleDragStop = useCallback(() => {
    setDraggedCardId(null);
  }, []);

  const handleGateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = nameInput.trim().toLowerCase();
    if (normalized === 'dhun') {
      setErrorText('');
      router.push('/secret');
    } else {
      setErrorText("Hint: It starts with 'D'.");
    }
  };

  const gateFooter = useMemo(() => (
    <form onSubmit={handleGateSubmit} className="space-y-2">
      <p className="text-center text-sm text-gray-800 font-cormorant">
        To get in, tell me what name do I call you by?
      </p>
      <div className="flex items-center justify-center gap-2">
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter name"
          className="w-32 rounded-sm border border-rose-200 bg-rose-100/80 px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button
          type="submit"
          className="px-3 py-1 text-xs uppercase tracking-wide rounded-sm bg-rose-300 text-gray-800 shadow-sm hover:bg-rose-400 transition-colors"
        >
          Enter
        </button>
      </div>
      {errorText && (
        <p className="text-center text-xs text-rose-600">{errorText}</p>
      )}
    </form>
  ), [errorText, nameInput]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="text-center mt-6 mb-4 md:mb-8">
        <div className="text-lg md:text-xl uppercase tracking-[0.3em] font-cormorant text-gray-800">Happy</div>
        <div className="font-kapakana text-5xl md:text-6xl text-gray-800 leading-tight -mt-2" style={{ fontFamily: 'var(--font-kapakana), Brush Script MT, cursive', fontWeight: 400 }}>Birthday</div>
        <div className="font-cormorant text-xl md:text-2xl text-gray-800 mt-1">babe &lt;3</div>
      </div>

      {/* Desktop Canvas - Draggable Layout */}
      <div
        className="hidden md:block relative w-full max-w-5xl mx-auto rounded-2xl canvas-grid"
        style={{ minHeight: '740px', height: '740px' }}
      >
        {photos.map(photo => {
          // Calculate z-index: dragged card gets highest, others use their base z-index
          const baseZIndex = zIndexMap[photo.id] ?? 1;
          const finalZIndex = draggedCardId === photo.id ? 1000 : baseZIndex;
          
          return (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              zIndex={finalZIndex}
              className="w-72 md:w-80"
              footerContent={photo.id === '2' ? gateFooter : undefined}
            />
          );
        })}
      </div>

      {/* Mobile Stacking Layout */}
      <div className="md:hidden pb-8">
        {(() => {
          // Reorder photos for mobile: put card with id '2' first
          const gateCard = photos.find(p => p.id === '2');
          const otherCards = photos.filter(p => p.id !== '2');
          const reorderedPhotos = gateCard ? [gateCard, ...otherCards] : photos;
          
          return reorderedPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="sticky mb-6"
              style={{
                top: `${Math.max(20, 40 - index * 5)}px`,
                zIndex: reorderedPhotos.length - index,
              }}
            >
              <PhotoCard
                photo={photo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                zIndex={reorderedPhotos.length - index}
                className="w-full max-w-sm mx-auto"
                footerContent={photo.id === '2' ? gateFooter : undefined}
              />
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

