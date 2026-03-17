"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

import ModernBg from "@/assets/templates/Modern.png";
import type { PortfolioData } from "./types";
import { ProfileNavbar } from "./ProfileNavbar";

import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FileBadge,
  Languages,
  Code2,
  FolderGit2,
  Award,
} from "lucide-react";

// Fadein das informações
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// SlideIn (da esquerda)
function SlideIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateX(-24px)";
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

// Floating card
function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-white/8 bg-linear-to-b from-white/4 to-white/1 p-5 shadow-xl shadow-black/30 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

// Skill level bar
function LevelBar({ nivel }: { nivel: string }) {
  const levels: Record<string, number> = {
    Básico: 1,
    "Pré-Intermediário": 2,
    Intermediário: 3,
    "Pré-Avançado": 4,
    Avançado: 5,
    Nativo: 5,
    Fluente: 5,
  };
  const filled = levels[nivel] ?? 3;
  return (
    <div className="mt-1 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full transition-colors ${
            i < filled ? "bg-violet-400" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

// Section heading
function SectionHeading({
  icon,
  title,
  accent = "violet",
}: {
  icon: ReactNode;
  title: string;
  accent?: "violet" | "blue" | "emerald" | "amber" | "rose" | "sky";
}) {
  const colors: Record<string, string> = {
    violet: "text-violet-400 bg-violet-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10",
    sky: "text-sky-400 bg-sky-500/10",
  };
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex size-10 items-center justify-center rounded-lg ${colors[accent]}`}
      >
        <span className={colors[accent].split(" ")[0]}>{icon}</span>
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

export function ModernTemplate({ portfolio }: { portfolio: PortfolioData }) {
  const {
    nome,
    email,
    telefone,
    localizacao,
    github,
    linkedin,
    website,
    perfil,
    tituloProfissional,
    skills,
    experiences,
    educations,
    certifications,
    languages,
    projects,
  } = portfolio;

  const hasExp = experiences.some((e) => e.cargo || e.empresa);
  const hasEdu = educations.some((e) => e.curso || e.instituicao);
  const hasCert = certifications.some((c) => c.nome);
  const hasLang = languages.some((l) => l.idioma);
  const hasProj = projects.some((p) => p.nome);

  /* Iniciais do nome */
  const initials = nome
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <ProfileNavbar portfolio={portfolio} />
      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        {/* Background com blur */}
        <div className="absolute inset-0">
          <Image
            src={ModernBg}
            alt=""
            fill
            className="object-cover"
            style={{
              filter: "blur(14px)",
              opacity: 0.22,
              transform: "scale(1.08)",
            }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(37,99,235,0.18) 40%, rgba(8,8,16,0.95) 80%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-8 py-20 md:px-16">
          <div className="flex flex-col gap-6">
            {/* Linha: avatar + nome */}
            <div
              className="flex items-center gap-5"
              style={{ animation: "heroIn 0.8s ease both" }}
            >
              {/* Avatar com iniciais */}
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-blue-600 text-2xl font-bold shadow-lg shadow-violet-900/30">
                {initials || "?"}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  {nome || "Seu Nome"}
                </h1>
                {tituloProfissional && (
                  <p
                    className="mt-1.5 text-lg font-medium text-violet-300"
                    style={{
                      animation: "heroIn 0.8s ease 0.2s both",
                      opacity: 0,
                    }}
                  >
                    {tituloProfissional}
                  </p>
                )}
              </div>
            </div>

            {/* Links full-width abaixo */}
            <div
              className="flex flex-wrap gap-3"
              style={{ animation: "heroIn 0.8s ease 0.3s both", opacity: 0 }}
            >
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                >
                  <Mail className="size-3.5 text-violet-400" />
                  {email}
                </a>
              )}
              {telefone && (
                <span className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm">
                  <Phone className="size-3.5 text-violet-400" />
                  {telefone}
                </span>
              )}
              {localizacao && (
                <span className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm">
                  <MapPin className="size-3.5 text-violet-400" />
                  {localizacao}
                </span>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                >
                  <Github className="size-3.5 text-violet-400" />
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                >
                  <Linkedin className="size-3.5 text-violet-400" />
                  LinkedIn
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                >
                  <Globe className="size-3.5 text-violet-400" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══ LAYOUT ══ */}
      <main className="mx-auto max-w-7xl gap-8 px-8 py-12 md:px-16 lg:grid lg:grid-cols-[1fr_300px]">
        {/* ── COLUNA PRINCIPAL ── */}
        <div className="flex flex-col gap-8">
          {/* Perfil */}
          {perfil && (
            <FadeIn>
              <Card id="sec-perfil">
                <SectionHeading
                  icon={<span className="text-sm">✦</span>}
                  title="Perfil Profissional"
                  accent="violet"
                />
                <p className="leading-relaxed text-zinc-300">{perfil}</p>
              </Card>
            </FadeIn>
          )}

          {/* Experiência */}
          {hasExp && (
            <FadeIn>
              <Card id="sec-experiencia">
                <SectionHeading
                  icon={<Briefcase className="size-4" />}
                  title="Experiência Profissional"
                  accent="amber"
                />
                <div className="space-y-6">
                  {experiences
                    .filter((e) => e.cargo || e.empresa)
                    .map((exp, i) => (
                      <SlideIn key={exp.id} delay={i * 80}>
                        <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                {exp.cargo}
                              </h3>
                              <p className="mt-0.5 text-sm font-medium text-amber-300">
                                {exp.empresa}
                                {exp.local ? ` · ${exp.local}` : ""}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-zinc-500">
                              {exp.inicio}
                              {exp.fim || exp.atual
                                ? ` – ${exp.atual ? "Atual" : exp.fim}`
                                : ""}
                            </span>
                          </div>
                          {exp.descricao && (
                            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                              {exp.descricao}
                            </p>
                          )}
                        </div>
                      </SlideIn>
                    ))}
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Educação */}
          {hasEdu && (
            <FadeIn>
              <Card id="sec-educacao">
                <SectionHeading
                  icon={<GraduationCap className="size-4" />}
                  title="Educação"
                  accent="sky"
                />
                <div className="space-y-4">
                  {educations
                    .filter((e) => e.curso || e.instituicao)
                    .map((edu, i) => (
                      <SlideIn key={edu.id} delay={i * 80}>
                        <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                {edu.curso}
                              </h3>
                              <p className="mt-0.5 text-sm text-sky-300">
                                {edu.instituicao}
                                {edu.grau ? ` · ${edu.grau}` : ""}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-zinc-500">
                              {edu.inicio}
                              {edu.fim || edu.atual
                                ? ` – ${edu.atual ? "Atual" : edu.fim}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </SlideIn>
                    ))}
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Projetos */}
          {hasProj && (
            <FadeIn>
              <Card id="sec-projetos">
                <SectionHeading
                  icon={<FolderGit2 className="size-4" />}
                  title="Projetos"
                  accent="emerald"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects
                    .filter((p) => p.nome)
                    .map((proj, i) => (
                      <FadeIn key={proj.id} delay={i * 80}>
                        <div className="flex h-full flex-col rounded-xl border border-white/8 bg-white/2 p-4 transition-all duration-200 hover:border-emerald-500/20 hover:bg-white/4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-white">
                              {proj.nome}
                            </h3>
                            <div className="flex shrink-0 gap-2">
                              {proj.github && (
                                <a
                                  href={proj.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zinc-500 transition-colors hover:text-emerald-400"
                                >
                                  <Github className="size-4" />
                                </a>
                              )}
                              {proj.url && (
                                <a
                                  href={proj.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zinc-500 transition-colors hover:text-emerald-400"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          {proj.descricao && (
                            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-400">
                              {proj.descricao}
                            </p>
                          )}
                          {proj.tecnologias && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {proj.tecnologias.split(",").map((tech, ti) => (
                                <span
                                  key={ti}
                                  className="rounded-md bg-emerald-500/8 px-2 py-0.5 text-xs text-emerald-400"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Certificações */}
          {hasCert && (
            <FadeIn>
              <Card id="sec-certificacoes">
                <SectionHeading
                  icon={<FileBadge className="size-4" />}
                  title="Certificações"
                  accent="rose"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {certifications
                    .filter((c) => c.nome)
                    .map((cert, i) => (
                      <FadeIn key={cert.id} delay={i * 60}>
                        <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                          <div className="mb-1 flex items-center gap-2">
                            <Award className="size-3.5 text-rose-400" />
                            <p className="font-medium text-white">
                              {cert.nome}
                            </p>
                          </div>
                          {cert.emissor && (
                            <p className="text-sm text-zinc-400">
                              {cert.emissor}
                            </p>
                          )}
                          {cert.data && (
                            <p className="mt-1 text-xs text-zinc-600">
                              {cert.data}
                            </p>
                          )}
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 flex items-center gap-1 text-xs text-rose-400 transition-colors hover:text-rose-300"
                            >
                              <ExternalLink className="size-3" /> Ver
                              certificado
                            </a>
                          )}
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          {/* Habilidades */}
          {skills.length > 0 && (
            <FadeIn delay={100}>
              <Card id="sec-habilidades">
                <SectionHeading
                  icon={<Code2 className="size-4" />}
                  title="Habilidades"
                  accent="blue"
                />
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{
                        background: `hsl(${(i * 37 + 230) % 360} 60% 35% / 0.4)`,
                        border: `1px solid hsl(${(i * 37 + 230) % 360} 60% 50% / 0.3)`,
                        animation: `skillIn 0.4s ease ${i * 35}ms both`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Idiomas */}
          {hasLang && (
            <FadeIn delay={200}>
              <Card id="sec-idiomas">
                <SectionHeading
                  icon={<Languages className="size-4" />}
                  title="Idiomas"
                  accent="violet"
                />
                <div className="space-y-4">
                  {languages
                    .filter((l) => l.idioma)
                    .map((lang, i) => (
                      <SlideIn key={lang.id} delay={i * 60}>
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white">
                              {lang.idioma}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {lang.nivel}
                            </p>
                          </div>
                          <LevelBar nivel={lang.nivel} />
                        </div>
                      </SlideIn>
                    ))}
                </div>
              </Card>
            </FadeIn>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-white/6 py-8 text-center text-sm text-zinc-600"
        style={{
          background:
            "linear-gradient(to top, rgba(124,58,237,0.04) 0%, transparent 100%)",
        }}
      >
        © {new Date().getFullYear()} {nome}
        <span className="mx-2 text-zinc-700">·</span>
        <span>Feito com </span>
        <span className="text-violet-400">DevTrack</span>
        <span> by GWBR Technologies</span>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes heroIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes skillIn {
            from { opacity: 0; transform: scale(0.75); }
            to   { opacity: 1; transform: scale(1); }
          }
        `,
        }}
      />
    </div>
  );
}
