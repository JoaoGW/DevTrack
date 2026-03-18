import type { TemplateType } from "@/components/ProfileTemplates/types";

import Minimalist from "../../../assets/templates/Minimalist.png";
import Modern from "../../../assets/templates/Modern.png";
import TechOne from "../../../assets/templates/TechOne.png";
import TechTwo from "../../../assets/templates/TechTwo.png";

export const TEMPLATES = [
  {
    id: "minimalist" as TemplateType,
    label: "Minimalista",
    description: "Elegante e limpo, foco no essencial",
    image: Minimalist,
    accent: "from-blue-500/10",
    ring: "ring-blue-500/30",
    dot: "bg-blue-400",
    textAccent: "text-blue-300",
    borderAccent: "border-blue-500/40",
  },
  {
    id: "modern" as TemplateType,
    label: "Moderno",
    description: "Visual impactante com gradientes e cards",
    image: Modern,
    accent: "from-violet-500/10",
    ring: "ring-violet-500/30",
    dot: "bg-violet-400",
    textAccent: "text-violet-300",
    borderAccent: "border-violet-500/40",
  },
  {
    id: "tech" as TemplateType,
    label: "Tech I",
    description: "Estética de terminal para desenvolvedores",
    image: TechOne,
    accent: "from-emerald-500/10",
    ring: "ring-emerald-500/30",
    dot: "bg-emerald-400",
    textAccent: "text-emerald-300",
    borderAccent: "border-emerald-500/40",
  },
  {
    id: "tech2" as TemplateType,
    label: "Tech II",
    description: "Visual IDE com paleta roxa e ciano",
    image: TechTwo,
    accent: "from-purple-500/10",
    ring: "ring-purple-500/30",
    dot: "bg-purple-400",
    textAccent: "text-purple-300",
    borderAccent: "border-purple-500/40",
  },
];