"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ProfileNavbar } from "./ProfileNavbar";
import { PreviewInfo } from "../PreviewInfo";
import { EditProfile } from "../EditProfile";

import type { PortfolioData } from "./types";

import TechBg from "@/assets/templates/TechOne.png";

import {
  Mail,
  Phone,
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

// Typewriter effect (sem biblioteca)
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
          className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-emerald-400"
          style={{ animation: "cursorBlink 0.8s step-end infinite" }}
        />
      )}
    </span>
  );
}

// Terminal window wrapper
function TerminalWindow({
  title,
  children,
  className = "",
  id,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`overflow-hidden rounded-xl border border-emerald-500/15 bg-[#0a0d0f] shadow-xl shadow-black/40 ${className}`}
    >
      {/* Titlebar */}
      <div className="flex items-center gap-2 border-b border-white/6 bg-white/2 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-500/70" />
        <span className="size-2.5 rounded-full bg-yellow-500/70" />
        <span className="size-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 font-sans text-xs text-zinc-500">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Decoração no estilo de Command line
function CmdLine({
  children,
  prompt = "$",
}: {
  children: ReactNode;
  prompt?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 font-mono text-xs text-emerald-500">
        {prompt}
      </span>
      <span className="font-mono text-xs text-zinc-300">{children}</span>
    </div>
  );
}

// Skill tags
function SkillTag({ label, i }: { label: string; i: number }) {
  return (
    <span
      className="rounded-md border border-emerald-500/20 bg-emerald-500/6 px-2.5 py-1 font-mono text-xs text-emerald-300 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/12"
      style={{ animation: `skillPop 0.35s ease ${i * 35}ms both` }}
    >
      {label}
    </span>
  );
}

export function TechTemplate({ portfolio }: { portfolio: PortfolioData }) {
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

  const pathname = usePathname();

  const slugHandle = nome
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {pathname === "/tools/profile" ? <PreviewInfo /> : null}
      <ProfileNavbar portfolio={portfolio} />
      {pathname === "/tools/profile" ? <EditProfile /> : null}

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        {/* Background com blur */}
        <div className="absolute inset-0">
          <Image
            src={TechBg}
            alt=""
            fill
            className="object-cover"
            style={{
              filter: "blur(12px)",
              opacity: 0.15,
              transform: "scale(1.06)",
            }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(8,8,16,0.7) 0%, rgba(8,8,16,0.1) 40%, rgba(8,8,16,1) 100%)",
            }}
          />
          {/* scanlines decorativas */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.5) 2px, rgba(0,255,100,0.5) 3px)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24">
          {/* Terminal prompt */}
          <div
            className="mb-6 font-mono text-sm text-zinc-500"
            style={{ animation: "fadeIn 0.6s ease both" }}
          >
            <span className="text-emerald-500">~/portfolio</span>
            <span className="text-zinc-600"> $ </span>
            <span className="text-zinc-400">cat profile.json</span>
          </div>

          <div style={{ animation: "fadeIn 0.8s ease 0.1s both", opacity: 0 }}>
            <div className="mb-1 font-mono text-sm text-zinc-500">
              <span className="text-zinc-600">{"{"}</span>
            </div>
            <div className="pl-4">
              <p className="font-mono text-sm text-zinc-500">
                <span className="text-sky-400">{`"name"`}</span>
                <span className="text-zinc-600">{`: `}</span>
                <span className="text-emerald-300 text-xl font-bold">{`"${nome || "Seu Nome"}"`}</span>
                <span className="text-zinc-600">{`,`}</span>
              </p>
              {tituloProfissional && (
                <p className="font-mono text-sm text-zinc-500">
                  <span className="text-sky-400">{`"role"`}</span>
                  <span className="text-zinc-600">{`: `}</span>
                  <span className="text-emerald-300">
                    {`"`}
                    <Typewriter text={tituloProfissional} speed={50} />
                    {`"`}
                  </span>
                </p>
              )}
              {localizacao && (
                <p className="font-mono text-sm text-zinc-500">
                  <span className="text-sky-400">{`"location"`}</span>
                  <span className="text-zinc-600">{`: `}</span>
                  <span className="text-amber-300">{`"${localizacao}"`}</span>
                </p>
              )}
            </div>
            <div className="font-mono text-sm text-zinc-600">{"}"}</div>
          </div>

          {/* Links */}
          <div
            className="mt-7 flex flex-wrap gap-3"
            style={{ animation: "fadeIn 0.8s ease 0.4s both", opacity: 0 }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/6 px-4 py-2 font-mono text-xs text-emerald-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/12"
              >
                <Mail className="size-3.5" />
                {email}
              </a>
            )}
            {telefone && (
              <span className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-4 py-2 font-mono text-xs text-zinc-400">
                <Phone className="size-3.5" />
                {telefone}
              </span>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/6 px-4 py-2 font-mono text-xs text-emerald-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/12"
              >
                <Github className="size-3.5" />
                github
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/6 px-4 py-2 font-mono text-xs text-sky-300 transition-all hover:border-sky-500/40 hover:bg-sky-500/12"
              >
                <Linkedin className="size-3.5" />
                linkedin
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-4 py-2 font-mono text-xs text-zinc-400 transition-all hover:text-white"
              >
                <Globe className="size-3.5" />
                website
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ══ CONTEÚDO ══ */}
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        {/* README / Perfil */}
        {perfil && (
          <FadeIn>
            <TerminalWindow title={`README.md — ${slugHandle}`} id="sec-perfil">
              <CmdLine prompt="#">
                <span className="text-zinc-400">Sobre mim</span>
              </CmdLine>
              <p className="mt-3 font-sans text-sm leading-relaxed text-zinc-300">
                {perfil}
              </p>
            </TerminalWindow>
          </FadeIn>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <FadeIn delay={40}>
            <TerminalWindow title="skills.json" id="sec-habilidades">
              <div className="mb-1 font-mono text-xs text-zinc-600">
                <CmdLine>ls -la skills/</CmdLine>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <SkillTag key={i} label={skill} i={i} />
                ))}
              </div>
            </TerminalWindow>
          </FadeIn>
        )}

        {/* Experiência */}
        {hasExp && (
          <FadeIn delay={80}>
            <TerminalWindow title="experience.log" id="sec-experiencia">
              <CmdLine>cat experience.log | sort -r</CmdLine>
              <div className="mt-4 space-y-4">
                {experiences
                  .filter((e) => e.cargo || e.empresa)
                  .map((exp, i) => (
                    <FadeIn key={exp.id} delay={i * 80}>
                      <div className="rounded-lg border border-white/6 bg-white/1 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-sans font-semibold text-white">
                              {exp.cargo}
                            </p>
                            <p className="font-sans text-sm text-emerald-400">
                              {exp.empresa}
                              {exp.local ? ` — ${exp.local}` : ""}
                            </p>
                          </div>
                          <span className="rounded-md border border-white/8 bg-white/4 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
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
            </TerminalWindow>
          </FadeIn>
        )}

        {/* Projetos */}
        {hasProj && (
          <FadeIn delay={100}>
            <TerminalWindow title="projects/" id="sec-projetos">
              <CmdLine>git log --oneline --all</CmdLine>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {projects
                  .filter((p) => p.nome)
                  .map((proj, i) => (
                    <FadeIn key={proj.id} delay={i * 70}>
                      <div className="h-full rounded-lg border border-emerald-500/12 bg-emerald-500/3 p-4 transition-all duration-200 hover:border-emerald-500/25 hover:bg-emerald-500/6">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FolderGit2 className="size-4 text-emerald-500" />
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
                          <p className="mt-1.5 font-sans text-xs leading-relaxed text-zinc-400">
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
            </TerminalWindow>
          </FadeIn>
        )}

        {/* Grid: Educação + Certificações */}
        <div className="grid gap-6 md:grid-cols-2">
          {hasEdu && (
            <FadeIn delay={60}>
              <TerminalWindow
                title="education.log"
                className="h-full"
                id="sec-educacao"
              >
                <CmdLine>cat education.log</CmdLine>
                <div className="mt-4 space-y-4">
                  {educations
                    .filter((e) => e.curso || e.instituicao)
                    .map((edu, i) => (
                      <FadeIn key={edu.id} delay={i * 80}>
                        <div className="border-l-2 border-sky-500/40 pl-3">
                          <p className="font-sans font-medium text-white">
                            {edu.curso}
                          </p>
                          <p className="font-sans text-sm text-sky-400">
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
              </TerminalWindow>
            </FadeIn>
          )}

          {hasCert && (
            <FadeIn delay={120}>
              <TerminalWindow
                title="certifications.json"
                className="h-full"
                id="sec-certificacoes"
              >
                <CmdLine>{`jq '.[]' certifications.json`}</CmdLine>
                <div className="mt-4 space-y-3">
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
                              className="mt-1 flex items-center gap-1 font-mono text-xs text-emerald-400 hover:text-emerald-300"
                            >
                              <ExternalLink className="size-3" /> ver
                            </a>
                          )}
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </TerminalWindow>
            </FadeIn>
          )}
        </div>

        {/* Idiomas */}
        {hasLang && (
          <FadeIn delay={80}>
            <TerminalWindow title="languages.config" id="sec-idiomas">
              <CmdLine>echo $LANG_CONFIG</CmdLine>
              <div className="mt-4 flex flex-wrap gap-4">
                {languages
                  .filter((l) => l.idioma)
                  .map((lang, i) => (
                    <FadeIn key={lang.id} delay={i * 60}>
                      <div className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/2 px-4 py-3">
                        <span className="font-mono text-lg">
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
                          <p className="font-mono text-xs text-emerald-500">
                            {lang.nivel}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
              </div>
            </TerminalWindow>
          </FadeIn>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 py-8 text-center font-mono text-xs text-zinc-700">
        <span className="text-emerald-600">~/portfolio</span>
        <span className="text-zinc-700"> $ </span>
        <span>{`echo "© ${new Date().getFullYear()} ${nome}"`}</span>
        <span className="mx-2 text-zinc-700">::</span>
        <span className="text-emerald-600">Feito com DevTrack</span>
        <span> by GWBR Technologies</span>
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
