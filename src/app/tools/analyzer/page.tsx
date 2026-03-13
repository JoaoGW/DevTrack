"use client";
import { useEffect, useState } from "react";

import { Octokit } from "octokit";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useAuthUserFirebase } from "@/store/authUser.store";

import { IAnalysisResult } from "@/app/contentData/analyze/interfaces/IAnalysisResult";
import { IGitHubRepo } from "@/app/contentData/analyze/interfaces/IGitHubRepo";
import { getLangColor } from "@/app/contentData/analyze/utils/helpers";
import { STACK_MAP } from "@/app/contentData/analyze/stackMap";

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

// Constrói o resultado da análise a partir de uma descrição já disponível (cache ou IA)
function buildAnalysisResult(
  repo: IGitHubRepo,
  description: string,
): IAnalysisResult {
  const baseStack = STACK_MAP[repo.language ?? ""] ?? [
    "Não foi possível detectar a stack deste projeto",
    "Certifique-se de que há código na branch default",
  ];
  const stack = [...baseStack];
  repo.topics?.slice(0, 3).forEach((t) => {
    if (!stack.includes(t)) stack.push(t);
  });

  const lang = repo.language ?? "múltiplas linguagens";
  const highlights: string[] = [];
  if (repo.language) {
    highlights.push(
      `Desenvolvido em ${lang} com algumas boas práticas de software`,
    );
  }
  if (repo.stargazers_count > 0) {
    highlights.push(`${repo.stargazers_count} estrelas na comunidade GitHub`);
  }
  if (repo.forks_count > 0) {
    highlights.push(
      `${repo.forks_count} forks demonstrando impacto na comunidade`,
    );
  }
  const topics = repo.topics ?? [];
  if (topics.length > 0) {
    highlights.push(`Principais tópicos: ${topics.slice(0, 3).join(", ")}`);

    const lowerTopics = topics.map((t) => t.toLowerCase());
    if (
      lowerTopics.includes("documentation") ||
      lowerTopics.includes("docs") ||
      lowerTopics.includes("readme")
    ) {
      highlights.push("Boa documentação e README com instruções de uso");
    }
    if (
      lowerTopics.includes("tests") ||
      lowerTopics.includes("unit-tests") ||
      lowerTopics.includes("testing") ||
      lowerTopics.includes("jest")
    ) {
      highlights.push("Cobertura de testes automatizados e exemplos de testes");
    }
    if (
      lowerTopics.includes("ci") ||
      lowerTopics.includes("github-actions") ||
      lowerTopics.includes("ci/cd") ||
      lowerTopics.includes("actions")
    ) {
      highlights.push(
        "Pipeline de CI/CD configurado (workflows e integrações)",
      );
    }
    if (
      lowerTopics.includes("security") ||
      lowerTopics.includes("auth") ||
      lowerTopics.includes("oauth") ||
      lowerTopics.includes("jwt")
    ) {
      highlights.push("Boas práticas de segurança e controle de acesso");
    }
    if (
      lowerTopics.includes("architecture") ||
      lowerTopics.includes("modular") ||
      lowerTopics.includes("monorepo")
    ) {
      highlights.push("Arquitetura pensada para manutenção e escalabilidade");
    }
  }
  if (repo.updated_at) {
    try {
      const updated = new Date(repo.updated_at);
      const daysAgo = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo < 90) {
        highlights.push("Ativo e mantido recentemente");
      }
    } catch (e) {
      // ignorar se data inválida
    }
  }
  if (highlights.length === 0) {
    highlights.push("Projeto open-source disponível no GitHub");
    highlights.push("Uso consistente de padrões e convenções de código");
  }

  return {
    repoId: repo.id,
    repoName: repo.name,
    professionalDescription: description,
    stack,
    highlights,
    suggestedTitle: `${repo.name
      .replace(/-/g, " ")
      .replace("_", " ")
      .replace(/\b\w/g, (c) =>
        c.toUpperCase(),
      )} - Projeto ${repo.language ?? "Full-Stack"}`,
  };
}

// Solicita a análise do repositório à IA, combinando com informações dinâmicas sobre stats do repositório
async function generateAnalysis(repo: IGitHubRepo): Promise<IAnalysisResult> {
  const cachedDescription = localStorage.getItem(repo.name);
  if (cachedDescription !== null) {
    return buildAnalysisResult(repo, cachedDescription);
  }

  // Requisição ao modelo Mini da OpenAI
  const apiResponse = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      devInput:
        "[ROLE]:Analista TechLead; [CONTEXT]:Você está ajudando Devs a arrumar emprego montando um currículo; [TASK]:Escreva uma descrição detalhada e chamativa para a seção de projetos do currículo seguindo o projeto do link GitHub enviado; [OUTPUT]:Descrição de até 350 caracteres, mínimo 300 caracteres. No final da descrição, liste as tecnologias neste modelo: Tecnologias Utilizadas: Tech1, Tech2, etc; [RULES]:Nunca invente informações.",
      miniInput: `Gere a descrição de: ${repo.html_url}`,
      maxTokens: 100,
    }),
  });
  const { content } = await apiResponse.json();
  localStorage.setItem(repo.name, content);
  return buildAnalysisResult(repo, content);
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
  const [cachedRepoNames, setCachedRepoNames] = useState<Set<string>>(
    new Set(),
  );

  // Fetch Repos (públicos e privados) do GitHub daquele usuário
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
        const cachedSet = new Set<string>(
          (reposData as IGitHubRepo[])
            .filter((r) => localStorage.getItem(r.name) !== null)
            .map((r) => r.name),
        );
        setCachedRepoNames(cachedSet);
      } catch {
        setRepoError(
          "Não foi possível carregar seus repositórios. Verifique sua conexão e tente novamente.",
        );
      } finally {
        setIsLoadingRepos(false);
      }
    })();
  }, [token]);

  // Simulação de análise com await para resposta da IA
  const handleAnalyze = (repo: IGitHubRepo) => {
    setSelectedRepo(repo);
    setAnalysis(null);
    setIsAnalyzing(true);
    setAnalyzeStep(0);

    const t1 = setTimeout(() => setAnalyzeStep(1), 600);
    const t2 = setTimeout(() => setAnalyzeStep(2), 1200);
    const t3 = setTimeout(async () => {
      const result = await generateAnalysis(repo);
      setAnalysis(result);
      setCachedRepoNames((prev) => {
        const s = new Set(prev);
        s.add(repo.name);
        return s;
      });
      setIsAnalyzing(false);
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Filtro de repositórios com a Search Bar
  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                com a stack detectada automaticamente. Adicione seus projetos ao
                seu currículo e portfólio online.
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 hover:cursor-pointer"
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
                    className="gap-2 text-zinc-400 hover:bg-red-400 hover:text-white cursor-pointer"
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
                  const hasCached = cachedRepoNames.has(repo.name);

                  return (
                    <div
                      key={repo.id}
                      onClick={() => {
                        setSelectedRepo(repo);
                        const cached = localStorage.getItem(repo.name);
                        if (cached) {
                          setAnalysis(buildAnalysisResult(repo, cached));
                        } else {
                          setAnalysis(null);
                        }
                      }}
                      className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
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
                        {hasCached ? (
                          <Button
                            size="sm"
                            className={`shrink-0 cursor-pointer gap-1.5 text-xs ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500"
                                : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-600 hover:text-white"
                            }`}
                            onClick={() => {
                              setSelectedRepo(repo);
                              const cached = localStorage.getItem(repo.name);
                              if (cached)
                                setAnalysis(buildAnalysisResult(repo, cached));
                            }}
                          >
                            <CheckCircle2 className="size-3.5" />
                            Ver análise
                          </Button>
                        ) : (
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
                        )}
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

            {/* Selected repo preview (before analysis) */}
            {selectedRepo && !isAnalyzing && !analysis && (
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-2xl border border-white/10 p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(8,8,16,0) 60%)",
                  }}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white/5">
                        <Github className="size-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {selectedRepo.name}
                        </p>
                        <a
                          href={selectedRepo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-blue-400"
                        >
                          Ver no GitHub
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                    {selectedRepo.language && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${getLangColor(selectedRepo.language)}`}
                      >
                        <Code2 className="mr-1 size-3" />
                        {selectedRepo.language}
                      </Badge>
                    )}
                  </div>

                  <div className="mb-5">
                    <p className="mb-1.5 text-xs uppercase tracking-wider text-zinc-600">
                      Descrição
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {selectedRepo.description ?? "Sem descrição disponível."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 border-t border-white/6 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Star className="size-3.5" />
                      <span>{selectedRepo.stargazers_count} estrelas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <GitFork className="size-3.5" />
                      <span>{selectedRepo.forks_count} forks</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="size-3.5" />
                      <span>
                        Atualizado em {formatDate(selectedRepo.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 cursor-pointer gap-2 bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                  size="default"
                  onClick={() => handleAnalyze(selectedRepo)}
                >
                  <Sparkles className="size-5" />
                  Analisar com IA
                </Button>
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
                      Gerada com IA
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
