"use client";

import Image from "next/image";
import { useState } from "react";

import { LayoutTemplate, CheckCircle2, X, CircleStar } from "lucide-react";
import type { TemplateType } from "@/components/ProfileTemplates/types";

import { TEMPLATES } from "@/app/contentData/modals/selectProfileTemplate";

type SelectProfileTemplateModalProps = {
  onClose: () => void;
  onSelect: (template: TemplateType) => void;
};

export function SelectProfileTemplateModal({
  onClose,
  onSelect,
}: SelectProfileTemplateModalProps) {
  const [selected, setSelected] = useState<TemplateType | null>(null);
  const [hovered, setHovered] = useState<TemplateType | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        style={{ animation: "overlayIn 0.25s ease both" }}
        onClick={onClose}
      />

      {/* ── MODAL ── */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e1a] shadow-2xl shadow-black/60"
        style={{
          animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Glow interno */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-h-[88vh] overflow-y-auto px-6 pb-5 pt-5">
          {/* Fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 cursor-pointer flex size-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-zinc-400 transition-all hover:bg-white/8 hover:text-white"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-500/20">
              <LayoutTemplate className="size-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Escolha seu Template
            </h2>
            <p className="mt-1 max-w-sm text-xs text-zinc-400">
              Selecione o modelo que melhor representa seu estilo profissional
            </p>
          </div>

          {/* Templates Grid */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t.id)}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative flex flex-col cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                  selected === t.id
                    ? `${t.borderAccent} bg-gradient-to-b ${t.accent} to-transparent`
                    : "border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4"
                }`}
              >
                {/* Badge de selecionado */}
                {selected === t.id && (
                  <span className="absolute right-2.5 top-2.5 z-10 flex size-5 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                    <CheckCircle2 className="size-3.5 text-white" />
                  </span>
                )}

                {/* Preview */}
                <div
                  className={`relative w-full overflow-hidden rounded-lg border transition-all duration-200 ${
                    selected === t.id ? t.borderAccent : "border-white/6"
                  }`}
                >
                  <Image
                    src={t.image}
                    width={240}
                    height={140}
                    alt={`Template ${t.label}`}
                    className={`w-full object-cover transition-transform duration-300 ${
                      hovered === t.id || selected === t.id
                        ? "scale-105"
                        : "scale-100"
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="w-full">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${t.dot}`} />
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        selected === t.id ? t.textAccent : "text-white"
                      }`}
                    >
                      {t.label}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                    {t.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">
              {selected
                ? `Template "${TEMPLATES.find((t) => t.id === selected)?.label}" selecionado`
                : "Nenhum template selecionado"}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border cursor-pointer border-white/8 bg-white/4 px-5 py-2.5 text-sm text-zinc-300 transition-all hover:bg-white/8 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => selected && onSelect(selected)}
                disabled={!selected}
                className="flex items-center gap-2 cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CircleStar className="size-4" />
                Visualizar Portfólio
              </button>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes overlayIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.90) translateY(16px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `,
        }}
      />
    </div>
  );
}
