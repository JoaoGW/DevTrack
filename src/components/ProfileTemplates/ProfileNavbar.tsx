"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { PortfolioData } from "./types";

import { GitBranch, Menu, X } from "lucide-react";

const SECTIONS = [
  { key: "perfil", id: "sec-perfil", label: "Perfil" },
  { key: "skills", id: "sec-habilidades", label: "Habilidades" },
  { key: "experiences", id: "sec-experiencia", label: "Experiência" },
  { key: "educations", id: "sec-educacao", label: "Educação" },
  { key: "certifications", id: "sec-certificacoes", label: "Certificações" },
  { key: "languages", id: "sec-idiomas", label: "Idiomas" },
  { key: "projects", id: "sec-projetos", label: "Projetos" },
] as const;

function sectionVisible(portfolio: PortfolioData, key: string): boolean {
  const val = portfolio[key as keyof PortfolioData];
  if (!val) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val))
    return (val as unknown as Record<string, unknown>[]).some(
      (item) =>
        item["nome"] || item["cargo"] || item["curso"] || item["idioma"],
    );
  return false;
}

export function ProfileNavbar({ portfolio }: { portfolio: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Destaca seção ativa via IntersectionObserver
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.35 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const visible = SECTIONS.filter(({ key }) => sectionVisible(portfolio, key));

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-[#080810]/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-b border-transparent bg-[#080810]/70 backdrop-blur-sm"
      }`}
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600">
            <GitBranch className="size-5 text-white" />
          </div>
          <button
            className="flex flex-col items-start cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <p className="text-lg font-bold leading-none tracking-tight text-white">
              DevTrack
            </p>
            <p className="mt-0.5 text-xs leading-none text-zinc-500">
              by GWBR Technologies
            </p>
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 md:flex">
          {visible.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeId === id
                  ? "bg-blue-500/12 font-medium text-blue-300"
                  : "text-zinc-400 hover:bg-white/6 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile */}
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-zinc-400 transition-colors hover:bg-white/8 hover:text-white md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/6 bg-[#080810]/95 px-6 py-2 md:hidden">
          {visible.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-zinc-400 transition-all hover:bg-white/6 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
