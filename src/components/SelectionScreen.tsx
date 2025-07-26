import React, { useState } from 'react';

interface SelectionScreenProps {
  onSelect: (level: 'new-to-ads' | 'ad-expert') => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<'new-to-ads' | 'ad-expert' | null>(null);

  const handleSelection = (level: 'new-to-ads' | 'ad-expert') => {
    setSelected(level);
  };

  const handleSubmit = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col justify-between items-center"
      style={{ backgroundImage: "url('/s2.png')" }}
    >
      {/* Main content block (heading + options) */}
      <div className="flex-grow flex flex-col justify-center items-center w-full max-w-2xl px-4 space-y-8">
        <h1 className="text-[80px] font-bold text-[#00B5DB] text-center">
          Are you
        </h1>

        <button
          onClick={() => handleSelection('new-to-ads')}
          className={`w-full py-4 px-6 rounded-lg text-[60px] font-bold transition-colors duration-200 
            ${
              selected === 'new-to-ads'
                ? 'bg-[#4216EF] text-white'
                : 'border border-blue-500 text-[#00B5DB] hover:bg-green-700 text-black'
            }`}
        >
          New to Ads
        </button>

        <button
          onClick={() => handleSelection('ad-expert')}
          className={`w-full py-4 px-6 rounded-lg text-[60px] font-bold transition-colors duration-200 
            ${
              selected === 'ad-expert'
                ? 'bg-[#4216EF] text-white'
                : 'border border-blue-500 text-[#00B5DB] hover:bg-purple-700 text-black'
            }`}
        >
          Ad-Expert
        </button>
      </div>

      {/* Submit Button fixed at bottom */}
      {selected && (
        <div className="pb-12">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-[551px] h-[128px] text-[60px] font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] shadow-md transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
