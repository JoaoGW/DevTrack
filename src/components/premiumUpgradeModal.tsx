"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Crown, X, ArrowRight, Lock } from "lucide-react";

type PremiumUpgradeModalProps = {
  featureName: string;
  onClose: () => void;
};

export function PremiumUpgradeModal({
  featureName,
  onClose,
}: PremiumUpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push("/premium/gopremium");
  };

  return (
    /* ── BACKDROP ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── MODAL ── */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e1a] shadow-2xl shadow-black/60">
        {/* Glow interno */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative px-8 pb-8 pt-8">
          {/* Ícone */}
          <div className="mb-5 flex justify-center">
            <div className="relative flex size-16 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-500/20">
              <Lock className="size-7 text-blue-400" />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-600 ring-2 ring-[#0e0e1a]">
                <Crown className="size-3 text-white" />
              </span>
            </div>
          </div>

          {/* Texts */}
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-xs font-medium text-blue-300">
              Recurso Premium
            </div>

            <h2 className="text-xl font-extrabold text-white">
              {featureName} é uma feature exclusiva!
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Faça o upgrade para desbloquear{" "}
              <span className="font-medium text-zinc-300">{featureName}</span> e
              todas as outras ferramentas premium do DevTrack.
            </p>
          </div>

          {/* Benefícios rápidos */}
          <ul className="mb-7 space-y-2.5 rounded-xl border border-white/5 bg-white/2 px-5 py-4">
            {[
              "+ Análises completas de projeto no GitHub",
              "+ Adaptações de currículo para vagas",
              "Cover Letters profissionais e customizadas",
              "Simulação de Entrevistas (Soft e Hard Skills)",
              "E muitos outros benefícios exclusivos!",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                  <span className="size-1.5 rounded-full bg-blue-400" />
                </span>
                <span className="text-zinc-400">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <Button
              size="lg"
              onClick={handleUpgrade}
              className="h-11 w-full gap-2 bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500 cursor-pointer transition-all duration-200"
            >
              <Crown className="size-4" />
              Ver planos e fazer upgrade
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="h-10 w-full text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 cursor-pointer"
            >
              Continuar no plano gratuito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
