import React, { useState } from "react";

interface TabProps {
  tabOptions: Option[];
  selectedTab: string,
  setSelected(label: string): void
}

interface Option {
  label: string;
}
export const Tab: React.FC<TabProps> = ({ selectedTab,tabOptions,setSelected }) => {

  return (
    <div className=" border border-solid border-l-0 border-r-0 border-t-0 border-gray-300 flex flex-row justify-evenly">
      {tabOptions.map((option) => (
        <span
        key={option.label}
          className={`cursor-pointer font-bold sm:py-3 py-1  sm:px-6 px-2 main-text ${
            selectedTab === option.label
              ? "border-2 border-solid border-blue-400  text-blue-400 border-t-0 border-l-0 border-r-0"
              : ""
          }`}
          onClick={() => {setSelected(option.label)}}
        >
          {option.label}
        </span>
      ))}
    </div>
  );
};
