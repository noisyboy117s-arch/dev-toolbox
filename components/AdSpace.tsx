"use client";
import React from 'react';

interface AdSpaceProps {
  position: 'top' | 'bottom' | 'sidebar' | 'in-feed';
}

const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const styles = {
    top: "w-full h-24 bg-gray-50 border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs mb-8",
    bottom: "w-full h-32 bg-gray-50 border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs mt-12",
    sidebar: "w-full h-64 bg-gray-50 border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs",
    "in-feed": "w-full h-48 bg-gray-50 border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs my-8"
  };

  return (
    <div className={styles[position]}>
      <span>Ad Placement ({position.toUpperCase()})</span>
    </div>
  );
};

export default AdSpace;
