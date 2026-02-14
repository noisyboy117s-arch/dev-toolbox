"use client";

import { useEffect } from "react";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  responsive?: string;
  type?: "leaderboard" | "rectangle" | "responsive";
}

export default function AdSense({ slot, format = "auto", responsive = "true", type = "responsive" }: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const getDimensions = () => {
    switch (type) {
      case "leaderboard":
        return "w-[728px] h-[90px]";
      case "rectangle":
        return "w-[300px] h-[250px]";
      default:
        return "w-full min-h-[100px]";
    }
  };

  return (
    <div className={`mx-auto my-[150px] overflow-hidden flex flex-col items-center gap-2`}>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Advertisement</span>
      <div className={`${getDimensions()} bg-gray-100 border border-gray-200 flex items-center justify-center relative`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7306192465226218"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        ></ins>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-gray-300 text-xs italic">Ad Unit: {type}</span>
        </div>
      </div>
    </div>
  );
}
