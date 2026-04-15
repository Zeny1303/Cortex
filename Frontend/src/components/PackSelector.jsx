import React from "react";

const PackSelector = ({ packs, selectedPack, setSelectedPack, isDarkMode }) => {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {packs.map((pack) => {
        const isSelected = selectedPack.title === pack.title;

        return (
          <div
            key={pack.title}
            onClick={() => setSelectedPack(pack)}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300
              ${isSelected
                ? "border-indigo-500 shadow-lg scale-105"
                : "border-gray-200 hover:shadow-md"}
              ${isDarkMode ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-white"}
            `}
          >
            {/* Title */}
            <h3 className="font-semibold text-lg">{pack.title}</h3>

            {/* Price */}
            <p className="text-3xl font-bold mt-2">₹{pack.price}</p>

            {/* Features */}
            <ul className="mt-4 text-sm space-y-2 text-gray-500">
              <li>✔ {pack.questions} coding questions</li>
              <li>✔ Detailed AI feedback</li>
            </ul>

            {/* Button */}
            <button
              className={`mt-5 w-full py-2 rounded-lg text-sm font-medium
                ${isSelected
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"}
              `}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PackSelector;