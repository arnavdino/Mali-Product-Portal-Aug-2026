import React from "react";

interface TickProps {
    width?: string,
    success?: string
}
export const Tick: React.FC<TickProps> = ({width = "100px",success = "Bummer"}) =>{
  return (
    <div >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 130.2 130.2"
        style={{width:width}}
        className="inline"
        id="svg_cross"
      >
        <circle
          className="path circle"
          fill="none"
          stroke="#50c878"
          strokeWidth="6"
          strokeMiterlimit="10"
          cx="65.1"
          cy="65.1"
          r="62.1"
        />
        <line
          className="path line"
          fill="none"
          stroke="#50c878"
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          x1="14.4"
          y1="57.9"
          x2="34.4"
          y2="99.2"
        />
        <line
          className="path line"
          fill="none"
          stroke="#50c878"
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          x1="108.8"
          y1="46"
          x2="34.4"
          y2="99.2"
        />
      </svg>
      <p className="green text-2xl mt-2 font-bold"><span>{success}</span></p>
    </div>
  );
}