import {
  Zap,
  Crown,
  Briefcase
} from "lucide-react";

export const plans = [
  {
    id: "free",
    name: "Gratuito",
    badge: "ATUAL",
    badgeClass: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    price: null,
    priceLabel: "Grátis para sempre",
    description: "Para quem está começando a construir sua presença online.",
    accent: "zinc",
    cardClass: "border-white/6 bg-white/2",
    buttonClass:
      "border-white/10 bg-white/5 text-zinc-400 cursor-not-allowed opacity-60",
    buttonLabel: "Plano atual",
    buttonDisabled: true,
    icon: Briefcase,
    iconClass: "text-zinc-400",
    iconBgClass: "bg-zinc-500/10",
    features: [
      { label: "1 portfólio gerado", included: true },
      { label: "3 análises de projeto", included: true },
      { label: "1 currículo gerado", included: true },
      { label: "Resume adapter ilimitado", included: false },
      { label: "Entrevistas simuladas", included: false },
      { label: "Recruiter Score", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "MAIS POPULAR",
    badgeClass: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    price: "R$\u00a024,99",
    priceLabel: "/mês",
    description:
      "Para devs que querem se destacar no mercado com ferramentas completas.",
    accent: "blue",
    cardClass: "border-blue-500/25 bg-blue-500/5",
    buttonClass:
      "bg-blue-600 text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500 cursor-pointer",
    buttonLabel: "Assinar Pro",
    buttonDisabled: false,
    icon: Zap,
    iconClass: "text-blue-400",
    iconBgClass: "bg-blue-500/10",
    features: [
      { label: "Portfólios ilimitados", included: true },
      { label: "Análises completas de projeto", included: true },
      { label: "Currículos ilimitados", included: true },
      { label: "Resume adapter ilimitado", included: true },
      { label: "Entrevistas simuladas", included: false },
      { label: "Recruiter Score", included: false },
    ],
  },
  {
    id: "career",
    name: "Career",
    badge: "COMPLETO",
    badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    price: "R$\u00a039,99",
    priceLabel: "/mês",
    description:
      "Para quem quer a experiência completa rumo à vaga dos sonhos.",
    accent: "violet",
    cardClass: "border-violet-500/25 bg-violet-500/5",
    buttonClass:
      "bg-violet-600 text-white shadow-lg shadow-violet-950/50 hover:bg-violet-500 cursor-pointer",
    buttonLabel: "Assinar Career",
    buttonDisabled: false,
    icon: Crown,
    iconClass: "text-violet-400",
    iconBgClass: "bg-violet-500/10",
    features: [
      { label: "Portfólios ilimitados", included: true },
      { label: "Análises completas de projeto", included: true },
      { label: "Currículos ilimitados", included: true },
      { label: "Resume adapter ilimitado", included: true },
      { label: "Entrevistas simuladas", included: true },
      { label: "Recruiter Score", included: true },
    ],
  },
];