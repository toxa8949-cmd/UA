"use client";

import { useState } from "react";

/**
 * Універсальний завантажувач банера для адмін-форм (країни/міста).
 * Працює всередині <form action={...}>: кладе File у name="cover_file"
 * і зберігає поточний URL у прихованому name="cover_image".
 */
export function BannerUploader({
  defaultUrl,
  label = "Банер (співвідношення ~2:1)",
  aspect = "aspect-[2/1]",
}: {
  defaultUrl: string | null;
  label?: string;
  aspect?: string;
}) {
  const [preview, setPreview] = useState<string | null>(defaultUrl ?? null);
  const showImg = !!preview && /^(https?:|blob:)/.test(preview);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <div className={`relative ${aspect} overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50`}>
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview!} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Немає банера
          </div>
        )}
      </div>
      <input type="hidden" name="cover_image" value={defaultUrl ?? ""} />
      <input
        type="file"
        name="cover_file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : preview);
        }}
        className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700 hover:file:bg-slate-200"
      />
    </div>
  );
}
