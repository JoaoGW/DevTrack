import { GitBranch } from "lucide-react";

export function LoadingGeneralContent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080810]">
      {/* Glow blob */}
      <div
        className="pointer-events-none absolute size-80 rounded-full blur-3xl"
        style={{ background: "rgba(37,99,235,0.07)" }}
      />

      <div className="relative flex flex-col items-center gap-7">
        {/* Logo com anel giratório */}
        <div className="relative flex size-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-600" />
          <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10">
            <GitBranch className="size-7 text-blue-400" />
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-lg font-bold tracking-tight text-white">
            DevTrack
          </p>
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-1.5 animate-bounce rounded-full bg-blue-600"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
