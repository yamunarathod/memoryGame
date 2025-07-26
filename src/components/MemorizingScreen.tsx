"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface MemorizingScreenProps {
  content: string[];
  onComplete: () => void;
}

export const MemorizingScreen: React.FC<MemorizingScreenProps> = ({
  content,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const renderCards = () => {
    const cards = [];

    for (let i = 0; i < content.length; i += 2) {
      if (i + 1 < content.length) {
        cards.push(
          <div
            key={`row-${i}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full"
          >
            <div className="bg-white rounded-3xl border-2 border-[#4A5FCC] p-6 shadow-lg">
              <p className="text-[#4A5FCC] text-center text-2xl font-semibold leading-relaxed">
                {content[i]}
              </p>
            </div>
            <div className="bg-white rounded-3xl border-2 border-[#4A5FCC] p-6 shadow-lg">
              <p className="text-[#4A5FCC] text-center text-2xl font-semibold leading-relaxed">
                {content[i + 1]}
              </p>
            </div>
          </div>
        );
      } else {
        cards.push(
          <div
            key={`single-${i}`}
            className="flex justify-center w-full"
          >
            <div className="bg-white rounded-3xl border-2 border-[#4A5FCC] p-6 shadow-lg max-w-md">
              <p className="text-[#4A5FCC] text-center text-2xl font-semibold leading-relaxed">
                {content[i]}
              </p>
            </div>
          </div>
        );
      }

      cards.push(<div key={`spacer-${i}`} className="h-8" />);
    }

    return cards;
  };

  return (
    <div
  className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-start pt-[420px] pb-[200px] px-4"
  style={{ backgroundImage: "url('/s2.png')" }}
>

      {/* Card Section */}
      <div className="w-full max-w-6xl px-4 space-y mt-60">{renderCards()}</div>

      {/* Memorized Button */}
      <div className="mt-16">
        <button
          onClick={onComplete}
          className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BF7] hover:to-[#7C3AED] text-white text-3xl font-bold px-16 py-6 rounded-full shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Memorized
        </button>
      </div>

      {/* Timer at bottom */}
      <div
        className="fixed bottom-10 left-0 w-full px-10 z-10 flex items-center justify-center gap-4 text-[60px] font-bold text-white"
        style={{
          background:
            "linear-gradient(to right, #30c5e5 0%, rgba(48,197,229,0.05) 45%, rgba(6,50,185,0.05) 55%, #0632b9 100%)",
        }}
      >
        <img src="/timer.png" alt="Timer" className="w-[110px] h-[110px]" />
        <span>{timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}</span>
      </div>
    </div>
  );
};
