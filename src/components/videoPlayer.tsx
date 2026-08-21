import React, { useRef, useEffect } from "react";

export const VideoPlayer: React.FC<{ src: string,className?:string }> = ({ src,className }) => {
  return (
    <div className={className}>
      <video controls width="100%" id="video-player">
        <source src={src} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};
