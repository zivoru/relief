"use client";

import { useEffect, useState } from "react";

const loaded = new Set<string>();

export function tastePhotoSrc(id: string) {
  return `/quiz/tastes/${id}.jpg`;
}

export function preloadTastePhoto(id: string) {
  const src = tastePhotoSrc(id);
  if (loaded.has(src)) return;
  const img = new Image();
  img.onload = () => loaded.add(src);
  img.src = src;
}

export function TasteCard({
  id,
  name,
  kcal,
  tag,
}: {
  id: string;
  name: string;
  kcal: number;
  tag: string;
}) {
  const src = tastePhotoSrc(id);
  const [ok, setOk] = useState(() => loaded.has(src));

  useEffect(() => {
    let alive = true;
    const img = new Image();
    const done = () => {
      loaded.add(src);
      if (alive) setOk(true);
    };
    const fail = () => {
      if (alive) setOk(false);
    };
    img.onload = done;
    img.onerror = fail;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) done();
    else if (img.complete) fail();
    return () => {
      alive = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className="relative h-72 w-full overflow-hidden bg-[#FEF6ED]">
        {ok ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-orange-100 to-orange-200" />
        )}
        <div
          className={`absolute inset-x-0 bottom-0 p-5 ${
            ok ? "bg-linear-to-t from-black/60 to-transparent pt-16" : ""
          }`}
        >
          <p className={`text-xl font-extrabold ${ok ? "text-white" : ""}`}>
            {name}
          </p>
          <p className={`text-sm ${ok ? "text-white/80" : "text-stone-600"}`}>
            {kcal} ккал · {tag}
          </p>
        </div>
      </div>
    </div>
  );
}
