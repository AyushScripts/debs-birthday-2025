'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Draggable from 'react-draggable';
import { PhotoCard as PhotoCardType } from '@/types';

interface PhotoCardProps {
  photo: PhotoCardType;
  onUpdate: (id: string, updates: Partial<PhotoCardType>) => void;
  onDelete?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragStop?: () => void;
  zIndex?: number;
  footerContent?: ReactNode;
  className?: string;
}

export default function PhotoCard({ photo, onUpdate, onDelete, onDragStart, onDragStop, zIndex, footerContent, className }: PhotoCardProps) {
  const [caption, setCaption] = useState(photo.caption);
  const [isMobile, setIsMobile] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setCaption(photo.caption);
  }, [photo.caption]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onUpdate(photo.id, { caption: newCaption });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const rotationStep = 15;
    const newRotation = direction === 'left' 
      ? photo.rotation - rotationStep 
      : photo.rotation + rotationStep;
    onUpdate(photo.id, { rotation: newRotation });
  };

  const handleScale = (direction: 'in' | 'out') => {
    const scaleStep = 0.1;
    const newScale = direction === 'in' 
      ? Math.min(photo.scale + scaleStep, 2) 
      : Math.max(photo.scale - scaleStep, 0.5);
    onUpdate(photo.id, { scale: newScale });
  };

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    onUpdate(photo.id, { x: data.x, y: data.y });
  };

  const handleDragStart = () => {
    onDragStart?.(photo.id);
  };

  const handleDragStop = () => {
    onDragStop?.();
  };

  const cardInner = (
    <div 
      className="bg-white polaroid-shadow rounded-sm p-2 w-full md:w-[19rem] lg:w-[21rem] mx-auto"
      style={{
        transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Photo */}
      <div className={`drag-handle bg-gray-100 aspect-square rounded-sm overflow-hidden mb-3 ${!isMobile ? 'cursor-move' : ''}`}>
        <img
          src={photo.src}
          alt={photo.caption}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Caption / Custom Footer */}
      <div className="px-2 pb-3">
        {footerContent ? (
          footerContent
        ) : (
          <input
            type="text"
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Add a caption..."
            className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:outline-none font-cormorant"
          />
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        ref={nodeRef}
        className={className ?? ''}
        style={{ zIndex }}
      >
        {cardInner}
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: photo.x, y: photo.y }}
      onDrag={handleDrag}
      onStart={handleDragStart}
      onStop={handleDragStop}
      handle=".drag-handle"
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move ${className ?? ''}`}
        style={{ zIndex }}
      >
        {cardInner}
      </div>
    </Draggable>
  );
}

