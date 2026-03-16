"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImportProjectModal } from "@/components/Modals/importProjectModal";

import { useAuthUserFirebase } from "@/store/authUser.store";

import { Certification } from "@/app/contentData/portfolioGen/interfaces/ICertification";
import { Education } from "@/app/contentData/portfolioGen/interfaces/IEducation";
import { Experience } from "@/app/contentData/portfolioGen/interfaces/IExperience";
import { Language } from "@/app/contentData/portfolioGen/interfaces/ILanguage";
import { Project } from "@/app/contentData/portfolioGen/interfaces/IProject";

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
  Link as LinkIcon,
  LayoutTemplate,
  CheckCircle2,
  FolderGit2,
  FileBadge,
} from "lucide-react";

// Helpers
const uid = () => Math.random().toString(36).slice(2, 9);
const inputCls =
  "w-full rounded-xl border border-white/6 bg-white/2 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:bg-white/4";
const labelCls = "block text-sm font-medium text-zinc-300 mb-1.5";
const cardCls = "rounded-2xl border border-white/6 bg-white/2 p-8";
const innerCardCls = "rounded-xl border border-white/6 bg-white/2 p-5";
const dottedBtnCls =
  "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3.5 text-sm text-zinc-500 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/4 hover:text-blue-300 cursor-pointer";

// Sub-component: Section Title
function SectionTitle({
  icon,
  title,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/4">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {badge && <div>{badge}</div>}
    </div>
  );
}

// Sub-component: Toggle Switch
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

// Main Component
export default function PortfolioGen() {
  const { user } = useAuthUserFirebase();

  const displayName = user?.displayName ?? "Desenvolvedor";
  const photoURL = user?.photoURL;
  const handle = user?.email?.split("@")[0] ?? "dev";

  const router = useRouter();

  const [showImportProject, setShowImportProject] = useState<boolean>(false);
  const [availableProject, setAvailableProject] = useState<
    Record<string, string | null>
  >({});

  // 1. Contato
  const [nome, setNome] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [telefone, setTelefone] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // 2. Perfil Profissional
  const [perfil, setPerfil] = useState<string>("");
  const [tituloProfissional, setTituloProfissional] = useState<string>("");

  // 3. Habilidades
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  // 4. Experiências
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

  // 5. Educação
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

  // 6. Certificações
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addCertification = () =>
    setCertifications((prev) => [
      ...prev,
      { id: uid(), nome: "", emissor: "", data: "", url: "" },
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

  // 7. Idiomas
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

  // 8. Projetos
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = () =>
    setProjects((prev) => [
      ...prev,
      {
        id: uid(),
        nome: "",
        descricao: "",
        tecnologias: "",
        url: "",
        github: "",
      },
    ]);

  const importProject = () => {
    // Resgata os repositórios que já possuem descrição gerada com IA
    const items: Record<string, string | null> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("PROJECT_")) {
        items[key] = localStorage.getItem(key);
      }
    }

    setAvailableProject(items);

    setShowImportProject(true);
    setProjects((prev) => [
      ...prev,
      {
        id: uid(),
        nome: "",
        descricao: "",
        tecnologias: "",
        url: "",
        github: "",
      },
    ]);
  };

  const removeProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  const updateProject = (
    id: string,
    field: keyof Omit<Project, "id">,
    value: string,
  ) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

  // Progresso
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
    { label: "Projetos", done: projects.some((p) => p.nome) },
  ];
  const completeness = Math.round(
    (sections.filter((s) => s.done).length / sections.length) * 100,
  );

  const handleGeneratePortfolio = async () => {
    const payload = {
      userId: user?.uid,
      nome,
      email,
      telefone,
      localizacao,
      github: githubUrl,
      linkedin: linkedinUrl,
      website,
      perfil,
      tituloProfissional,
      skills,
      experiences,
      educations,
      certifications,
      languages,
      projects,
    };

    const response = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      router.push("/tools/profile");
    } else {
      alert("Ocorreu uma falha ao enviar suas informações para o servidor");
    }
  };

  // Verifica se este usuário já possui informações salvas no database
  useEffect(() => {
    if (!user?.uid) return;

    async function loadPortfolio() {
      try {
        const response = await fetch(`/api/portfolio?userId=${user!.uid}`);
        if (response.status === 404) return; // sem portfólio ainda, formulário ficará em branco

        const data = await response.json();
        if (!data.success || !data.data) return;

        const p = data.data;
        if (p.nome) setNome(p.nome);
        if (p.email) setEmail(p.email);
        if (p.telefone) setTelefone(p.telefone);
        if (p.localizacao) setLocalizacao(p.localizacao);
        if (p.github) setGithubUrl(p.github);
        if (p.linkedin) setLinkedinUrl(p.linkedin);
        if (p.website) setWebsite(p.website);
        if (p.perfil) setPerfil(p.perfil);
        if (p.titulo_profissional) setTituloProfissional(p.titulo_profissional);
        if (p.skills) setSkills(JSON.parse(p.skills));
        if (p.experiencias) setExperiences(JSON.parse(p.experiencias));
        if (p.educacoes) setEducations(JSON.parse(p.educacoes));
        if (p.certificacoes) setCertifications(JSON.parse(p.certificacoes));
        if (p.idiomas) setLanguages(JSON.parse(p.idiomas));
        if (p.projetos) setProjects(JSON.parse(p.projetos));
      } catch {
        // falha silenciosa (o formulário ficará em branco)
      }
    }
    loadPortfolio();
  }, [user?.uid]);

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

      <main className="mx-auto max-w-screen-xl space-y-8 px-10 py-12">
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
                  Gerador de Portfólio
                </span>
              </div>

              {/* Title */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <LayoutTemplate className="size-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Gerador de Portfólio Online
                </h1>
              </div>

              <p className="max-w-lg text-base text-zinc-400">
                Preencha suas informações profissionais e gere um portfólio
                personalizado pronto para impressionar recrutadores.
              </p>
            </div>

            {/* Right: badge + progress */}
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <Badge
                variant="outline"
                className="border-blue-500/20 bg-blue-500/8 text-sm text-blue-300"
              >
                <Sparkles className="mr-1.5 size-3.5" />
                Destaque-se em relação aos demais candidatos
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

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_272px]">
          {/* ── LEFT: FORM ── */}
          <div className="flex flex-col gap-6">
            {/* ── 1. INFORMAÇÕES DE CONTATO ── */}
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
                    required
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
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      placeholder="+55 (11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className={`${inputCls} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="São Paulo, SP - Brasil"
                      value={localizacao}
                      onChange={(e) => setLocalizacao(e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>GitHub *</label>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://github.com/usuario"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`${inputCls} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>LinkedIn *</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/usuario"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className={`${inputCls} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>
                    Website / Portfólio pessoal
                  </label>
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

            {/* ── 2. PERFIL PROFISSIONAL ── */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FileText className="size-5 text-violet-400" />}
                title="Perfil Profissional"
              />

              <div className="mt-6">
                <label className={labelCls}>Resumo profissional</label>
                <textarea
                  rows={5}
                  placeholder="Descreva sua trajetória, principais habilidades e o que você busca na próxima oportunidade..."
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value)}
                  className={`${inputCls} resize-none leading-relaxed`}
                  maxLength={800}
                />
                <p className="mt-2 text-xs text-zinc-600">
                  {perfil.length} caracteres · recomendado: 500–750
                </p>
              </div>

              <div className="sm:col-span-2 mt-4">
                <label className={labelCls}>Título Profissional</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Desenvolvedor Back-End Júnior"
                    value={tituloProfissional.toUpperCase()}
                    onChange={(e) => setTituloProfissional(e.target.value)}
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
            </section>

            {/* ── 3. HABILIDADES ── */}
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
                    className="shrink-0 cursor-pointer gap-2 bg-blue-600 text-white hover:bg-blue-500"
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
                          onClick={() => removeSkill(skill)}
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

            {/* ── 4. EXPERIÊNCIAS ── */}
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
                          placeholder="Descreva suas principais responsabilidades e conquistas nesta posição…"
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

            {/* ── 5. EDUCAÇÃO ── */}
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
                          placeholder="Ex: USP / FIAP / Rocketseat"
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
                        <select
                          value={edu.grau}
                          onChange={(e) =>
                            updateEducation(edu.id, "grau", e.target.value)
                          }
                          className={`${inputCls} appearance-none`}
                        >
                          <option value="" disabled className="bg-[#080810]">
                            Selecione...
                          </option>
                          {[
                            "Técnico",
                            "Tecnólogo",
                            "Bacharelado",
                            "Licenciatura",
                            "Pós-Graduação",
                            "MBA",
                            "Mestrado",
                            "Doutorado",
                            "Curso livre",
                          ].map((g) => (
                            <option key={g} value={g} className="bg-[#080810]">
                              {g}
                            </option>
                          ))}
                        </select>
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
                          <label className={labelCls}>Conclusão</label>
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

            {/* ── 6. CERTIFICAÇÕES ── */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FileBadge className="size-5 text-rose-400" />}
                title="Certificações"
                badge={
                  <span className="text-sm font-medium text-zinc-500">
                    {certifications.length} / 6
                  </span>
                }
              />

              <div className="mt-6 flex flex-col gap-5">
                {certifications.length === 0 && (
                  <p className="text-sm text-zinc-600">
                    Nenhuma certificação adicionada. Clique abaixo para
                    adicionar.
                  </p>
                )}

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
                        <label className={labelCls}>
                          Nome da Certificação *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: AWS Certified Developer"
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
                        <label className={labelCls}>Data de Conclusão</label>
                        <input
                          type="month"
                          value={cert.data}
                          onChange={(e) =>
                            updateCertification(cert.id, "data", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>URL do Certificado</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/certificado.png"
                            value={cert.url}
                            onChange={(e) =>
                              updateCertification(
                                cert.id,
                                "url",
                                e.target.value,
                              )
                            }
                            className={`${inputCls} pl-10`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {certifications.length < 6 ? (
                  <button
                    type="button"
                    onClick={addCertification}
                    className={dottedBtnCls}
                  >
                    <Plus className="size-4" />
                    Adicionar Certificação
                  </button>
                ) : null}
              </div>
            </section>

            {/* ── 7. IDIOMAS ── */}
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
                        placeholder="Ex: Inglês, Espanhol…"
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
                        className={`${inputCls} appearance-none`}
                      >
                        {[
                          "Básico",
                          "Intermediário",
                          "Avançado",
                          "Fluente",
                          "Nativo",
                        ].map((n) => (
                          <option key={n} value={n} className="bg-[#080810]">
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    {languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang.id)}
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/6 bg-white/2 text-zinc-600 transition-colors hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
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

            {/* ── 8. PROJETOS ── */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FolderGit2 className="size-5 text-purple-400" />}
                title="Projetos"
                badge={
                  <span className="text-sm font-medium text-zinc-500">
                    {projects.length} / 3
                  </span>
                }
              />

              <div className="mt-6 flex flex-col gap-5">
                {projects.length === 0 && (
                  <p className="text-sm text-zinc-600">
                    Nenhum projeto adicionado. Clique abaixo para adicionar.
                  </p>
                )}

                {projects.map((proj, idx) => (
                  <div key={proj.id} className={innerCardCls}>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Projeto {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="flex cursor-pointer items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="size-3.5" />
                        Remover
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Nome do Projeto *</label>
                        <input
                          type="text"
                          placeholder="Ex: DevTrack"
                          value={proj.nome}
                          onChange={(e) =>
                            updateProject(proj.id, "nome", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>
                          Tecnologias utilizadas *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: React, Node.js, PostgreSQL"
                          value={proj.tecnologias}
                          onChange={(e) =>
                            updateProject(
                              proj.id,
                              "tecnologias",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelCls}>URL do Projeto</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="url"
                            placeholder="https://seusite.com"
                            value={proj.url}
                            onChange={(e) =>
                              updateProject(proj.id, "url", e.target.value)
                            }
                            className={`${inputCls} pl-10`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Repositório GitHub *</label>
                        <div className="relative">
                          <Github className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="url"
                            placeholder="https://github.com/user/repo"
                            value={proj.github}
                            onChange={(e) =>
                              updateProject(proj.id, "github", e.target.value)
                            }
                            className={`${inputCls} pl-10`}
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          Descrição do Projeto *
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Descreva o objetivo, funcionalidades e impacto do projeto…"
                          value={proj.descricao}
                          onChange={(e) =>
                            updateProject(proj.id, "descricao", e.target.value)
                          }
                          className={`${inputCls} resize-none`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length < 3 ? (
                  <>
                    <button
                      type="button"
                      onClick={addProject}
                      className={dottedBtnCls}
                    >
                      <Plus className="size-4" />
                      Adicionar Projeto
                    </button>
                    <button
                      type="button"
                      onClick={importProject}
                      className={dottedBtnCls}
                    >
                      <Plus className="size-4" />
                      Importar Projeto
                    </button>
                  </>
                ) : null}
              </div>
            </section>

            {/* ── CTA GERAR ── */}
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/6 bg-white/2 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <Sparkles className="size-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Pronto para gerar seu portfólio?
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Revise suas informações e clique em gerar para criar seu
                  portfólio profissional.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="mt-1 cursor-pointer gap-2 bg-blue-600 px-10 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                onClick={handleGeneratePortfolio}
              >
                <Sparkles className="size-4" />
                Gerar Portfólio
              </Button>
            </div>
          </div>

          {/* ── RIGHT: SIDEBAR ── */}
          <aside className="hidden lg:flex lg:flex-col lg:gap-4">
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Progress card */}
              <div className="rounded-2xl border border-white/6 bg-white/2 p-6">
                <h3 className="mb-0.5 text-sm font-semibold text-white">
                  Progresso
                </h3>
                <p className="mb-4 text-xs text-zinc-500">Seções preenchidas</p>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <p className="mt-1.5 text-right text-xs font-semibold text-white">
                  {completeness}%
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {sections.map((s) => (
                    <li
                      key={s.label}
                      className={`flex items-center gap-2 text-sm ${
                        s.done ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${
                          s.done ? "bg-emerald-400" : "bg-zinc-700"
                        }`}
                      />
                      {s.label}
                      {s.done && (
                        <CheckCircle2 className="ml-auto size-3.5 text-emerald-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips card */}
              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/4 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-amber-200">
                    Dicas
                  </h3>
                </div>
                <ul className="flex flex-col gap-2 text-xs text-zinc-400">
                  <li>• Use o perfil para se diferenciar dos demais</li>
                  <li>• Adicione no mínimo 5 habilidades relevantes</li>
                  <li>
                    • Descreva experiências com números e resultados concretos
                  </li>
                  <li>• Projetos com links são mais valorizados</li>
                  <li>• Certificações recentes aumentam sua credibilidade</li>
                  <li>• Inglês avançado/fluente é um grande diferencial</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
        {showImportProject === true ? (
          <ImportProjectModal
            onClose={() => setShowImportProject(false)}
            content={availableProject}
            onImport={(projectName, description) => {
              setProjects((prev) => {
                const last = prev[prev.length - 1];
                if (!last) return prev;
                return prev.map((p) =>
                  p.id === last.id
                    ? { ...p, nome: projectName, descricao: description }
                    : p,
                );
              });
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
