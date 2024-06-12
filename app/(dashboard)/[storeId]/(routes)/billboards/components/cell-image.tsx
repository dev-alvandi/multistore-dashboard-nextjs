"use client";

import Image from "next/image";

interface CellImageProps {
  imageUrl: string;
  label: string;
}

const CellImage = ({ imageUrl, label }: CellImageProps) => {
  return (
    <div className="overflow-hidden min-w-32 w-32 min-h-32 h-32 relative rounded-md shadow-md ">
      <Image src={imageUrl} alt={label} fill className="object-contain" />
    </div>
  );
};

export default CellImage;
