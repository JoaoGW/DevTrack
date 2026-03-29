"use client";

export function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/6 pb-4">
      <div className="flex size-9 items-center justify-center rounded-xl bg-white/4">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  );
}
