"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoadingGeneralContent } from "@/components/Loading/loading";
import { MinimalistTemplate } from "@/components/ProfileTemplates/MinimalistTemplate";
import { ModernTemplate } from "@/components/ProfileTemplates/ModernTemplate";
import { TechTemplate } from "@/components/ProfileTemplates/TechTemplate";
import { TechTwoTemplate } from "@/components/ProfileTemplates/TechTwoTemplate";
import type {
  PortfolioData,
  TemplateType,
} from "@/components/ProfileTemplates/types";

import { useAuthUserFirebase } from "@/store/authUser.store";

import type { Experience } from "@/app/contentData/portfolioGen/interfaces/IExperience";
import type { Education } from "@/app/contentData/portfolioGen/interfaces/IEducation";
import type { Certification } from "@/app/contentData/portfolioGen/interfaces/ICertification";
import type { Language } from "@/app/contentData/portfolioGen/interfaces/ILanguage";
import type { Project } from "@/app/contentData/portfolioGen/interfaces/IProject";

function parseArrayOrJSON<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === "string" && raw.trim() !== "") {
    try {
      return JSON.parse(raw) as T[];
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

export default function Profile() {
  const { user } = useAuthUserFirebase();
  const router = useRouter();

  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/portfolio?userId=${user.uid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && data.data) {
          const dados = data.data;
          setPortfolio({
            nome: dados.nome ?? "",
            email: dados.email ?? "",
            telefone: dados.telefone ?? "",
            localizacao: dados.localizacao ?? "",
            github: dados.github ?? "",
            linkedin: dados.linkedin ?? "",
            website: dados.website ?? "",
            perfil: dados.perfil ?? "",
            tituloProfissional:
              dados.tituloProfissional ?? dados.titulo_profissional ?? "",
            skills: parseArrayOrJSON<string>(dados.skills, []),
            experiences: parseArrayOrJSON<Experience>(
              dados.experiences ?? dados.experiencias,
              [],
            ),
            educations: parseArrayOrJSON<Education>(
              dados.educations ?? dados.educacoes,
              [],
            ),
            certifications: parseArrayOrJSON<Certification>(
              dados.certifications ?? dados.certificacoes,
              [],
            ),
            languages: parseArrayOrJSON<Language>(
              dados.languages ?? dados.idiomas,
              [],
            ),
            projects: parseArrayOrJSON<Project>(
              dados.projects ?? dados.projetos,
              [],
            ),
            template: dados.template,
          });
          setTemplate((dados.template as TemplateType) ?? "minimalist");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.uid]);

  // Loading
  if (loading) {
    return <LoadingGeneralContent />;
  }

  // Sem informações de currículo ainda disponíveis
  if (!portfolio) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#080810]"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        <div className="max-w-sm rounded-2xl border border-white/8 bg-white/2 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            Nenhum portfólio encontrado
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Acesse o Gerador de Portfólio para preencher suas informações.
          </p>
          <a
            href="/tools/portfoliogen"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500"
          >
            Ir para o Gerador
          </a>
        </div>
      </div>
    );
  }

  // Render do template escolhido no Modal
  return (
    <>
      {template === "minimalist" && (
        <MinimalistTemplate portfolio={portfolio} />
      )}
      {template === "modern" && <ModernTemplate portfolio={portfolio} />}
      {template === "tech" && <TechTemplate portfolio={portfolio} />}
      {template === "tech2" && <TechTwoTemplate portfolio={portfolio} />}
    </>
  );
}
