import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Briefcase,
  FileText,
  ArrowRight,
  Code2,
  CheckCircle,
  Sparkles,
  Brain,
  Globe,
  ChevronRight,
  GitBranch,
  Zap,
  Users,
  Trophy,
  LayoutTemplate,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Análise Automática de Repositórios",
    description:
      "Conecte seu GitHub e o DevTrack analisa todos os seus repos, extraindo linguagens, frameworks e conquistas técnicas.",
    tag: "Automático",
    color: "violet",
  },
  {
    icon: Globe,
    title: "Portfólio Público Compartilhável",
    description:
      "Gera um portfólio público com URL personalizada, totalmente atualizado e pronto para enviar a qualquer recrutador.",
    tag: "Online",
    color: "indigo",
  },
  {
    icon: FileText,
    title: "Currículo Otimizado para ATS",
    description:
      "Cria currículos que passam pelos filtros automáticos das maiores empresas de tecnologia do mundo.",
    tag: "ATS-Ready",
    color: "violet",
  },
  {
    icon: Briefcase,
    title: "Adapta para Vagas Específicas",
    description:
      "Cole a descrição de uma vaga e receba seu currículo adaptado automaticamente com as palavras-chave certas.",
    tag: "IA",
    color: "indigo",
  },
  {
    icon: Brain,
    title: "Preparação para Entrevistas",
    description:
      "Receba perguntas técnicas personalizadas com base nos seus projetos e no stack de tecnologia que você usa.",
    tag: "Smart",
    color: "violet",
  },
  {
    icon: Sparkles,
    title: "Detecção de Habilidades",
    description:
      "Identifica e destaca automaticamente suas principais competências técnicas com base no código que você já escreveu.",
    tag: "IA",
    color: "indigo",
  },
];

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Conecte seu GitHub",
    description:
      "Autorize o DevTrack a acessar seus repositórios públicos com um único clique.",
  },
  {
    number: "02",
    icon: Zap,
    title: "IA Analisa seus Projetos",
    description:
      "Nossa inteligência artificial lê seus repos e gera descrições profissionais para cada um.",
  },
  {
    number: "03",
    icon: LayoutTemplate,
    title: "Gere seu Portfólio",
    description:
      "Em segundos, um portfólio moderno e profissional está disponível com sua URL exclusiva.",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Conquiste sua Vaga",
    description:
      "Use o currículo adaptado e a preparação para entrevistas para se destacar da concorrência.",
  },
];

const stats = [
  { value: "5k+", label: "Desenvolvedores", icon: Users },
  { value: "50k+", label: "Repositórios Analisados", icon: Code2 },
  { value: "3×", label: "Mais entrevistas", icon: Zap },
  { value: "98%", label: "Satisfação", icon: Trophy },
];

const highlights = [
  "Currículo adaptado por IA",
  "Portfólio sempre atualizado",
  "Pronto em minutos",
  "Sem necessidade de design",
];

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#080810]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600">
              <GitBranch className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DevTrack</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Funcionalidades
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-white"
            >
              Como funciona
            </a>
            <a href="#cta" className="transition-colors hover:text-white">
              Começar
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-zinc-400 hover:bg-white/5 hover:text-white sm:flex"
            >
              Entrar
            </Button>
            <Button
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-950/50"
            >
              Começar grátis
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-175 w-175 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="absolute right-[-5%] top-[30%] h-100 w-100 rounded-full bg-indigo-600/10 blur-[100px]" />
          <div className="absolute left-[-5%] top-[40%] h-75 w-75 rounded-full bg-fuchsia-600/8 blur-[90px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-28 pt-24 text-center">
          {/* Pill badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="size-3.5" />
            <span>Portfólio gerado por IA em segundos</span>
            <ChevronRight className="size-3.5 opacity-60" />
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 30%, #a1a1aa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transforme seu GitHub
            </span>
            <span
              className="block mt-1"
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              em carreira
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400">
            DevTrack analisa seus repositórios do GitHub e gera automaticamente
            um{" "}
            <span className="font-medium text-white">
              portfólio profissional
            </span>
            ,{" "}
            <span className="font-medium text-white">
              currículo otimizado para ATS
            </span>{" "}
            e{" "}
            <span className="font-medium text-white">
              preparação para entrevistas técnicas
            </span>
            . Tudo em um só lugar, sem esforço.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 gap-2 bg-violet-600 px-8 text-base text-white shadow-xl shadow-violet-950/60 hover:bg-violet-500 transition-all duration-200"
            >
              <Github className="size-4" />
              Conectar com GitHub
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 border-white/10 bg-white/3 px-8 text-base text-zinc-300 hover:border-white/20 hover:bg-white/7 hover:text-white transition-all duration-200"
            >
              Ver demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-white/6 bg-white/2 px-4 py-5"
                >
                  <Icon className="mb-1 size-4 text-violet-400 opacity-70" />
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-zinc-500">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/2 h-125 w-100 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          {/* Section header */}
          <div className="mb-14 text-center">
            <Badge
              variant="outline"
              className="mb-5 border-indigo-500/25 bg-indigo-500/8 px-3 py-1 text-indigo-300"
            >
              Funcionalidades
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Tudo que você precisa{" "}
              <span className="text-zinc-500">para se destacar</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              De repositórios brutos a uma presença profissional completa —
              automaticamente.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isViolet = feature.color === "violet";
              return (
                <Card
                  key={feature.title}
                  className="group border-white/6 bg-white/2 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/5"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl ${
                          isViolet ? "bg-violet-500/10" : "bg-indigo-500/10"
                        }`}
                      >
                        <Icon
                          className={`size-5 ${
                            isViolet ? "text-violet-400" : "text-indigo-400"
                          }`}
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isViolet
                            ? "border-violet-500/20 bg-violet-500/8 text-violet-300"
                            : "border-indigo-500/20 bg-indigo-500/8 text-indigo-300"
                        }`}
                      >
                        {feature.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-[15px] font-semibold text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-zinc-500">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <Badge
              variant="outline"
              className="mb-5 border-emerald-500/25 bg-emerald-500/8 px-3 py-1 text-emerald-300"
            >
              Como funciona
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Do código ao emprego{" "}
              <span className="text-zinc-500">em 4 passos</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-6 hidden lg:block"
                      style={{
                        left: "calc(50% + 2.5rem)",
                        width: "calc(100% - 5rem)",
                        height: "1px",
                        background:
                          "linear-gradient(to right, rgba(139,92,246,0.4), transparent)",
                      }}
                    />
                  )}

                  {/* Icon circle */}
                  <div className="relative mb-5 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-950/50">
                    <Icon className="size-5 text-white" />
                    <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#080810] text-[10px] font-bold text-violet-400 ring-1 ring-violet-500/40">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="mb-2 font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS BANNER ── */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="relative overflow-hidden rounded-2xl border border-violet-500/12 p-10 text-center sm:p-14"
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(8,8,16,0) 50%, rgba(79,70,229,0.10) 100%)",
            }}
          >
            {/* Inner glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <p className="mb-2 text-sm font-medium tracking-widest text-violet-400 uppercase">
                Por que DevTrack?
              </p>
              <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                Seu GitHub já conta uma história poderosa.{" "}
                <span className="text-zinc-400">
                  A gente ajuda você a contá-la melhor.
                </span>
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-zinc-400">
                Recrutadores passam menos de{" "}
                <span className="font-semibold text-white">10 segundos</span>{" "}
                olhando um currículo. Garanta que o seu se destaque —
                automaticamente.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-zinc-300">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="size-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="cta" className="relative py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/12 blur-[120px]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="size-3.5" />
            Junte-se a mais de 5k desenvolvedores
          </div>

          <h2 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Pronto para transformar{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              seu GitHub em carreira?
            </span>
          </h2>

          <p className="mb-10 text-lg text-zinc-400">
            Crie seu portfólio profissional gratuitamente em menos de 2 minutos.
            Sem cartão de crédito, sem configuração.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 gap-2 bg-violet-600 px-10 text-base text-white shadow-xl shadow-violet-950/60 hover:bg-violet-500 transition-all duration-200"
            >
              <Github className="size-4" />
              Começar gratuitamente
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 border-white/10 bg-white/3 px-8 text-base text-zinc-300 hover:border-white/20 hover:bg-white/7 hover:text-white"
            >
              Ver como funciona
            </Button>
          </div>

          <p className="mt-5 text-sm text-zinc-600">
            Plano gratuito disponível · Sem cartão de crédito · Cancele quando
            quiser
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/6 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-violet-600">
                <GitBranch className="size-3.5 text-white" />
              </div>
              <span className="font-semibold text-white">DevTrack</span>
            </div>

            <p className="text-sm text-zinc-600">
              © 2025 DevTrack · Transforme seu GitHub em carreira.
            </p>

            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <a href="#" className="transition-colors hover:text-zinc-300">
                Privacidade
              </a>
              <a href="#" className="transition-colors hover:text-zinc-300">
                Termos
              </a>
              <a href="#" className="transition-colors hover:text-zinc-300">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
