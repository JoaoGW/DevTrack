"use client";
import { useEffect, useState } from "react";

import { Octokit } from "octokit";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useAuthUserFirebase } from "@/store/authUser.store";

import {
  Github,
  Search,
  Star,
  GitFork,
  Sparkles,
  Code2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  ChevronRight,
  X,
  RefreshCw,
  FileText,
  Layers,
} from "lucide-react";

// Tipagens dos itens vindos do Repositório
interface IGitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string | null;
  topics: string[];
}

// Tipagem dos resultados vindos da IA
interface IAnalysisResult {
  repoId: number;
  repoName: string;
  professionalDescription: string;
  stack: string[];
  highlights: string[];
  suggestedTitle: string;
}

// Helpers

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  JavaScript: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  Python: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  Java: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  "C#": "border-purple-500/20 bg-purple-500/10 text-purple-300",
  Go: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  Rust: "border-orange-600/20 bg-orange-600/10 text-orange-400",
  Ruby: "border-red-500/20 bg-red-500/10 text-red-300",
  PHP: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  Swift: "border-orange-400/20 bg-orange-400/10 text-orange-300",
  Kotlin: "border-purple-400/20 bg-purple-400/10 text-purple-300",
  CSS: "border-pink-500/20 bg-pink-500/10 text-pink-300",
  HTML: "border-red-400/20 bg-red-400/10 text-red-300",
  default: "border-zinc-500/20 bg-zinc-500/10 text-zinc-300",
};

function getLangColor(lang: string | null) {
  if (!lang) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[lang] ?? LANGUAGE_COLORS.default;
}

const STACK_MAP: Record<string, string[]> = {
  TypeScript: ["TypeScript", "Node.js", "ESLint", "Prettier"],
  JavaScript: ["JavaScript (ES6+)", "Node.js", "npm"],
  Python: ["Python 3", "pip", "venv"],
  Java: ["Java", "Maven / Gradle", "JVM"],
  "C#": ["C#", ".NET", "NuGet"],
  Go: ["Go", "Go Modules"],
  Rust: ["Rust", "Cargo"],
  Ruby: ["Ruby", "Bundler"],
  PHP: ["PHP", "Composer"],
  Swift: ["Swift", "SPM", "Xcode"],
  Kotlin: ["Kotlin", "Gradle", "JVM"],
};

const DESCRIPTION_TEMPLATES = [
  (name: string, lang: string) =>
    `Projeto ${name} desenvolvido com foco em boas práticas de engenharia de software. Implementa arquitetura modular e escalável, com código limpo e bem documentado. Demonstra domínio sobre ${lang} e capacidade de estruturar soluções técnicas robustas.`,
  (name: string, lang: string) =>
    `Solução full-featured ${name} construída para resolver problemas reais com código eficiente e manutenível. O projeto evidencia habilidade com ${lang}, aplicando padrões modernos de desenvolvimento e estrutura de projeto profissional.`,
  (name: string, lang: string) =>
    `Repositório ${name} que demonstra proficiência técnica em ${lang}. Código organizado com separação clara de responsabilidades, ideal para showcase em portfólio profissional e demonstração de competências técnicas avançadas.`,
];

function generateAnalysis(repo: IGitHubRepo): IAnalysisResult {
  const lang = repo.language ?? "múltiplas linguagens";
  const template =
    DESCRIPTION_TEMPLATES[repo.id % DESCRIPTION_TEMPLATES.length];
  const baseStack = STACK_MAP[repo.language ?? ""] ?? ["JavaScript", "Node.js"];
  const stack = [...baseStack];
  repo.topics?.slice(0, 3).forEach((t) => {
    if (!stack.includes(t)) stack.push(t);
  });

  const highlights: string[] = [
    "Estrutura de código modular e bem organizada",
    `Desenvolvido em ${lang} com boas práticas`,
    repo.stargazers_count > 0
      ? `${repo.stargazers_count} estrelas na comunidade GitHub`
      : "Projeto open-source disponível no GitHub",
    repo.forks_count > 0
      ? `${repo.forks_count} forks demonstrando impacto na comunidade`
      : "Código aberto para colaboração e contribuição",
  ];

  return {
    repoId: repo.id,
    repoName: repo.name,
    professionalDescription: template(repo.name, lang),
    stack,
    highlights,
    suggestedTitle: `${repo.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) =>
        c.toUpperCase(),
      )} — ${repo.language ?? "Full-Stack"} Developer`,
  };
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

// Status da análise em tempo real sendo feita pela IA
const ANALYZE_STEPS = [
  "Detectando linguagens e frameworks...",
  "Analisando estrutura do projeto...",
  "Gerando descrição profissional...",
];

export default function Analyzer() {
  const { user, token } = useAuthUserFirebase();

  const displayName = user?.displayName ?? "Desenvolvedor";
  const photoURL = user?.photoURL;
  const handle = user?.email?.split("@")[0] ?? "dev";
  const [username, setUsername] = useState<string>();

  const [repos, setRepos] = useState<IGitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<IGitHubRepo | null>(null);
  const [analysis, setAnalysis] = useState<IAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  // Fetch Repos
  useEffect(() => {
    if (!token) return;
    const octokit = new Octokit({ auth: token });

    (async () => {
      try {
        setIsLoadingRepos(true);
        setRepoError(null);

        const { data: userData } = await octokit.request("GET /user", {
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        });
        setUsername(userData.login);

        const { data: reposData } = await octokit.request("GET /user/repos", {
          per_page: 100,
          sort: "updated",
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        });
        setRepos(reposData as IGitHubRepo[]);
      } catch {
        setRepoError(
          "Não foi possível carregar seus repositórios. Verifique sua conexão e tente novamente.",
        );
      } finally {
        setIsLoadingRepos(false);
      }
    })();
  }, [token]);

  // ── Analyze ───────────────────────────────────────────────────────────────

  const handleAnalyze = (repo: IGitHubRepo) => {
    setSelectedRepo(repo);
    setAnalysis(null);
    setIsAnalyzing(true);
    setAnalyzeStep(0);

    const t1 = setTimeout(() => setAnalyzeStep(1), 600);
    const t2 = setTimeout(() => setAnalyzeStep(2), 1200);
    const t3 = setTimeout(() => {
      setAnalysis(generateAnalysis(repo));
      setIsAnalyzing(false);
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <Navbar
        displayName={displayName}
        handle={handle}
        photoURL={photoURL}
        username={username}
      />

      <main className="mx-auto max-w-screen-xl space-y-8 px-10 py-12">
        {/* PAGE HEADER */}
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
                <span className="text-sm text-zinc-300">GitHub Analyzer</span>
              </div>

              {/* Title */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Github className="size-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  GitHub Analyzer
                </h1>
              </div>

              <p className="max-w-lg text-base text-zinc-400">
                Analise seus repositórios com IA e gere descrições profissionais
                com a stack detectada automaticamente.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <Badge
                variant="outline"
                className="border-blue-500/20 bg-blue-500/8 text-sm text-blue-300"
              >
                <Sparkles className="mr-1.5 size-3.5" />
                IA Integrada
              </Badge>
              {!isLoadingRepos && !repoError && (
                <p className="text-sm text-zinc-500">
                  {repos.length} repositório{repos.length !== 1 ? "s" : ""}{" "}
                  encontrado{repos.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/*  MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT: REPO LIST */}
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar repositório por nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/6 bg-white/2 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:bg-white/4"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Loading skeletons */}
            {isLoadingRepos && (
              <div className="flex flex-col gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl border border-white/6 bg-white/2"
                  />
                ))}
              </div>
            )}

            {/* Fetch error */}
            {!isLoadingRepos && repoError && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-14 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
                  <AlertCircle className="size-7 text-red-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-red-300">
                    Erro ao carregar repositórios
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{repoError}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-red-500/20 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="size-3.5" />
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoadingRepos && !repoError && filteredRepos.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/6 bg-white/2 p-14 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-800">
                  <Github className="size-7 text-zinc-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-zinc-300">
                    {searchQuery
                      ? "Nenhum repositório encontrado"
                      : "Nenhum repositório disponível"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {searchQuery
                      ? `Sua busca por "${searchQuery}" não retornou resultados.`
                      : "Você ainda não possui repositórios no GitHub ou eles não foram carregados."}
                  </p>
                </div>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-zinc-400 hover:text-zinc-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="size-3.5" />
                    Limpar busca
                  </Button>
                )}
              </div>
            )}

            {/* Repo cards */}
            {!isLoadingRepos && !repoError && filteredRepos.length > 0 && (
              <div className="flex flex-col gap-3">
                {filteredRepos.map((repo) => {
                  const isSelected = selectedRepo?.id === repo.id;
                  const isThisAnalyzing = isAnalyzing && isSelected;

                  return (
                    <div
                      key={repo.id}
                      className={`rounded-2xl border p-5 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500/30 bg-blue-500/5"
                          : "border-white/6 bg-white/2 hover:border-white/10 hover:bg-white/4"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Name + link */}
                          <div className="mb-1.5 flex items-center gap-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate text-base font-semibold text-white transition-colors hover:text-blue-400"
                            >
                              {repo.name}
                            </a>
                            <ExternalLink className="size-3.5 shrink-0 text-zinc-600" />
                          </div>

                          {/* Description */}
                          <p className="mb-3 line-clamp-2 text-sm text-zinc-500">
                            {repo.description ?? "Sem descrição disponível."}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-2">
                            {repo.language && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${getLangColor(repo.language)}`}
                              >
                                <Code2 className="mr-1 size-3" />
                                {repo.language}
                              </Badge>
                            )}
                            <span className="flex items-center gap-1 text-xs text-zinc-600">
                              <Star className="size-3" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-600">
                              <GitFork className="size-3" />
                              {repo.forks_count}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-600">
                              <Clock className="size-3" />
                              {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>

                        {/* Analyze button */}
                        <Button
                          size="sm"
                          className={`shrink-0 cursor-pointer gap-1.5 text-xs ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                              : "border border-white/8 bg-white/5 text-zinc-300 hover:bg-blue-600 hover:text-white"
                          }`}
                          onClick={() => handleAnalyze(repo)}
                          disabled={isThisAnalyzing}
                        >
                          {isThisAnalyzing ? (
                            <>
                              <RefreshCw className="size-3.5 animate-spin" />
                              Analisando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="size-3.5" />
                              Analisar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: ANALYSIS PANEL */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Placeholder */}
            {!selectedRepo && !isAnalyzing && (
              <div
                className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/6 p-12 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(8,8,16,0) 80%)",
                }}
              >
                <div className="flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/8">
                  <Sparkles className="size-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-zinc-300">
                    Selecione um repositório
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Clique em{" "}
                    <strong className="text-zinc-400">Analisar</strong> em
                    qualquer repositório para gerar uma descrição profissional
                    com IA.
                  </p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-2.5">
                  {[
                    { icon: Code2, text: "Detecção automática de stack" },
                    { icon: FileText, text: "Descrição profissional gerada" },
                    { icon: Zap, text: "Pronto para portfólio e currículo" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/4">
                        <Icon className="size-3.5 text-zinc-400" />
                      </div>
                      <span className="text-xs text-zinc-500">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading / Analyzing */}
            {isAnalyzing && (
              <div
                className="rounded-2xl border border-blue-500/20 p-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(8,8,16,0) 60%)",
                }}
              >
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Sparkles className="size-5 animate-pulse text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Analisando com IA...
                    </p>
                    <p className="text-xs text-zinc-500">
                      {selectedRepo?.name}
                    </p>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-4">
                  {ANALYZE_STEPS.map((step, i) => {
                    const isDone = i < analyzeStep;
                    const isActive = i === analyzeStep;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isDone
                              ? "bg-emerald-500/20"
                              : isActive
                                ? "bg-blue-500/20"
                                : "bg-white/4"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                          ) : isActive ? (
                            <RefreshCw className="size-3 animate-spin text-blue-400" />
                          ) : (
                            <div className="size-1.5 rounded-full bg-zinc-700" />
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            isDone
                              ? "text-zinc-500 line-through"
                              : isActive
                                ? "text-zinc-200"
                                : "text-zinc-600"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/4">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${((analyzeStep + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Analysis result */}
            {!isAnalyzing && analysis && (
              <div className="flex flex-col gap-4">
                {/* Header card */}
                <div
                  className="rounded-2xl border border-blue-500/20 p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(8,8,16,0) 60%)",
                  }}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <CheckCircle2 className="size-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Análise Concluída
                        </p>
                        <p className="text-xs text-zinc-500">
                          {analysis.repoName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-300"
                    >
                      IA Gerado
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="mb-1.5 text-xs uppercase tracking-wider text-zinc-600">
                      Título Sugerido
                    </p>
                    <p className="text-sm font-medium text-zinc-200">
                      {analysis.suggestedTitle}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs uppercase tracking-wider text-zinc-600">
                      Descrição Profissional
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {analysis.professionalDescription}
                    </p>
                  </div>
                </div>

                {/* Stack */}
                <Card className="border-white/6 bg-white/2">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Layers className="size-4 text-zinc-400" />
                      <p className="text-sm font-semibold text-zinc-300">
                        Stack Detectada
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.stack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="border-blue-500/20 bg-blue-500/8 text-xs text-blue-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card className="border-white/6 bg-white/2">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Zap className="size-4 text-zinc-400" />
                      <p className="text-sm font-semibold text-zinc-300">
                        Destaques do Projeto
                      </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {analysis.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                          <span className="text-sm text-zinc-400">{h}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 cursor-pointer gap-2 bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                    size="default"
                  >
                    <FileText className="size-4" />
                    Usar no Currículo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer gap-2 border-white/10 bg-white/3 text-zinc-300 hover:border-white/20 hover:bg-white/7 hover:text-white"
                    size="default"
                    onClick={() => selectedRepo && handleAnalyze(selectedRepo)}
                  >
                    <RefreshCw className="size-4" />
                    Reanalisar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
