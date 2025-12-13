'use client';

import { useState, useEffect } from 'react';

interface ImageSlideshowProps {
  images: string[];
  interval?: number; // Time in milliseconds between slides (default: 3000)
  fadeDuration?: number; // Fade transition duration in milliseconds (default: 1000)
}

export default function ImageSlideshow({ 
  images, 
  interval = 3000,
  fadeDuration = 1000 
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % images.length;
        setNextIndex((newIndex + 1) % images.length);
        return newIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 font-cormorant">No images</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img
          src={images[0]}
          alt="Slide 1"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/photos/photo1.jpg';
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden">
      {images.map((image, index) => {
        const isActive = index === currentIndex;
        const isNext = index === nextIndex;
        
        return (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: isActive ? 1 : 0,
              transition: `opacity ${fadeDuration}ms ease-in-out`,
              zIndex: isActive ? 2 : isNext ? 1 : 0,
            }}
            onError={(e) => {
              // Fallback to next image if current fails to load
              const target = e.target as HTMLImageElement;
              const nextImageIndex = (index + 1) % images.length;
              if (nextImageIndex !== index && images[nextImageIndex]) {
                target.src = images[nextImageIndex];
              } else {
                target.src = '/photos/photo1.jpg';
              }
            }}
          />
        );
      })}
    </div>
  );
}

