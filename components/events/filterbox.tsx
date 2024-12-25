"use client";

import { useState } from "react";

export default function FilterBox({ onFilterChange }: { onFilterChange: (filters: string[]) => void }) {
  const filterOptions = ["Tech", "Coding", "Robotics", "Music", "Dance", "Art", "Comedy"];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, filter: string) => {
    const isChecked = e.target.checked;
    let updatedFilters = [...selectedFilters];
    if (isChecked) {
      updatedFilters.push(filter);
    } else {
      updatedFilters = updatedFilters.filter((item) => item !== filter);
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="flex flex-col flex-shrink-0 w-half max-w-xs p-6 border-2 rounded-xl border-[#45A29E] shadow-md shadow-[#66FCF1]/50 bg-gradient-to-r from-[#1F2833] via-[#0B0C10] to-[#45A29E] hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="text-xl font-bold text-center mb-6 text-[#C5C6C7]">Filter Options</div>
      <div className="flex flex-col gap-4">
        {filterOptions.map((filter) => (
          <div key={filter} className="text-lg font-bold flex flex-row items-center w-full text-[#C5C6C7]">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="hidden peer"
                onChange={(e) => handleChange(e, filter)}
              />
              <div className="w-6 h-6 rounded-md border-2 border-[#C5C6C7] peer-checked:bg-[#66FCF1] peer-checked:border-[#45A29E]"></div>
            </label>
            <div className="ml-3">{filter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
