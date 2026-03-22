import {
  Search,
  LayoutTemplate,
  Globe,
  FileText,
  Briefcase,
  BarChart2,
  Brain,
} from "lucide-react";

export const tools = [
  {
    icon: Search,
    title: "GitHub Analyzer",
    description:
      "Analise repositórios com IA e gere descrições profissionais com stack detectada.",
    tag: "IA",
    color: "blue",
    route: "tools/analyzer"
  },
  {
    icon: LayoutTemplate,
    title: "Portfolio Generator",
    description: "Gere seu portfólio completo e profissional automaticamente.",
    tag: "Automático",
    color: "sky",
    route: "tools/portfoliogen"
  },
  {
    icon: Globe,
    title: "Public Profile",
    description: "Sua URL exclusiva para compartilhar com recrutadores.",
    tag: "Online",
    color: "blue",
    route: "/tools/profile"
  },
  {
    icon: FileText,
    title: "Resume Generator",
    description: "Currículo ATS-ready gerado a partir dos seus projetos e informações.",
    tag: "ATS-Ready",
    color: "sky",
    route: "tools/resumegen"
  },
  {
    icon: Briefcase,
    title: "Resume Adapter",
    description: "Adapte seu currículo para qualquer vaga em segundos.",
    tag: "Smart",
    color: "blue",
    route: "tools/#"
  },
  {
    icon: BarChart2,
    title: "DevTrack Score",
    description: "Avalie e evolua seu perfil profissional continuamente.",
    tag: "Score",
    color: "sky",
    route: "tools/#"
  },
  {
    icon: Brain,
    title: "Interview Simulator",
    description: "Simule entrevistas técnicas com base na sua stack real.",
    tag: "Simulador",
    color: "blue",
    route: "tools/#"
  },
];