"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import TechTwoBg from "@/assets/templates/TechTwo.png";
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
  FolderGit2,
  Award,
} from "lucide-react";

// FadeIn via IntersectionObserver
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
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;
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

// Efeito de Typewriter
function Typewriter({ text, speed = 45 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-purple-400"
          style={{ animation: "cursorBlink 0.8s step-end infinite" }}
        />
      )}
    </span>
  );
}

// Panel window wrapper (estilo IDE/code editor)
function Panel({
  title,
  lang,
  children,
  className = "",
}: {
  title: string;
  lang?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-purple-500/15 bg-[#0d0a14] shadow-xl shadow-black/40 ${className}`}
    >
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/6 bg-white/2 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 rounded-full bg-purple-500/70" />
          </div>
          <span className="font-mono text-xs text-zinc-500">{title}</span>
        </div>
        {lang && (
          <span className="rounded border border-purple-500/20 bg-purple-500/8 px-1.5 py-0.5 font-mono text-[10px] text-purple-400">
            {lang}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Code line numbers decoration
function CodeBlock({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="font-mono text-sm">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-4">
          <span className="w-6 shrink-0 select-none text-right text-xs text-zinc-700">
            {i + 1}
          </span>
          <div className="flex-1">{line}</div>
        </div>
      ))}
    </div>
  );
}

// Skill tag (purple variant)
function SkillTag({ label, i }: { label: string; i: number }) {
  return (
    <span
      className="rounded-md border border-purple-500/20 bg-purple-500/8 px-2.5 py-1 font-mono text-xs text-purple-300 transition-colors hover:border-purple-500/40 hover:bg-purple-500/14"
      style={{ animation: `skillPop 0.35s ease ${i * 35}ms both` }}
    >
      {label}
    </span>
  );
}

export function TechTwoTemplate({ portfolio }: { portfolio: PortfolioData }) {
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

  const slugHandle = nome
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <div
      className="min-h-screen bg-[#0d0a14] text-white"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <ProfileNavbar portfolio={portfolio} />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={TechTwoBg}
            alt=""
            fill
            className="object-cover"
            style={{
              filter: "blur(14px)",
              opacity: 0.14,
              transform: "scale(1.06)",
            }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,10,20,0.75) 0%, rgba(88,28,235,0.08) 40%, rgba(13,10,20,1) 100%)",
            }}
          />
          {/* Grid decorativo */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(167,139,250,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.6) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24">
          {/* Breadcrumb / file path */}
          <div
            className="mb-5 flex items-center gap-1 font-mono text-xs text-zinc-600"
            style={{ animation: "fadeIn 0.6s ease both" }}
          >
            <span className="text-purple-500">src</span>
            <span>/</span>
            <span className="text-purple-400">portfolio</span>
            <span>/</span>
            <span className="text-purple-300">{slugHandle}.tsx</span>
          </div>

          {/* Code display */}
          <div style={{ animation: "fadeIn 0.9s ease 0.1s both", opacity: 0 }}>
            <Panel title={`${slugHandle}.tsx`} lang="TSX">
              <CodeBlock
                lines={[
                  <span key="0" className="text-purple-400">
                    {`export const `}
                    <span className="text-sky-300">Developer</span>
                    {` = {`}
                  </span>,
                  <span key="1" className="pl-4">
                    <span className="text-purple-300">{`name: `}</span>
                    <span className="text-emerald-300 text-xl font-bold">
                      {`"${nome || "Seu Nome"}"`}
                    </span>
                    <span className="text-zinc-500">{`,`}</span>
                  </span>,
                  tituloProfissional ? (
                    <span key="2" className="pl-4">
                      <span className="text-purple-300">{`role: `}</span>
                      <span className="text-amber-300">
                        {`"`}
                        <Typewriter text={tituloProfissional} speed={50} />
                        {`"`}
                      </span>
                      <span className="text-zinc-500">{`,`}</span>
                    </span>
                  ) : (
                    <span key="2" />
                  ),
                  localizacao ? (
                    <span key="3" className="pl-4">
                      <span className="text-purple-300">{`location: `}</span>
                      <span className="text-rose-300">{`"${localizacao}"`}</span>
                      <span className="text-zinc-500">{`,`}</span>
                    </span>
                  ) : (
                    <span key="3" />
                  ),
                  <span key="4" className="text-purple-400">
                    {`}`}
                  </span>,
                ]}
              />
            </Panel>
          </div>

          {/* Links */}
          <div
            className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3"
            style={{ animation: "fadeIn 0.8s ease 0.5s both", opacity: 0 }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-2.5 font-mono text-xs text-purple-300 transition-all hover:border-purple-500/40 hover:bg-purple-500/14"
              >
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            )}
            {telefone && (
              <span className="flex items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2.5 font-mono text-xs text-zinc-400">
                <Phone className="size-3.5 shrink-0" />
                <span className="truncate">{telefone}</span>
              </span>
            )}
            {localizacao && (
              <span className="flex items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2.5 font-mono text-xs text-zinc-400">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{localizacao}</span>
              </span>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-2.5 font-mono text-xs text-purple-300 transition-all hover:border-purple-500/40 hover:bg-purple-500/14"
              >
                <Github className="size-3.5 shrink-0" />
                github
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/8 px-3 py-2.5 font-mono text-xs text-sky-300 transition-all hover:border-sky-500/40 hover:bg-sky-500/14"
              >
                <Linkedin className="size-3.5 shrink-0" />
                linkedin
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2.5 font-mono text-xs text-zinc-400 transition-all hover:text-white"
              >
                <Globe className="size-3.5 shrink-0" />
                website
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ══ CONTEÚDO ══ */}
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        {/* Perfil */}
        {perfil && (
          <FadeIn>
            <section id="sec-perfil">
              <Panel title="README.md" lang="MD">
                <p className="font-sans text-sm leading-relaxed text-zinc-300">
                  {perfil}
                </p>
              </Panel>
            </section>
          </FadeIn>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <FadeIn delay={40}>
            <section id="sec-habilidades">
              <Panel title="package.json" lang="JSON">
                <div className="mb-2">
                  <span className="font-mono text-xs text-purple-400">{`"dependencies"`}</span>
                  <span className="font-mono text-xs text-zinc-500">{`: {`}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <SkillTag key={i} label={skill} i={i} />
                  ))}
                </div>
                <div className="mt-2 font-mono text-xs text-zinc-500">{`}`}</div>
              </Panel>
            </section>
          </FadeIn>
        )}

        {/* Experiência */}
        {hasExp && (
          <FadeIn delay={80}>
            <section id="sec-experiencia">
              <Panel title="experience.ts" lang="TS">
                <div className="space-y-4">
                  {experiences
                    .filter((e) => e.cargo || e.empresa)
                    .map((exp, i) => (
                      <FadeIn key={exp.id} delay={i * 80}>
                        <div className="rounded-lg border border-purple-500/12 bg-purple-500/4 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-sans font-semibold text-white">
                                {exp.cargo}
                              </p>
                              <p className="font-sans text-sm text-purple-300">
                                {exp.empresa}
                                {exp.local ? ` — ${exp.local}` : ""}
                              </p>
                            </div>
                            <span className="rounded border border-purple-500/20 bg-purple-500/8 px-2.5 py-0.5 font-mono text-xs text-purple-400">
                              {exp.inicio}
                              {exp.fim || exp.atual
                                ? ` → ${exp.atual ? "present" : exp.fim}`
                                : ""}
                            </span>
                          </div>
                          {exp.descricao && (
                            <p className="mt-2 font-sans text-sm leading-relaxed text-zinc-400">
                              {exp.descricao}
                            </p>
                          )}
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </Panel>
            </section>
          </FadeIn>
        )}

        {/* Projetos */}
        {hasProj && (
          <FadeIn delay={100}>
            <section id="sec-projetos">
              <Panel title="projects/" lang="DIR">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects
                    .filter((p) => p.nome)
                    .map((proj, i) => (
                      <FadeIn key={proj.id} delay={i * 70}>
                        <div className="h-full flex flex-col rounded-lg border border-purple-500/12 bg-purple-500/4 p-4 transition-all duration-200 hover:border-purple-500/25 hover:bg-purple-500/8">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <FolderGit2 className="size-4 text-purple-400" />
                              <h3 className="font-sans font-semibold text-white">
                                {proj.nome}
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              {proj.github && (
                                <a
                                  href={proj.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zinc-500 transition-colors hover:text-purple-400"
                                >
                                  <Github className="size-4" />
                                </a>
                              )}
                              {proj.url && (
                                <a
                                  href={proj.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zinc-500 transition-colors hover:text-purple-400"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          {proj.descricao && (
                            <p className="mt-1.5 flex-1 font-sans text-xs leading-relaxed text-zinc-400">
                              {proj.descricao}
                            </p>
                          )}
                          {proj.tecnologias && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {proj.tecnologias.split(",").map((tech, ti) => (
                                <span
                                  key={ti}
                                  className="rounded bg-white/4 px-1.5 py-0.5 font-mono text-xs text-zinc-500"
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
              </Panel>
            </section>
          </FadeIn>
        )}

        {/* Educação + Certificações */}
        <div className="grid gap-6 md:grid-cols-2">
          {hasEdu && (
            <FadeIn delay={60}>
              <section id="sec-educacao" className="h-full">
                <Panel title="education.ts" lang="TS" className="h-full">
                  <div className="space-y-4">
                    {educations
                      .filter((e) => e.curso || e.instituicao)
                      .map((edu, i) => (
                        <FadeIn key={edu.id} delay={i * 80}>
                          <div className="border-l-2 border-purple-500/40 pl-3">
                            <p className="font-sans font-medium text-white">
                              {edu.curso}
                            </p>
                            <p className="font-sans text-sm text-purple-300">
                              {edu.instituicao}
                              {edu.grau ? ` · ${edu.grau}` : ""}
                            </p>
                            <p className="font-mono text-xs text-zinc-600">
                              {edu.inicio}
                              {edu.fim || edu.atual
                                ? ` → ${edu.atual ? "present" : edu.fim}`
                                : ""}
                            </p>
                          </div>
                        </FadeIn>
                      ))}
                  </div>
                </Panel>
              </section>
            </FadeIn>
          )}

          {hasCert && (
            <FadeIn delay={120}>
              <section id="sec-certificacoes" className="h-full">
                <Panel title="certifications.ts" lang="TS" className="h-full">
                  <div className="space-y-3">
                    {certifications
                      .filter((c) => c.nome)
                      .map((cert, i) => (
                        <FadeIn key={cert.id} delay={i * 60}>
                          <div className="rounded-lg border border-white/6 bg-white/2 p-3">
                            <div className="flex items-center gap-2">
                              <Award className="size-3.5 text-amber-400" />
                              <p className="font-sans text-sm font-medium text-white">
                                {cert.nome}
                              </p>
                            </div>
                            {cert.emissor && (
                              <p className="mt-0.5 font-sans text-xs text-zinc-500">
                                {cert.emissor}
                                {cert.data ? ` · ${cert.data}` : ""}
                              </p>
                            )}
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1 font-mono text-xs text-purple-400 hover:text-purple-300"
                              >
                                <ExternalLink className="size-3" /> ver
                              </a>
                            )}
                          </div>
                        </FadeIn>
                      ))}
                  </div>
                </Panel>
              </section>
            </FadeIn>
          )}
        </div>

        {/* Idiomas */}
        {hasLang && (
          <FadeIn delay={80}>
            <section id="sec-idiomas">
              <Panel title="languages.config.ts" lang="TS">
                <div className="flex flex-wrap gap-4">
                  {languages
                    .filter((l) => l.idioma)
                    .map((lang, i) => (
                      <FadeIn key={lang.id} delay={i * 60}>
                        <div className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/2 px-4 py-3">
                          <span className="text-lg">
                            {lang.idioma === "Inglês"
                              ? "🇺🇸"
                              : lang.idioma === "Português"
                                ? "🇧🇷"
                                : lang.idioma === "Espanhol"
                                  ? "🇪🇸"
                                  : lang.idioma === "Francês"
                                    ? "🇫🇷"
                                    : lang.idioma === "Alemão"
                                      ? "🇩🇪"
                                      : "🌐"}
                          </span>
                          <div>
                            <p className="font-sans text-sm font-medium text-white">
                              {lang.idioma}
                            </p>
                            <p className="font-mono text-xs text-purple-400">
                              {lang.nivel}
                            </p>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </Panel>
            </section>
          </FadeIn>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 px-6 py-8 text-center font-mono text-xs text-zinc-700">
        <span className="text-purple-600">src/portfolio/</span>
        <span className="text-zinc-700">{slugHandle}.tsx</span>
        <span className="mx-1 text-zinc-700">·</span>
        <span>
          © {new Date().getFullYear()} {nome}
        </span>
        <span className="mx-2 text-zinc-700">·</span>
        <span className="text-purple-600">Feito com DevTrack</span>
        <span className="text-zinc-700"> by GWBR Technologies</span>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
          @keyframes skillPop {
            from { opacity: 0; transform: scale(0.8) translateY(4px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `,
        }}
      />
    </div>
  );
}
