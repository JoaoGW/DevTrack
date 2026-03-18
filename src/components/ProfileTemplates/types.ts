import type { Experience } from "@/app/contentData/portfolioGen/interfaces/IExperience";
import type { Education } from "@/app/contentData/portfolioGen/interfaces/IEducation";
import type { Certification } from "@/app/contentData/portfolioGen/interfaces/ICertification";
import type { Language } from "@/app/contentData/portfolioGen/interfaces/ILanguage";
import type { Project } from "@/app/contentData/portfolioGen/interfaces/IProject";

export interface PortfolioData {
  nome: string;
  email: string;
  telefone: string;
  localizacao: string;
  github: string;
  linkedin: string;
  website: string;
  perfil: string;
  tituloProfissional: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  template: string
}

export type TemplateType = "minimalist" | "modern" | "tech" | "tech2";
