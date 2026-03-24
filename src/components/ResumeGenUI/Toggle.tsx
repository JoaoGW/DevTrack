"use client";

export function Toggle({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 ${
          checked
            ? "border-blue-500/40 bg-blue-600"
            : "border-white/10 bg-white/8"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-3.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
      <span className="text-sm text-zinc-400">{label}</span>
    </div>
  );
}
