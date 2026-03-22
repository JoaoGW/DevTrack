"use client";
import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuthUserFirebase } from "@/store/authUser.store";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code2,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Download,
  CheckCircle2,
  FileBadge,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const inputCls =
  "w-full rounded-xl border border-white/6 bg-white/2 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:bg-white/4";
const labelCls = "block text-sm font-medium text-zinc-300 mb-1.5";
const cardCls = "rounded-2xl border border-white/6 bg-white/2 p-8";
const innerCardCls = "rounded-xl border border-white/6 bg-white/2 p-5";
const dottedBtnCls =
  "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3.5 text-sm text-zinc-500 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/4 hover:text-blue-300 cursor-pointer";

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({
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

function Toggle({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 ${
          checked
            ? "border-blue-500/40 bg-blue-600"
            : "border-white/10 bg-white/8"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="text-sm text-zinc-400">{label}</span>
    </div>
  );
}

// ─── PDF Preview Component ────────────────────────────────────────────────────
function PdfPreview({
  nome,
  tituloProfissional,
  email,
  telefone,
  localizacao,
  githubUrl,
  linkedinUrl,
  perfil,
  skills,
  experiences,
  educations,
  certifications,
  languages,
}: {
  nome: string;
  tituloProfissional: string;
  email: string;
  telefone: string;
  localizacao: string;
  githubUrl: string;
  linkedinUrl: string;
  perfil: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
}) {
  return (
    <div
      className="w-full origin-top rounded-xl bg-white text-[#1a1a1a] shadow-2xl"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11 }}
    >
      {/* Header */}
      <div className="border-b-4 border-[#1e3a5f] bg-[#1e3a5f] px-10 py-8 text-white">
        <h1
          className="text-2xl font-bold tracking-wide"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {nome || "SEU NOME COMPLETO"}
        </h1>
        <p
          className="mt-1 text-sm font-semibold uppercase tracking-widest text-blue-200"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {tituloProfissional || "Título Profissional"}
        </p>

        <div
          className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-blue-100"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {email && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">✉</span> {email}
            </span>
          )}
          {telefone && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">📞</span> {telefone}
            </span>
          )}
          {localizacao && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">📍</span> {localizacao}
            </span>
          )}
          {githubUrl && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">⌥</span>{" "}
              {githubUrl.replace("https://", "")}
            </span>
          )}
          {linkedinUrl && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">in</span>{" "}
              {linkedinUrl.replace("https://", "")}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-7 space-y-5">
        {/* Resumo */}
        {perfil && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Perfil Profissional
            </h2>
            <p className="text-xs leading-relaxed text-zinc-700">{perfil}</p>
          </div>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded bg-[#1e3a5f]/8 border border-[#1e3a5f]/15 px-2 py-0.5 text-[10px] text-zinc-700"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiência */}
        {experiences.some((e) => e.cargo || e.empresa) && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Experiência Profissional
            </h2>
            <div className="space-y-3">
              {experiences
                .filter((e) => e.cargo || e.empresa)
                .map((exp) => (
                  <div key={exp.id}>
                    <div
                      className="flex items-start justify-between"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-800">
                          {exp.cargo || "—"}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {exp.empresa}
                          {exp.local ? ` · ${exp.local}` : ""}
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-500 shrink-0 ml-2">
                        {exp.inicio}
                        {exp.inicio ? " – " : ""}
                        {exp.atual ? "Atual" : exp.fim}
                      </p>
                    </div>
                    {exp.descricao && (
                      <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
                        {exp.descricao}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Educação */}
        {educations.some((e) => e.curso || e.instituicao) && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Educação
            </h2>
            <div className="space-y-2">
              {educations
                .filter((e) => e.curso || e.instituicao)
                .map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-800">
                        {edu.curso || "—"}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {edu.instituicao}
                        {edu.grau ? ` · ${edu.grau}` : ""}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-500 shrink-0 ml-2">
                      {edu.inicio}
                      {edu.inicio ? " – " : ""}
                      {edu.atual ? "Atual" : edu.fim}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certificações */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Certificações
            </h2>
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-800">
                      {cert.nome || "—"}
                    </p>
                    {cert.emissor && (
                      <p className="text-[10px] text-zinc-500">
                        {cert.emissor}
                      </p>
                    )}
                  </div>
                  {cert.data && (
                    <p className="text-[10px] text-zinc-500 ml-2">
                      {cert.data}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {languages.some((l) => l.idioma) && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Idiomas
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages
                .filter((l) => l.idioma)
                .map((lang) => (
                  <span
                    key={lang.id}
                    className="text-xs text-zinc-700"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <span className="font-semibold">{lang.idioma}</span>{" "}
                    <span className="text-zinc-500">· {lang.nivel}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Placeholder vazio */}
        {!perfil &&
          skills.length === 0 &&
          !experiences.some((e) => e.cargo) &&
          !educations.some((e) => e.curso) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-3 size-10 text-zinc-300" />
              <p
                className="text-sm font-semibold text-zinc-400"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Preencha o formulário ao lado
              </p>
              <p
                className="text-xs text-zinc-400/60 mt-1"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Seu currículo aparecerá aqui em tempo real
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Experience {
  id: string;
  cargo: string;
  empresa: string;
  local: string;
  inicio: string;
  fim: string;
  atual: boolean;
  descricao: string;
}
interface Education {
  id: string;
  curso: string;
  instituicao: string;
  grau: string;
  inicio: string;
  fim: string;
  atual: boolean;
}
interface Certification {
  id: string;
  nome: string;
  emissor: string;
  data: string;
}
interface Language {
  id: string;
  idioma: string;
  nivel: string;
}

// Main Page
export default function ResumeGen() {
  const { user } = useAuthUserFirebase();

  const displayName = user?.displayName ?? "Desenvolvedor";
  const photoURL = user?.photoURL;
  const handle = user?.email?.split("@")[0] ?? "dev";

  // Contact
  const [nome, setNome] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [telefone, setTelefone] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [website, setWebsite] = useState("");

  // Profile
  const [perfil, setPerfil] = useState("");
  const [tituloProfissional, setTituloProfissional] = useState("");

  // Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  // Experiences
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: uid(),
      cargo: "",
      empresa: "",
      local: "",
      inicio: "",
      fim: "",
      atual: false,
      descricao: "",
    },
  ]);

  const addExperience = () =>
    setExperiences((prev) => [
      ...prev,
      {
        id: uid(),
        cargo: "",
        empresa: "",
        local: "",
        inicio: "",
        fim: "",
        atual: false,
        descricao: "",
      },
    ]);

  const removeExperience = (id: string) =>
    setExperiences((prev) => prev.filter((e) => e.id !== id));

  const updateExperience = (
    id: string,
    field: keyof Omit<Experience, "id">,
    value: string | boolean,
  ) =>
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  // Educations
  const [educations, setEducations] = useState<Education[]>([
    {
      id: uid(),
      curso: "",
      instituicao: "",
      grau: "",
      inicio: "",
      fim: "",
      atual: false,
    },
  ]);

  const addEducation = () =>
    setEducations((prev) => [
      ...prev,
      {
        id: uid(),
        curso: "",
        instituicao: "",
        grau: "",
        inicio: "",
        fim: "",
        atual: false,
      },
    ]);

  const removeEducation = (id: string) =>
    setEducations((prev) => prev.filter((e) => e.id !== id));

  const updateEducation = (
    id: string,
    field: keyof Omit<Education, "id">,
    value: string | boolean,
  ) =>
    setEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addCertification = () =>
    setCertifications((prev) => [
      ...prev,
      { id: uid(), nome: "", emissor: "", data: "" },
    ]);

  const removeCertification = (id: string) =>
    setCertifications((prev) => prev.filter((c) => c.id !== id));

  const updateCertification = (
    id: string,
    field: keyof Omit<Certification, "id">,
    value: string,
  ) =>
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );

  // Languages
  const [languages, setLanguages] = useState<Language[]>([
    { id: uid(), idioma: "", nivel: "Intermediário" },
  ]);

  const addLanguage = () =>
    setLanguages((prev) => [
      ...prev,
      { id: uid(), idioma: "", nivel: "Intermediário" },
    ]);

  const removeLanguage = (id: string) =>
    setLanguages((prev) => prev.filter((l) => l.id !== id));

  const updateLanguage = (
    id: string,
    field: keyof Omit<Language, "id">,
    value: string,
  ) =>
    setLanguages((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );

  // Filename
  const [fileName, setFileName] = useState("meu-curriculo");

  // Progress
  const sections = [
    { label: "Contato", done: !!(nome && email) },
    { label: "Perfil", done: perfil.length > 20 },
    { label: "Habilidades", done: skills.length > 0 },
    {
      label: "Experiências",
      done: experiences.some((e) => e.cargo && e.empresa),
    },
    {
      label: "Educação",
      done: educations.some((e) => e.curso && e.instituicao),
    },
  ];
  const completeness = Math.round(
    (sections.filter((s) => s.done).length / sections.length) * 100,
  );

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

      <main className="mx-auto max-w-[1600px] space-y-8 px-10 py-12">
        {/* ── PAGE HEADER ── */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/6 p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(8,8,16,0) 60%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 0% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2">
                <a
                  href="/dashboard"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  Dashboard
                </a>
                <ChevronRight className="size-3.5 text-zinc-600" />
                <span className="text-sm text-zinc-300">
                  Gerador de Currículo
                </span>
              </div>

              {/* Title */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <FileText className="size-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Gerador de Currículo
                </h1>
              </div>

              <p className="max-w-lg text-base text-zinc-400">
                Preencha suas informações e visualize seu currículo em tempo
                real. Faça o download em PDF quando estiver pronto.
              </p>
            </div>

            {/* Right: badge + progress */}
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <Badge
                variant="outline"
                className="border-blue-500/20 bg-blue-500/8 text-sm text-blue-300"
              >
                <Sparkles className="mr-1.5 size-3.5" />
                Currículo profissional em segundos
              </Badge>

              <div className="w-full sm:w-56">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Preenchimento</span>
                  <span className="text-xs font-semibold text-white">
                    {completeness}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {sections.map((s) => (
                    <span
                      key={s.label}
                      className={`flex items-center gap-1 text-xs ${
                        s.done ? "text-emerald-400" : "text-zinc-600"
                      }`}
                    >
                      <CheckCircle2 className="size-3" />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID: Form (left) + PDF Preview (right) ── */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* ──────────────────── LEFT: FORM ──────────────────── */}
          <div className="flex flex-col gap-6">
            {/* 1. CONTATO */}
            <section className={cardCls}>
              <SectionTitle
                icon={<User className="size-5 text-blue-400" />}
                title="Informações de Contato"
              />
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Nome completo *</label>
                  <input
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="joao@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      placeholder="+55 (11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="São Paulo, SP – Brasil"
                      value={localizacao}
                      onChange={(e) => setLocalizacao(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://github.com/usuario"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/usuario"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Website / Portfólio</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://seusite.com.br"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. PERFIL PROFISSIONAL */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FileText className="size-5 text-violet-400" />}
                title="Perfil Profissional"
              />
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Título Profissional</label>
                  <div className="relative">
                    <Award className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Ex: Desenvolvedor Back-End Sênior"
                      value={tituloProfissional}
                      onChange={(e) => setTituloProfissional(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Resumo profissional</label>
                  <textarea
                    rows={5}
                    placeholder="Descreva sua trajetória, principais habilidades e o que você busca na próxima oportunidade…"
                    value={perfil}
                    onChange={(e) => setPerfil(e.target.value)}
                    className={`${inputCls} resize-none leading-relaxed`}
                    maxLength={800}
                  />
                  <p className="mt-1.5 text-xs text-zinc-600">
                    {perfil.length} / 800 caracteres
                  </p>
                </div>
              </div>
            </section>

            {/* 3. HABILIDADES */}
            <section className={cardCls}>
              <SectionTitle
                icon={<Code2 className="size-5 text-emerald-400" />}
                title="Habilidades"
              />
              <div className="mt-6">
                <label className={labelCls}>Adicionar habilidade</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: React, TypeScript, Docker…"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className={`${inputCls} flex-1`}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    className="shrink-0 cursor-pointer h-12 gap-2 bg-blue-600 text-white hover:bg-blue-500"
                  >
                    <Plus className="size-4" />
                    Adicionar
                  </Button>
                </div>

                {skills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-sm text-blue-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills((prev) => prev.filter((s) => s !== skill))
                          }
                          className="cursor-pointer text-blue-400/60 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-600">
                    Nenhuma habilidade adicionada. Pressione Enter ou clique em
                    Adicionar.
                  </p>
                )}
              </div>
            </section>

            {/* 4. EXPERIÊNCIA */}
            <section className={cardCls}>
              <SectionTitle
                icon={<Briefcase className="size-5 text-amber-400" />}
                title="Experiência Profissional"
              />
              <div className="mt-6 flex flex-col gap-5">
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className={innerCardCls}>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Experiência {idx + 1}
                      </span>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="flex cursor-pointer items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="size-3.5" />
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Cargo / Título *</label>
                        <input
                          type="text"
                          placeholder="Ex: Desenvolvedor Front-End Sênior"
                          value={exp.cargo}
                          onChange={(e) =>
                            updateExperience(exp.id, "cargo", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Empresa *</label>
                        <input
                          type="text"
                          placeholder="Ex: Google"
                          value={exp.empresa}
                          onChange={(e) =>
                            updateExperience(exp.id, "empresa", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Localização</label>
                        <input
                          type="text"
                          placeholder="São Paulo, SP (Remoto)"
                          value={exp.local}
                          onChange={(e) =>
                            updateExperience(exp.id, "local", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Início</label>
                          <input
                            type="month"
                            value={exp.inicio}
                            onChange={(e) =>
                              updateExperience(exp.id, "inicio", e.target.value)
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Fim</label>
                          <input
                            type="month"
                            value={exp.fim}
                            disabled={exp.atual}
                            onChange={(e) =>
                              updateExperience(exp.id, "fim", e.target.value)
                            }
                            className={`${inputCls} disabled:opacity-40`}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <Toggle
                          checked={exp.atual}
                          onToggle={() =>
                            updateExperience(exp.id, "atual", !exp.atual)
                          }
                          label="Emprego atual"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          Descrição / Responsabilidades
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Descreva suas responsabilidades e conquistas nesta posição…"
                          value={exp.descricao}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "descricao",
                              e.target.value,
                            )
                          }
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className={dottedBtnCls}
                >
                  <Plus className="size-4" />
                  Adicionar Experiência
                </button>
              </div>
            </section>

            {/* 5. EDUCAÇÃO */}
            <section className={cardCls}>
              <SectionTitle
                icon={<GraduationCap className="size-5 text-sky-400" />}
                title="Educação"
              />
              <div className="mt-6 flex flex-col gap-5">
                {educations.map((edu, idx) => (
                  <div key={edu.id} className={innerCardCls}>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Formação {idx + 1}
                      </span>
                      {educations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="flex cursor-pointer items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="size-3.5" />
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Curso / Área *</label>
                        <input
                          type="text"
                          placeholder="Ex: Ciência da Computação"
                          value={edu.curso}
                          onChange={(e) =>
                            updateEducation(edu.id, "curso", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Instituição *</label>
                        <input
                          type="text"
                          placeholder="Ex: USP"
                          value={edu.instituicao}
                          onChange={(e) =>
                            updateEducation(
                              edu.id,
                              "instituicao",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Grau</label>
                        <input
                          type="text"
                          placeholder="Ex: Bacharelado"
                          value={edu.grau}
                          onChange={(e) =>
                            updateEducation(edu.id, "grau", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Início</label>
                          <input
                            type="month"
                            value={edu.inicio}
                            onChange={(e) =>
                              updateEducation(edu.id, "inicio", e.target.value)
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Fim</label>
                          <input
                            type="month"
                            value={edu.fim}
                            disabled={edu.atual}
                            onChange={(e) =>
                              updateEducation(edu.id, "fim", e.target.value)
                            }
                            className={`${inputCls} disabled:opacity-40`}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <Toggle
                          checked={edu.atual}
                          onToggle={() =>
                            updateEducation(edu.id, "atual", !edu.atual)
                          }
                          label="Em andamento"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className={dottedBtnCls}
                >
                  <Plus className="size-4" />
                  Adicionar Formação
                </button>
              </div>
            </section>

            {/* 6. CERTIFICAÇÕES */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FileBadge className="size-5 text-rose-400" />}
                title="Certificações"
              />
              <div className="mt-6 flex flex-col gap-5">
                {certifications.map((cert, idx) => (
                  <div key={cert.id} className={innerCardCls}>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Certificação {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id)}
                        className="flex cursor-pointer items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="size-3.5" />
                        Remover
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Nome da Certificação</label>
                        <input
                          type="text"
                          placeholder="Ex: AWS Solutions Architect"
                          value={cert.nome}
                          onChange={(e) =>
                            updateCertification(cert.id, "nome", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Emissor</label>
                        <input
                          type="text"
                          placeholder="Ex: Amazon Web Services"
                          value={cert.emissor}
                          onChange={(e) =>
                            updateCertification(
                              cert.id,
                              "emissor",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Data de emissão</label>
                        <input
                          type="month"
                          value={cert.data}
                          onChange={(e) =>
                            updateCertification(cert.id, "data", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCertification}
                  className={dottedBtnCls}
                >
                  <Plus className="size-4" />
                  Adicionar Certificação
                </button>
              </div>
            </section>

            {/* 7. IDIOMAS */}
            <section className={cardCls}>
              <SectionTitle
                icon={<Languages className="size-5 text-teal-400" />}
                title="Idiomas"
              />
              <div className="mt-6 flex flex-col gap-4">
                {languages.map((lang, idx) => (
                  <div key={lang.id} className="flex items-end gap-3">
                    <div className="flex-1">
                      {idx === 0 && <label className={labelCls}>Idioma</label>}
                      <input
                        type="text"
                        placeholder="Ex: Inglês"
                        value={lang.idioma}
                        onChange={(e) =>
                          updateLanguage(lang.id, "idioma", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="w-44">
                      {idx === 0 && <label className={labelCls}>Nível</label>}
                      <select
                        value={lang.nivel}
                        onChange={(e) =>
                          updateLanguage(lang.id, "nivel", e.target.value)
                        }
                        className={inputCls}
                      >
                        {[
                          "Básico",
                          "Intermediário",
                          "Avançado",
                          "Fluente",
                          "Nativo",
                        ].map((n) => (
                          <option key={n} value={n} className="bg-zinc-900">
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    {languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang.id)}
                        className="mb-0.5 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/6 bg-white/2 text-zinc-600 transition-colors hover:border-red-500/30 hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLanguage}
                  className={dottedBtnCls}
                >
                  <Plus className="size-4" />
                  Adicionar Idioma
                </button>
              </div>
            </section>
          </div>

          {/* ──────────────────── RIGHT: PDF PREVIEW ──────────────────── */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            {/* Toolbar: filename + download */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <FileText className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="nome-do-arquivo"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`${inputCls} pl-10`}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                  .pdf
                </span>
              </div>
              <Button
                type="button"
                onClick={() => {}}
                className="shrink-0 cursor-pointer gap-2 h-10 bg-blue-600 text-white hover:bg-blue-500"
              >
                <Download className="size-4" />
                Download
              </Button>
            </div>

            {/* PDF Container */}
            <div className="rounded-2xl border border-white/6 bg-zinc-950 p-4">
              {/* Browser-like top bar */}
              <div className="mb-3 flex items-center gap-2 px-1">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/10" />
                  <span className="size-2.5 rounded-full bg-white/10" />
                  <span className="size-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 rounded-md bg-white/4 px-3 py-1 text-center text-[10px] text-zinc-600">
                  {fileName || "meu-curriculo"}.pdf
                </div>
              </div>

              {/* Scrollable PDF page */}
              <div className="max-h-[900px] overflow-y-auto rounded-lg">
                <PdfPreview
                  nome={nome}
                  tituloProfissional={tituloProfissional}
                  email={email}
                  telefone={telefone}
                  localizacao={localizacao}
                  githubUrl={githubUrl}
                  linkedinUrl={linkedinUrl}
                  perfil={perfil}
                  skills={skills}
                  experiences={experiences}
                  educations={educations}
                  certifications={certifications}
                  languages={languages}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
