"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { Octokit } from "octokit";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AnimatedStat from "@/components/AnimatedStat";
import { LoadingGeneralContent } from "@/components/Loading/loading";

import { useAuthUserFirebase } from "@/store/authUser.store";
import { auth } from "@/services/firebase";

import { tools } from "../contentData/dashboard/tools";

import {
  Github,
  GitBranch,
  LogOut,
  Bell,
  Star,
  Users,
  Code2,
  Search,
  LayoutTemplate,
  Globe,
  FileText,
  Briefcase,
  BarChart2,
  Brain,
  Sparkles,
  ExternalLink,
  Clock,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Activity,
  Plus,
  RefreshCw,
  Trophy,
  Crown,
  LucideIcon,
} from "lucide-react";

interface IGitHubStats {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
}

const recentResumes = [
  { name: "Currículo Padrão", updatedAt: "há 2 dias", ats: 92, tag: "Geral" },
];

const recentTools = [
  {
    icon: Search,
    name: "GitHub Analyzer",
    lastUsed: "Hoje, 14:32",
    color: "blue",
  },
];

// Helpers
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const SCORE_VALUE = 78;
const SCORE_DEG = (SCORE_VALUE / 100) * 360;

export default function Dashboard() {
  // Lógica de rotas com verificação em first render se há um usuário autenticado
  const router = useRouter();
  // Informações do usuário atualmente autenticado e status
  const { user, token, setUser, setToken, setCredential, isLoading } =
    useAuthUserFirebase();

  // Informações para a Navbar e Banner
  const displayName = user?.displayName ?? "Desenvolvedor";
  const photoURL = user?.photoURL;
  const handle = user?.email?.split("@")[0] ?? "dev";

  // Informações para o UserData de repositórios e outros dados do GitHub
  const [githubStats, setGithubStats] = useState<Array<IGitHubStats>>([
    { label: "Repositórios", value: 0, icon: Code2, accent: "blue" },
    { label: "Stars Recebidas", value: 0, icon: Star, accent: "yellow" },
    { label: "Seguidores", value: 0, icon: Users, accent: "sky" },
    { label: "Contribuições", value: 0, icon: Activity, accent: "emerald" },
  ]);
  // Todas as informações de GitHub Data (GraphQL + Rest API)
  const [username, setUsername] = useState<string>();

  // Captura das informações de dados de estatística do usuário atualmente autenticado, repositórios e outros pela API REST do GitHub
  useEffect(() => {
    if (!token) return;

    const octokit = new Octokit({ auth: token });

    // Busca dados do usuário autenticado
    async function fetchGithubData() {
      // Perfil + número de repos públicos
      const { data: userData } = await octokit.request("GET /user", {
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      });

      // Repositórios do usuário (para calcular stars totais)
      const { data: repos } = await octokit.request("GET /user/repos", {
        per_page: 100,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      });

      const totalStars = repos.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0,
      );

      // Busca contribuições do ano atual via GraphQL
      const { user: ghUser } = await octokit.graphql<{
        user: {
          contributionsCollection: {
            totalCommitContributions: number;
            totalPullRequestContributions: number;
            totalIssueContributions: number;
          };
        };
      }>(
        `query ($login: String!) {
          user(login: $login) {
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
            }
          }
        }`,
        { login: userData.login },
      );

      // Soma/cálculo de todas as contribuições do usuário por onde ele teve atividade nos últimos 365 dias
      const totalContributions =
        ghUser.contributionsCollection.totalCommitContributions +
        ghUser.contributionsCollection.totalPullRequestContributions +
        ghUser.contributionsCollection.totalIssueContributions;

      // Capturando o username do usuário para fazer sistema de links e rotas
      setUsername(userData.login);

      // Substitui os valores default da seção Estatísticas do GitHub
      setGithubStats([
        {
          label: "Repositórios",
          value: userData.public_repos + (userData.total_private_repos ?? 0),
          icon: Code2,
          accent: "blue",
        },
        {
          label: "Stars Recebidas",
          value: totalStars,
          icon: Star,
          accent: "yellow",
        },
        {
          label: "Seguidores",
          value: userData.followers,
          icon: Users,
          accent: "sky",
        },
        {
          label: "Contribuições",
          value: totalContributions,
          icon: Activity,
          accent: "emerald",
        },
      ]);
    }

    fetchGithubData();
  }, [token]);

  // Logoff da aplicação
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setToken(undefined);
    setCredential(null);
    router.push("/");
  };

  // Verifica status da página com user autenticado
  if (isLoading) {
    return <LoadingGeneralContent />;
  }

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#080810]/80 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-10 py-5">
          {/* Logo clicável */}
          <a
            href="/dashboard"
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
              <GitBranch className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DevTrack</span>
          </a>

          {/* Nav links */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-1 md:flex">
            {[
              { label: "Dashboard", href: "/dashboard", active: true },
              { label: "Portfólio", href: "#", active: false },
              { label: "Currículos", href: "#", active: false },
              { label: "Score", href: "#", active: false },
              { label: "Simulador", href: "#", active: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`cursor-pointer rounded-md px-5 py-2.5 text-base font-medium transition-colors ${
                  item.active
                    ? "bg-white/8 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-500" />
            </button>

            {/* Divider */}
            <div className="h-7 w-px bg-white/10" />

            {/* User info */}
            <div className="flex items-center gap-3">
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoURL}
                  alt={displayName}
                  className="size-9 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {displayName[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-base font-medium leading-none text-white">
                  {displayName}
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">@{handle}</p>
              </div>
            </div>

            {/* GitHub link */}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-10 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white sm:flex"
            >
              <Github className="size-5" />
            </a>

            {/* Sign out */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden cursor-pointer gap-1.5 text-sm text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 sm:flex"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="mx-auto max-w-screen-xl space-y-10 px-10 py-12">
        {/* ── WELCOME + SCORE ── */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          {/* Welcome card */}
          <div
            className="relative flex-1 overflow-hidden rounded-2xl border border-white/6 p-10"
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
            <div className="relative">
              <p className="text-base text-zinc-500">{getGreeting()},</p>
              <h1 className="mt-1 text-4xl font-extrabold text-white">
                {displayName}! 👋
              </h1>
              <p className="mt-3 max-w-sm text-base text-zinc-400">
                Seu perfil está ficando cada vez mais forte. Continue evoluindo!
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="default"
                  className="cursor-pointer gap-2 bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                >
                  <Globe className="size-4" />
                  Ver Portfólio
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer gap-2 border-white/10 bg-white/3 text-zinc-300 hover:border-white/20 hover:bg-white/7 hover:text-white"
                >
                  <RefreshCw className="size-4" />
                  Atualizar Análise
                </Button>
              </div>
            </div>
          </div>

          {/* DevTrack Score card */}
          <Card className="w-full border-white/6 bg-white/2 sm:w-80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-zinc-400">
                  DevTrack Score
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/8 text-sm text-emerald-300"
                >
                  <TrendingUp className="mr-1 size-3.5" />
                  +5 pts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-4">
              {/* Score ring */}
              <div
                className="relative flex size-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#2563eb ${SCORE_DEG}deg, rgba(255,255,255,0.05) 0deg)`,
                }}
              >
                <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-[#080810]">
                  <span className="text-4xl font-extrabold leading-none text-white">
                    {SCORE_VALUE}
                  </span>
                  <span className="mt-0.5 text-xs text-zinc-500">/ 100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-white">Excelente</p>
                <p className="text-sm text-zinc-500">Top 15% da plataforma</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── PREMIUM BANNER ── */}
        <div
          className="relative overflow-hidden rounded-2xl border border-amber-500/20 px-8 py-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(217,119,6,0.12) 0%, rgba(8,8,16,0) 50%, rgba(245,158,11,0.08) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 0% 50%, rgba(245,158,11,0.10) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Crown className="size-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-base font-bold text-amber-300">
                    Desbloqueie o DevTrack Premium
                  </p>
                  <Badge
                    variant="outline"
                    className="border-amber-500/20 bg-amber-500/8 text-xs text-amber-300"
                  >
                    PRO
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  Acesse o Resume Adapter, Interview Simulator e análises
                  avançadas sem limites.
                </p>
              </div>
            </div>
            <Button
              className="cursor-pointer shrink-0 gap-2 bg-amber-500 font-semibold text-black shadow-lg shadow-amber-950/40 hover:bg-amber-400"
              size="default"
            >
              <Sparkles className="size-4" />
              Fazer Upgrade
            </Button>
          </div>
        </div>

        {/* ── GITHUB STATS ── */}
        <section>
          <div className="mb-5 flex items-center gap-2.5">
            <Github className="size-5 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-300">
              Estatísticas do GitHub
            </h2>
            <span className="text-sm text-zinc-600">
              · Atualizado agora há pouco
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {githubStats.map((stat) => {
              const Icon = stat.icon;
              const colorMap: Record<string, { bg: string; icon: string }> = {
                blue: { bg: "bg-blue-500/10", icon: "text-blue-400" },
                yellow: { bg: "bg-yellow-500/10", icon: "text-yellow-400" },
                sky: { bg: "bg-sky-500/10", icon: "text-sky-400" },
                emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400" },
              };
              const c = colorMap[stat.accent] ?? colorMap.blue;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col gap-4 rounded-2xl border border-white/6 bg-white/2 p-6"
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${c.bg}`}
                  >
                    <Icon className={`size-5 ${c.icon}`} />
                  </div>
                  <div>
                    <AnimatedStat value={stat.value} />
                    <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FERRAMENTAS ── */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="size-5 text-blue-400" />
              <h2 className="text-base font-semibold text-zinc-300">
                Ferramentas
              </h2>
            </div>
            <a
              href="#"
              className="flex cursor-pointer items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Ver todas
              <ChevronRight className="size-4" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isBlue = tool.color === "blue";
              return (
                <Card
                  key={tool.title}
                  className="cursor-pointer border-white/6 bg-white/2 transition-all duration-200 hover:border-blue-500/20 hover:bg-white/5"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl ${
                          isBlue ? "bg-blue-500/10" : "bg-sky-500/10"
                        }`}
                      >
                        <Icon
                          className={`size-5 ${
                            isBlue ? "text-blue-400" : "text-sky-400"
                          }`}
                        />
                      </div>
                      <ArrowUpRight className="size-4 text-zinc-600" />
                    </div>
                    <CardTitle className="text-base font-semibold text-white">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-zinc-500">
                      {tool.description}
                    </CardDescription>
                    <Badge
                      variant="outline"
                      className={`mt-4 text-xs ${
                        isBlue
                          ? "border-blue-500/20 bg-blue-500/8 text-blue-300"
                          : "border-sky-500/20 bg-sky-500/8 text-sky-300"
                      }`}
                    >
                      {tool.tag}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}

            {/* Em breve */}
            <Card className="flex min-h-40 flex-col items-center justify-center gap-2.5 border-dashed border-white/6 bg-transparent">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/5">
                <Sparkles className="size-5 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-600">Em breve</p>
            </Card>
          </div>
        </section>

        {/* ── BOTTOM ROW ── */}
        <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
          {/* Header: Currículos Recentes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="size-5 text-sky-400" />
              <h2 className="text-base font-semibold text-zinc-300">
                Currículos Recentes
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 px-2.5 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            >
              <Plus className="size-3.5" />
              Novo
            </Button>
          </div>

          {/* Header: Últimas Ferramentas Acessadas */}
          <div className="flex items-center gap-2.5">
            <Clock className="size-5 text-blue-400" />
            <h2 className="text-base font-semibold text-zinc-300">
              Últimas Ferramentas Acessadas
            </h2>
          </div>

          {/* Card: Currículos Recentes */}
          <Card className="border-white/6 bg-white/2">
            <CardContent className="p-0">
              {recentResumes.map((resume, idx) => (
                <div
                  key={resume.name}
                  className={`flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-white/3 ${
                    idx !== recentResumes.length - 1
                      ? "border-b border-white/5"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                      <FileText className="size-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-base font-medium leading-none text-white">
                        {resume.name}
                      </p>
                      <p className="mt-1.5 text-sm text-zinc-500">
                        {resume.updatedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-400">
                        {resume.ats}%
                      </p>
                      <p className="text-xs text-zinc-600">ATS Score</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        resume.tag === "Adaptado"
                          ? "border-blue-500/20 bg-blue-500/8 text-blue-300"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      }`}
                    >
                      {resume.tag}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Footer action */}
              <div className="border-t border-white/5 px-5 py-4">
                <a
                  href="#"
                  className="flex cursor-pointer items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <Trophy className="size-3.5 text-zinc-600" />
                  Ver todos os currículos
                  <ChevronRight className="ml-auto size-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Card: Últimas Ferramentas Acessadas */}
          <Card className="border-white/6 bg-white/2">
            <CardContent className="p-0">
              {recentTools.map((tool, idx) => {
                const Icon = tool.icon;
                const isBlue = tool.color === "blue";
                return (
                  <div
                    key={tool.name}
                    className={`flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-white/3 ${
                      idx !== recentTools.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          isBlue ? "bg-blue-500/10" : "bg-sky-500/10"
                        }`}
                      >
                        <Icon
                          className={`size-4 ${
                            isBlue ? "text-blue-400" : "text-sky-400"
                          }`}
                        />
                      </div>
                      <p className="text-base font-medium text-white">
                        {tool.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-zinc-500">
                        {tool.lastUsed}
                      </span>
                      <ExternalLink className="size-4 text-zinc-600" />
                    </div>
                  </div>
                );
              })}

              {/* Footer action */}
              <div className="border-t border-white/5 px-5 py-4">
                <a
                  href="#"
                  className="flex cursor-pointer items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <Zap className="size-3.5 text-zinc-600" />
                  Ver todas as ferramentas
                  <ChevronRight className="ml-auto size-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
