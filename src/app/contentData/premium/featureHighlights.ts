import {
  FileText,
  LayoutTemplate,
  Brain,
  BarChart2,
} from "lucide-react";

export const featureHighlights = [
  {
    icon: LayoutTemplate,
    title: "Portfólio Profissional",
    description:
      "Gerado automaticamente a partir dos seus repositórios do GitHub. Impressione recrutadores no primeiro clique.",
    accentClass: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: FileText,
    title: "Currículo Otimizado para ATS",
    description:
      "Currículo gerado por IA com palavras-chave do mercado para passar pelos filtros automáticos de recrutamento.",
    accentClass: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Brain,
    title: "Entrevistas Simuladas",
    description:
      "Pratique com perguntas técnicas personalizadas para o seu perfil. Chegue confiante na entrevista real.",
    accentClass: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: BarChart2,
    title: "Recruiter Score",
    description:
      "Saiba exatamente como recrutadores enxergam seu perfil e o que melhorar para aumentar suas chances.",
    accentClass: "bg-violet-500/10 text-violet-400",
  },
];