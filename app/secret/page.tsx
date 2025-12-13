'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import ImageSlideshow from '@/components/ImageSlideshow';

// Dynamically import confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

// ============================================
// CONFIGURE YOUR SLIDESHOW IMAGES HERE
// ============================================
// Add or remove image paths to customize the slideshow
// Images should be in the /public/photos/ directory
const SLIDESHOW_IMAGES = [
  '/photos/secret.JPG',
  '/photos/img-8.jpg',
  '/photos/img-9.jpg',
  '/photos/img-4.jpg',
  '/photos/img-5.jpg',
  '/photos/img-6.jpg',
  '/photos/img-10.jpg',
  // Add more images here as needed
  // Example: '/photos/IMG_2806.jpg',
];

export default function SecretPage() {
  const router = useRouter();
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get image source for puzzle (first slideshow image or fallback)
  const imageSrc = SLIDESHOW_IMAGES[0] || '/photos/secret.JPG';
  const fallbackSrc = '/photos/photo1.jpg';

  // Handle window resize for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSolve = () => {
    setSolved(true);
    setShowConfetti(true);
    // Confetti will keep repeating forever! 🎉
  };

  const handleOpenScrapbook = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-indigo-50 py-8 px-4">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={300}
          colors={['#f472b6', '#a78bfa', '#ffffff', '#fbbf24', '#ec4899', '#818cf8']}
          gravity={0.1}
          initialVelocityY={20}
          initialVelocityX={10}
        />
      )}

      <div className="w-full max-w-4xl mx-auto">
        {!solved ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-kapakana text-4xl md:text-5xl text-gray-800 mb-2" style={{ fontFamily: 'var(--font-kapakana), Brush Script MT, cursive' }}>You got it right!</h1>

              <p className="font-cormorant text-base text-gray-600 max-w-md mx-auto">
                Now, please try to solve the puzzle. I've something for you.
              </p>
            </div>

            {/* Puzzle */}
            <SlidingPuzzle imageSrc={imageSrc} onSolve={handleSolve} />
          </>
        ) : (
          /* Solved State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
            {/* Polaroid Card with Slideshow */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
              <div className="mb-4">
                <ImageSlideshow 
                  images={SLIDESHOW_IMAGES.length > 0 ? SLIDESHOW_IMAGES : [imageSrc, fallbackSrc]}
                  interval={3000}
                  fadeDuration={1000}
                />
              </div>

              {/* Message */}
              <div className="text-center space-y-3">
                <p className="font-cormorant text-lg text-gray-800 leading-relaxed">
                  You found it, my favorite human.
                </p>
                <p className="font-cormorant text-lg text-gray-800 leading-relaxed">
                  Every piece of our story fits because of you. Every future moment feels like home when I imagine it with you &lt;3
                </p>
                <p className="font-cormorant text-xl text-gray-800 font-semibold mt-4">
                  Happy Birthday Dhun!
                </p>
                <p className="font-cormorant text-lg text-gray-700">
                  — love, Ayush
                </p>
              </div>
            </div>


          </div>
        )}
      </div>
    </main>
  );
}
