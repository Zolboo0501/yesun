/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";

export function ImageWithFallback(props: any) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt = "", style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block  text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full text-white">
        Error loading image
      </div>
    </div>
  ) : (
    <Image
      src={src}
      alt={alt || "image"}
      width={1000}
      height={1000}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
