"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ProfileNavbar } from "./ProfileNavbar";
import { PreviewInfo } from "../PreviewInfo";
import { EditProfile } from "../EditProfile";

import type { PortfolioData } from "./types";

import MinimalistBg from "@/assets/templates/Minimalist.png";

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
} from "lucide-react";

// FadeIn wrapper (Intersection Observer, sem biblioteca)
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
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;
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

// Seção de título
function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="shrink-0 text-blue-400">{icon}</span>
      <h2 className="text-base font-semibold tracking-widest text-zinc-300 uppercase">
        {title}
      </h2>
      <div className="flex-1 border-t border-white/8" />
    </div>
  );
}

// Timelines
function TimelineItem({
  title,
  sub,
  period,
  description,
  delay,
}: {
  title: string;
  sub: string;
  period?: string;
  description?: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay ?? 0} className="flex gap-4">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-blue-500/70 ring-2 ring-blue-500/20" />
        <span className="mt-2 w-px flex-1 bg-white/6" />
      </div>
      {/* Content */}
      <div className="pb-8">
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-sm text-blue-300">{sub}</p>
        {period && <p className="mt-0.5 text-xs text-zinc-600">{period}</p>}
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

export function MinimalistTemplate({
  portfolio,
}: {
  portfolio: PortfolioData;
}) {
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

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {pathname === "/tools/profile" ? <PreviewInfo /> : null}
      <ProfileNavbar portfolio={portfolio} />
      {pathname === "/tools/profile" ? <EditProfile /> : null}

      {/* ══ HERO ══ */}
      <header className="relative flex items-center justify-center overflow-hidden">
        {/* Background com blur */}
        <div className="absolute inset-0">
          <Image
            src={MinimalistBg}
            alt=""
            fill
            className="object-cover"
            style={{
              filter: "blur(10px)",
              opacity: 0.18,
              transform: "scale(1.05)",
            }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(8,8,16,0.55) 0%, rgba(8,8,16,0.15) 50%, rgba(8,8,16,1) 100%)",
            }}
          />
        </div>

        {/* Conteúdo do hero */}
        <div
          className="relative z-10 flex flex-col items-center gap-3 px-6 py-12 text-center"
          style={{ animation: "heroSlideDown 0.9s ease both" }}
        >
          <p
            className="text-xs font-medium uppercase tracking-[0.3em] text-blue-400"
            style={{
              animation: "heroSlideDown 0.9s ease 0.1s both",
              opacity: 0,
            }}
          >
            Portfólio Profissional
          </p>
          <h1
            className="text-5xl font-bold tracking-tight text-white md:text-6xl"
            style={{
              animation: "heroSlideDown 0.9s ease 0.15s both",
              opacity: 0,
            }}
          >
            {nome || "Seu Nome"}
          </h1>
          {tituloProfissional && (
            <p
              className="text-xl font-light tracking-wide text-zinc-300"
              style={{
                animation: "heroSlideDown 0.9s ease 0.25s both",
                opacity: 0,
              }}
            >
              {tituloProfissional}
            </p>
          )}

          {/* Linha decorativa */}
          <div
            className="mt-2 h-px w-16 bg-blue-500/50"
            style={{ animation: "lineExpand 0.8s ease 0.4s both" }}
          />

          {/* Contatos */}
          <div
            className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-400"
            style={{
              animation: "heroSlideDown 0.9s ease 0.5s both",
              opacity: 0,
            }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="size-3.5" />
                {email}
              </a>
            )}
            {telefone && (
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {telefone}
              </span>
            )}
            {localizacao && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {localizacao}
              </span>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Github className="size-3.5" /> GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Linkedin className="size-3.5" /> LinkedIn
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Globe className="size-3.5" /> Website
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ══ CONTEÚDO ══ */}
      <main className="mx-auto max-w-3xl space-y-10 px-6 pt-4 pb-10">
        {/* Perfil */}
        {perfil && (
          <FadeIn>
            <section id="sec-perfil">
              <SectionTitle
                icon={<span className="text-base leading-none">✦</span>}
                title="Perfil Profissional"
              />
              <p className="leading-relaxed text-zinc-300">{perfil}</p>
            </section>
          </FadeIn>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <FadeIn delay={50}>
            <section id="sec-habilidades">
              <SectionTitle
                icon={<Code2 className="size-4" />}
                title="Habilidades"
              />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-500/20 bg-blue-500/8 px-3.5 py-1 text-sm text-blue-200"
                    style={{
                      animation: `skillPop 0.4s ease ${i * 40}ms both`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Experiência */}
        {hasExp && (
          <FadeIn>
            <section id="sec-experiencia">
              <SectionTitle
                icon={<Briefcase className="size-4" />}
                title="Experiência Profissional"
              />
              <div>
                {experiences
                  .filter((e) => e.cargo || e.empresa)
                  .map((exp, i) => (
                    <TimelineItem
                      key={exp.id}
                      title={exp.cargo}
                      sub={`${exp.empresa}${exp.local ? ` · ${exp.local}` : ""}`}
                      period={`${exp.inicio}${exp.fim || exp.atual ? ` – ${exp.atual ? "Atual" : exp.fim}` : ""}`}
                      description={exp.descricao}
                      delay={i * 80}
                    />
                  ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Educação */}
        {hasEdu && (
          <FadeIn>
            <section id="sec-educacao">
              <SectionTitle
                icon={<GraduationCap className="size-4" />}
                title="Educação"
              />
              <div>
                {educations
                  .filter((e) => e.curso || e.instituicao)
                  .map((edu, i) => (
                    <TimelineItem
                      key={edu.id}
                      title={edu.curso}
                      sub={`${edu.instituicao}${edu.grau ? ` · ${edu.grau}` : ""}`}
                      period={`${edu.inicio}${edu.fim || edu.atual ? ` – ${edu.atual ? "Atual" : edu.fim}` : ""}`}
                      delay={i * 80}
                    />
                  ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Certificações */}
        {hasCert && (
          <FadeIn>
            <section id="sec-certificacoes">
              <SectionTitle
                icon={<FileBadge className="size-4" />}
                title="Certificações"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {certifications
                  .filter((c) => c.nome)
                  .map((cert, i) => (
                    <FadeIn key={cert.id} delay={i * 60} className="h-full">
                      <div className="flex h-full flex-col rounded-xl border border-white/6 bg-white/2 p-4">
                        <p className="font-medium text-white">{cert.nome}</p>
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
                            className="mt-1.5 flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                          >
                            <ExternalLink className="size-3" /> Ver certificado
                          </a>
                        )}
                      </div>
                    </FadeIn>
                  ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Idiomas */}
        {hasLang && (
          <FadeIn>
            <section id="sec-idiomas">
              <SectionTitle
                icon={<Languages className="size-4" />}
                title="Idiomas"
              />
              <div className="flex flex-wrap gap-3">
                {languages
                  .filter((l) => l.idioma)
                  .map((lang) => (
                    <div
                      key={lang.id}
                      className="rounded-xl border border-white/6 bg-white/2 px-5 py-3"
                    >
                      <p className="font-medium text-white">{lang.idioma}</p>
                      <p className="text-xs text-zinc-500">{lang.nivel}</p>
                    </div>
                  ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Projetos */}
        {hasProj && (
          <FadeIn>
            <section id="sec-projetos">
              <SectionTitle
                icon={<FolderGit2 className="size-4" />}
                title="Projetos"
              />
              <div className="grid gap-4">
                {projects
                  .filter((p) => p.nome)
                  .map((proj, i) => (
                    <FadeIn key={proj.id} delay={i * 80}>
                      <div className="rounded-xl border border-white/6 bg-white/2 p-5 transition-all duration-200 hover:border-white/12 hover:bg-white/4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-white">
                            {proj.nome}
                          </h3>
                          <div className="flex shrink-0 gap-2">
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 transition-colors hover:text-white"
                              >
                                <Github className="size-4" />
                              </a>
                            )}
                            {proj.url && (
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 transition-colors hover:text-white"
                              >
                                <ExternalLink className="size-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {proj.descricao && (
                          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                            {proj.descricao}
                          </p>
                        )}
                        {proj.tecnologias && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {proj.tecnologias.split(",").map((tech, ti) => (
                              <span
                                key={ti}
                                className="rounded-md border border-white/6 px-2 py-0.5 text-xs text-zinc-500"
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
            </section>
          </FadeIn>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/6 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} {nome}
        <span className="mx-2 text-zinc-700">·</span>
        <span>Feito com </span>
        <span className="text-blue-500">DevTrack</span>
        <span> by GWBR Technologies</span>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes heroSlideDown {
            from { opacity: 0; transform: translateY(-18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes lineExpand {
            from { opacity: 0; transform: scaleX(0); }
            to   { opacity: 1; transform: scaleX(1); }
          }
          @keyframes skillPop {
            from { opacity: 0; transform: scale(0.8); }
            to   { opacity: 1; transform: scale(1); }
          }
        `,
        }}
      />
    </div>
  );
}
