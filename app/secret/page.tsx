'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SlidingPuzzle from '@/components/SlidingPuzzle';

// Dynamically import confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function SecretPage() {
  const router = useRouter();
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get image source with fallback
  const imageSrc = '/photos/secret.JPG';
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
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
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
          recycle={false}
          numberOfPieces={200}
          colors={['#f472b6', '#a78bfa', '#ffffff', '#fbbf24', '#ec4899', '#818cf8']}
        />
      )}

      <div className="w-full max-w-4xl mx-auto">
        {!solved ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-kapakana text-5xl text-gray-800 mb-2">You got it right!</h1>
              
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
            {/* Polaroid Card with Image */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={imageSrc}
                  alt="Secret surprise"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackSrc;
                  }}
                />
              </div>
              
              {/* Message */}
              <div className="text-center space-y-3">
                <p className="font-cormorant text-lg text-gray-800 leading-relaxed">
                  You found it, my favorite human.
                </p>
                <p className="font-cormorant text-lg text-gray-800 leading-relaxed">
                  Every piece of our story fits because of you.
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
