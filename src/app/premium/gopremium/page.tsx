"use client";

import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuthUserFirebase } from "@/store/authUser.store";

import { plans } from "@/app/contentData/premium/plans";
import { featureHighlights } from "@/app/contentData/premium/featureHighlights";

import { Check, Sparkles, ArrowRight, X } from "lucide-react";

export default function GoPremium() {
  const { user } = useAuthUserFirebase();
  const [isAnnual, setIsAnnual] = useState(false);

  const displayName = user?.displayName ?? "Desenvolvedor";
  const photoURL = user?.photoURL;
  const handle = user?.email?.split("@")[0] ?? "dev";

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <Navbar
        displayName={displayName}
        handle={handle}
        photoURL={photoURL}
        username={undefined}
      />

      {/* ── BACKGROUND GLOWS ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-8%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-[140px]" />
        <div className="absolute right-[-6%] top-[35%] h-[380px] w-[380px] rounded-full bg-violet-600/8 blur-[110px]" />
        <div className="absolute left-[-4%] top-[55%] h-[280px] w-[280px] rounded-full bg-sky-600/7 blur-[100px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <main className="mx-auto max-w-screen-xl px-6 py-16 md:px-10">
        {/* ── HERO ── */}
        <section className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/8 px-4 py-1.5 text-sm text-blue-300">
            <Sparkles className="size-3.5" />
            <span>Desbloqueie seu potencial completo</span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 30%, #a1a1aa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Escolha o plano ideal{" "}
            </span>
            <span
              className="block mt-1"
              style={{
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              para sua carreira
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Sem contratos, sem multas. Você pode cancelar sua assinatura a
            qualquer momento diretamente pelo painel.
          </p>

          {/* ── BILLING TOGGLE ── */}
          <div className="mt-10 inline-flex items-center gap-4">
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                !isAnnual ? "text-white" : "text-zinc-500"
              }`}
            >
              Mensal
            </span>

            <button
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual((v) => !v)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                isAnnual
                  ? "border-blue-500/40 bg-blue-600"
                  : "border-white/10 bg-white/8"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isAnnual ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isAnnual ? "text-white" : "text-zinc-500"
                }`}
              >
                Anual
              </span>
            </div>
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        <section className="mb-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-300 ${plan.cardClass} ${
                    plan.id === "pro"
                      ? "ring-1 ring-blue-500/20 shadow-xl shadow-blue-950/20"
                      : plan.id === "career"
                        ? "ring-1 ring-violet-500/20 shadow-xl shadow-violet-950/20"
                        : ""
                  }`}
                >
                  {/* Inner glow for highlighted plans */}
                  {plan.id === "pro" && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 65%)",
                      }}
                    />
                  )}
                  {plan.id === "career" && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 65%)",
                      }}
                    />
                  )}

                  <div className="relative flex flex-1 flex-col">
                    {/* Plan header */}
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl ${plan.iconBgClass}`}
                      >
                        <Icon className={`size-5 ${plan.iconClass}`} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold tracking-wide ${plan.badgeClass}`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>

                    {/* Plan name & price */}
                    <h2 className="text-xl font-bold text-white">
                      {plan.name}
                    </h2>
                    <div className="mt-2 flex items-baseline gap-1">
                      {plan.price ? (
                        <>
                          <span className="text-4xl font-extrabold text-white transition-all duration-300">
                            {isAnnual && plan.priceAnnual
                              ? plan.priceAnnual
                              : plan.price}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {isAnnual && plan.priceAnnual
                              ? plan.priceLabelAnual
                              : plan.priceLabel}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-extrabold text-zinc-400">
                          {plan.priceLabel}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.priceAnnual && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Cobrado anualmente
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                      {plan.description}
                    </p>

                    {/* Divider */}
                    <div className="my-6 h-px bg-white/6" />

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.label}
                          className="flex items-center gap-3"
                        >
                          {feature.included ? (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12">
                              <Check className="size-3 text-emerald-400" />
                            </span>
                          ) : (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-500/10">
                              <X className="size-3 text-zinc-600" />
                            </span>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-zinc-300"
                                : "text-zinc-600"
                            }`}
                          >
                            {feature.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      disabled={plan.buttonDisabled}
                      className={`h-11 w-full gap-2 text-sm font-semibold transition-all duration-200 ${plan.buttonClass}`}
                    >
                      {!plan.buttonDisabled && (
                        <ArrowRight className="size-4" />
                      )}
                      {plan.buttonLabel}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FEATURES HIGHLIGHT ── */}
        <section className="mb-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Tudo que você precisa para ser contratado está no Premium
            </h2>
            <p className="mt-3 text-base text-zinc-500">
              Ferramentas desenvolvidas especificamente para desenvolvedores que
              buscam sua próxima oportunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/2 p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/4"
                >
                  <div
                    className={`mb-4 flex size-11 items-center justify-center rounded-xl ${feature.accentClass}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
