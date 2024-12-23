"use client"


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
    <div className="flex flex-col flex-shrink-0 w-4/5 h-96 pl-4 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
      <div className="text-2xl font-bold text-center mt-4 mb-4">Filter Options</div>
      {filterOptions.map((filter) => (
        <div key={filter} className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e) => handleChange(e, filter)}
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">{filter}</div>
        </div>
      ))}
    </div>
  );
}
