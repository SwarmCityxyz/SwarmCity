"use client";

/** Saves an object as a pretty-printed JSON file in the visitor's browser. */
export function saveJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadJson({ name, data, children }: { name: string; data: unknown; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => saveJson(name, data)} className="text-left text-[17px] font-medium uppercase text-bone transition-colors hover:text-lime">
      {children}
    </button>
  );
}
