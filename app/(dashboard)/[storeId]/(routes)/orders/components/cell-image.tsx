"use client";

import Image from "next/image";
import { Fragment } from "react";

interface CellImageProps {
  data: string[];
}

const CellImage = ({ data }: CellImageProps) => {
  return (
    <Fragment>
      {data.map((url, i) => (
        <div
          key={i}
          className="overflow-hidden min-w-16 w-16 min-h-16 h-16 aspect-square relative rounded-md shadow-md flex items-center justify-center"
        >
          <Image
            src={url}
            alt={"Order Image"}
            fill
            className="object-contain"
          />
        </div>
      ))}
    </Fragment>
  );
};

export default CellImage;
