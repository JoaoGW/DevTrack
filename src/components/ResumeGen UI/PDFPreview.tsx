import { Certification } from "@/app/contentData/resumegen/interfaces/ICertification";
import { Education } from "@/app/contentData/resumegen/interfaces/IEducation";
import { Experience } from "@/app/contentData/resumegen/interfaces/IExperience";
import { Language } from "@/app/contentData/resumegen/interfaces/ILanguage";

import { FileText } from "lucide-react";

// PDF Preview Component
export function PdfPreview({
  nome,
  tituloProfissional,
  email,
  telefone,
  localizacao,
  githubUrl,
  linkedinUrl,
  perfil,
  skills,
  experiences,
  educations,
  certifications,
  languages,
}: {
  nome: string;
  tituloProfissional: string;
  email: string;
  telefone: string;
  localizacao: string;
  githubUrl: string;
  linkedinUrl: string;
  perfil: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
}) {
  return (
    <div
      className="w-full origin-top rounded-xl bg-white text-[#1a1a1a] shadow-2xl"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11 }}
    >
      {/* Header */}
      <div className="border-b-4 border-[#1e3a5f] bg-[#1e3a5f] px-10 py-8 text-white">
        <h1
          className="text-2xl font-bold tracking-wide"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {nome || "SEU NOME COMPLETO"}
        </h1>
        <p
          className="mt-1 text-sm font-semibold uppercase tracking-widest text-blue-200"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {tituloProfissional || "Título Profissional"}
        </p>

        <div
          className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-blue-100"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {email && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">✉</span> {email}
            </span>
          )}
          {telefone && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">📞</span> {telefone}
            </span>
          )}
          {localizacao && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">📍</span> {localizacao}
            </span>
          )}
          {githubUrl && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">⌥</span>{" "}
              {githubUrl.replace("https://", "")}
            </span>
          )}
          {linkedinUrl && (
            <span className="flex items-center gap-1">
              <span className="opacity-70">in</span>{" "}
              {linkedinUrl.replace("https://", "")}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-7 space-y-5">
        {/* Resumo */}
        {perfil && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Perfil Profissional
            </h2>
            <p className="text-xs leading-relaxed text-zinc-700">{perfil}</p>
          </div>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded bg-[#1e3a5f]/8 border border-[#1e3a5f]/15 px-2 py-0.5 text-[10px] text-zinc-700"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiência */}
        {experiences.some((e) => e.cargo || e.empresa) && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Experiência Profissional
            </h2>
            <div className="space-y-3">
              {experiences
                .filter((e) => e.cargo || e.empresa)
                .map((exp) => (
                  <div key={exp.id}>
                    <div
                      className="flex items-start justify-between"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-800">
                          {exp.cargo || "—"}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {exp.empresa}
                          {exp.local ? ` · ${exp.local}` : ""}
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-500 shrink-0 ml-2">
                        {exp.inicio}
                        {exp.inicio ? " – " : ""}
                        {exp.atual ? "Atual" : exp.fim}
                      </p>
                    </div>
                    {exp.descricao && (
                      <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
                        {exp.descricao}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Educação */}
        {educations.some((e) => e.curso || e.instituicao) && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Educação
            </h2>
            <div className="space-y-2">
              {educations
                .filter((e) => e.curso || e.instituicao)
                .map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-800">
                        {edu.curso || "—"}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {edu.instituicao}
                        {edu.grau ? ` · ${edu.grau}` : ""}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-500 shrink-0 ml-2">
                      {edu.inicio}
                      {edu.inicio ? " – " : ""}
                      {edu.atual ? "Atual" : edu.fim}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certificações */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Certificações
            </h2>
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-800">
                      {cert.nome || "—"}
                    </p>
                    {cert.emissor && (
                      <p className="text-[10px] text-zinc-500">
                        {cert.emissor}
                      </p>
                    )}
                  </div>
                  {cert.data && (
                    <p className="text-[10px] text-zinc-500 ml-2">
                      {cert.data}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {languages.some((l) => l.idioma) && (
          <div>
            <h2
              className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b border-[#1e3a5f]/30 pb-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Idiomas
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages
                .filter((l) => l.idioma)
                .map((lang) => (
                  <span
                    key={lang.id}
                    className="text-xs text-zinc-700"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <span className="font-semibold">{lang.idioma}</span>{" "}
                    <span className="text-zinc-500">· {lang.nivel}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Placeholder vazio */}
        {!perfil &&
          skills.length === 0 &&
          !experiences.some((e) => e.cargo) &&
          !educations.some((e) => e.curso) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-3 size-10 text-zinc-300" />
              <p
                className="text-sm font-semibold text-zinc-400"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Preencha o formulário ao lado
              </p>
              <p
                className="text-xs text-zinc-400/60 mt-1"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Seu currículo aparecerá aqui em tempo real
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
