'use client';
import { useEffect, useState } from 'react';

import emojiStrip from 'emoji-strip';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/ResumeGenUI/SectionTitle';
import { Toggle } from '@/components/ResumeGenUI/Toggle';
import { PdfPreview } from '@/components/ResumeGenUI/PDFPreview';

import { useAuthUserFirebase } from '@/store/authUser.store';

import { PlatformId } from '@/app/contentData/resumeAdapter/types/PlatformIdTypes';
import { platforms } from '@/app/contentData/resumeAdapter/plataforms';

import {
  FileText,
  ChevronRight,
  Sparkles,
  Download,
  Wand2,
  Building2,
  Target,
  Layers,
  SlidersHorizontal,
  Loader,
  Info,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Design tokens (mesmos padrões do projeto)
const inputCls =
  'w-full rounded-xl border border-white/6 bg-white/2 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:bg-white/4';
const labelCls = 'block text-sm font-medium text-zinc-300 mb-1.5';
const cardCls = 'rounded-2xl border border-white/6 bg-white/2 p-8';

interface ISavedCV {
  id: string;
  name: string;
  created_at: string;
  latex_source: string;
}

export default function ResumeAdapter() {
  const { user } = useAuthUserFirebase();

  const displayName = user?.displayName ?? 'Desenvolvedor';
  const photoURL = user?.photoURL;
  const handle = user?.email?.split('@')[0] ?? 'dev';

  // Estados para solicitações (requests e responses) de APIs
  const [savedCVs, setSavedCVs] = useState<ISavedCV[]>([]);

  // PDF state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [pdfError] = useState<string | null>(null);
  const [originalCV, setOriginalCV] = useState<string>('');

  // Seleções
  const [selectedCVId, setSelectedCVId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | ''>('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState('CV Adaptado');

  // Opções de adaptação
  const [focusTechSkills, setFocusTechSkills] = useState(false);
  const [includeKeywords, setIncludeKeywords] = useState(false);
  const [adjustProfile, setAdjustProfile] = useState(true);
  const canAdapt =
    !!selectedCVId &&
    !!originalCV &&
    !!selectedPlatform &&
    jobDescription.length > 30;

  const selectedCV = savedCVs.find((c) => c.id === selectedCVId);
  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform);

  // Checklist de progresso do header
  const steps = [
    { label: 'Currículo selecionado', done: !!selectedCVId },
    { label: 'Plataforma escolhida', done: !!selectedPlatform },
    { label: 'Descrição da vaga', done: jobDescription.length > 30 },
  ];

  // Seguindo o que foi inserido no formulário desta tela + o conteúdo do CV original, enviamos
  //  a solicitação à IA que retorna somente alguns campos específicos modificados
  async function handleCVAdapter() {
    if (!originalCV) {
      setIsAdapting(false);
      return;
    }
    setIsAdapting(true);

    const positionDesc = `Cargo:${jobTitle} - Nome da Empresa:${companyName} - Descrição da vaga:${emojiStrip(jobDescription)}`;

    const selectedAdaptOptions: string[] = [];
    if (focusTechSkills) {
      selectedAdaptOptions.push(
        'Destaque habilidades técnicas, priorizando as skills técnicas relevantes para a vaga'
      );
    }
    if (includeKeywords) {
      selectedAdaptOptions.push(
        'Insira palavras-chave da vaga, adicionando termos do anúncio para melhorar matching em ATS'
      );
    }
    if (adjustProfile) {
      selectedAdaptOptions.push(
        'Reescreva o perfil profissional, ajustando o resumo profissional ao contexto da vaga'
      );
    }

    const payload = {
      platform: selectedPlatform,
      positionDescription: positionDesc,
      selectedOptions: selectedAdaptOptions,
    };

    const apiResponse = await fetch('/api/resumeadapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devInput:
          '[ROLE]:Você é um Tech Recruiter Sênior que está ajudando devs a arrumarem um novo emprego. [TASK]:Sem mexer na estrutura do CV, modifique somente as informações dentro de Perfil Profissional, Título Profissional e Habilidades dos tópicos dentro das seções do currículo já existente.',
        nanoInput: `Currículo original a ser modificado: ${originalCV}`,
        maxTokens: 3250,
        payload: payload,
      }),
    });

    if (!apiResponse.ok) {
      console.error('Ocorreu um erro ao adaptar o currículo');
    }

    setIsAdapting(false);
  }

  // Captura de todos os CVs já gerados pelo usuário
  useEffect(() => {
    if (!user?.uid) return;

    async function captureCVs() {
      const apiResponse = await fetch(
        `/api/cv-pdf?userId=${encodeURIComponent(user!.uid)}&list=true`,
        { method: 'GET' }
      );

      if (!apiResponse.ok) return [];

      const { content } = await apiResponse.json();
      return content ?? [];
    }

    captureCVs()
      .then((data) => setSavedCVs(data))
      .catch(() => setSavedCVs([]));
  }, [user?.uid]);

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <Navbar
        displayName={displayName}
        handle={handle}
        photoURL={photoURL}
        username={undefined}
      />

      <main className="mx-auto max-w-400 space-y-8 px-10 py-12">
        {/* ── PAGE HEADER ── */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/6 p-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(8,8,16,0) 60%)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)',
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
                <span className="text-sm text-zinc-300">
                  Adaptador de Currículo
                </span>
              </div>

              {/* Title */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/10">
                  <Wand2 className="size-6 text-violet-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Adaptador de Currículo
                </h1>
              </div>

              <p className="max-w-lg text-base text-zinc-400">
                Selecione um currículo gerado e adapte-o automaticamente para
                vagas específicas no LinkedIn, Gupy ou Catho com suporte de IA.
              </p>
            </div>

            {/* Right: badge + checklist */}
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <Badge
                variant="outline"
                className="border-violet-500/20 bg-violet-500/8 text-sm text-violet-300"
              >
                <Sparkles className="mr-1.5 size-3.5" />
                Adaptação inteligente por vaga
              </Badge>

              <div className="flex flex-col gap-2">
                {steps.map((s) => (
                  <span
                    key={s.label}
                    className={`flex items-center gap-2 text-xs ${
                      s.done ? 'text-emerald-400' : 'text-zinc-600'
                    }`}
                  >
                    <CheckCircle2 className="size-3" />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* ──────── LEFT: FORM ──────── */}
          <div className="flex flex-col gap-6">
            {/* 1. CURRÍCULO BASE */}
            <section className={cardCls}>
              <SectionTitle
                icon={<FileText className="size-5 text-violet-400" />}
                title="Currículo Base"
              />
              <div className="mt-6">
                <label className={labelCls}>
                  Selecione um currículo já gerado
                </label>

                {/* Cards de seleção */}
                <div className="flex flex-col gap-2">
                  {savedCVs.length > 0 ? (
                    savedCVs.map((cv) => {
                      const isSelected = selectedCVId === cv.id;
                      return (
                        <button
                          key={cv.id}
                          type="button"
                          onClick={async () => {
                            setSelectedCVId(cv.id);
                            setOriginalCV(cv.latex_source);
                            // Busca e exibe o PDF do currículo selecionado
                            const res = await fetch(
                              `/api/cv-pdf?userId=${cv.id}`
                            );
                            if (res.ok) {
                              const blob = await res.blob();
                              if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                              setPdfUrl(URL.createObjectURL(blob));
                            }
                          }}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-violet-500/40 bg-violet-500/8'
                              : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/3'
                          }`}
                        >
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                              isSelected ? 'bg-violet-500/15' : 'bg-white/4'
                            }`}
                          >
                            <FileText
                              className={`size-4 ${isSelected ? 'text-violet-400' : 'text-zinc-500'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isSelected ? 'text-violet-200' : 'text-zinc-300'
                              }`}
                            >
                              {cv.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Gerado em {cv.created_at}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="size-4 shrink-0 text-violet-400" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/6 px-4 py-3.5 mt-3">
                      <AlertCircle className="size-5 shrink-0 text-amber-400" />
                      <span className="text-sm text-amber-300">
                        Gere um novo Currículo antes de tentar modificar!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 2. PLATAFORMA DE DESTINO */}
            <section className={cardCls}>
              <SectionTitle
                icon={<Target className="size-5 text-blue-400" />}
                title="Plataforma de Destino"
              />
              <div className="mt-6">
                <label className={labelCls}>
                  Para qual plataforma deseja adaptar?
                </label>

                {/* Cards de plataforma */}
                <div className="flex flex-col gap-2">
                  {platforms.map((p) => {
                    const isSelected = selectedPlatform === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? `${p.border} ${p.bg}`
                            : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/3'
                        }`}
                      >
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? p.accent : 'bg-white/4'
                          }`}
                        >
                          <Layers
                            className={`size-4.5 ${isSelected ? p.text : 'text-zinc-500'}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              isSelected ? p.text : 'text-zinc-300'
                            }`}
                          >
                            {p.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {p.description}
                          </p>
                        </div>
                        {isSelected && (
                          <span
                            className={`size-2 shrink-0 rounded-full ${p.dot}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 3. DESCRIÇÃO DA VAGA */}
            <section className={cardCls}>
              <SectionTitle
                icon={<ClipboardPaste className="size-5 text-amber-400" />}
                title="Descrição da Vaga"
              />
              <div className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Cargo / Título da Vaga</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Ex: Desenvolvedor Front-End Sênior"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        maxLength={45}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-xs text-zinc-600">
                      {jobTitle.length}/45
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>Empresa</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Ex: Google, Nubank, iFood…"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        maxLength={45}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-xs text-zinc-600">
                      {companyName.length}/45
                    </p>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Cole a descrição completa da vaga *
                  </label>
                  <textarea
                    rows={10}
                    placeholder="Cole aqui a descrição completa da vaga, incluindo requisitos, responsabilidades e diferenciais. Quanto mais detalhes, melhor será a adaptação do seu currículo."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    maxLength={3000}
                    className={`${inputCls} resize-none leading-relaxed`}
                  />
                  <p className="mt-1.5 flex items-center justify-between text-xs text-zinc-600">
                    <span>mínimo 30 caracteres para adaptar</span>
                    <span
                      className={
                        jobDescription.length >= 3000 ? 'text-amber-400' : ''
                      }
                    >
                      {jobDescription.length}/3000
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* 4. OPÇÕES DE ADAPTAÇÃO */}
            <section className={cardCls}>
              <SectionTitle
                icon={<SlidersHorizontal className="size-5 text-teal-400" />}
                title="Opções de Adaptação"
              />
              <div className="mt-6 flex flex-col gap-3">
                {(
                  [
                    {
                      checked: focusTechSkills,
                      onToggle: () => setFocusTechSkills((v) => !v),
                      label: 'Destacar habilidades técnicas',
                      description:
                        'Prioriza skills técnicas relevantes para a vaga',
                    },
                    {
                      checked: includeKeywords,
                      onToggle: () => setIncludeKeywords((v) => !v),
                      label: 'Inserir palavras-chave da vaga',
                      description:
                        'Adiciona termos do anúncio para melhorar matching em ATS',
                    },
                    {
                      checked: adjustProfile,
                      onToggle: () => setAdjustProfile((v) => !v),
                      label: 'Reescrever perfil profissional',
                      description:
                        'Ajusta o resumo profissional ao contexto da vaga',
                    },
                  ] as const
                ).map((opt) => (
                  <div
                    key={opt.label}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/6 bg-white/2 px-4 py-3.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {opt.description}
                      </p>
                    </div>
                    <Toggle
                      checked={opt.checked}
                      onToggle={opt.onToggle}
                      label=""
                    />
                  </div>
                ))}

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/15 bg-amber-500/6 px-4 py-3">
                  <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <p className="text-xs leading-relaxed text-amber-300/80">
                    A adaptação preserva todas as informações verdadeiras do
                    currículo original — apenas reorganiza, destaca e ajusta a
                    linguagem para maximizar a compatibilidade com a vaga
                    selecionada.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ──────── RIGHT: PDF PREVIEW ──────── */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            {/* Toolbar: filename + download */}
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1">
                <FileText className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="nome-do-arquivo-adaptado"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`${inputCls} pl-10`}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                  .pdf
                </span>
              </div>
              <Button
                type="button"
                disabled={!pdfUrl}
                onClick={() => {
                  if (!pdfUrl) return;
                  const a = document.createElement('a');
                  a.href = pdfUrl;
                  a.download = `${fileName || 'CV Adaptado'}.pdf`;
                  a.click();
                }}
                className="shrink-0 cursor-pointer gap-2 h-10 bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="size-4" />
                Download
              </Button>
            </div>

            {/* Plataforma selecionada (badge contextual) */}
            {selectedPlatformData && (
              <div
                className={`mb-3 flex items-center gap-2 rounded-xl border px-4 py-2.5 ${selectedPlatformData.border} ${selectedPlatformData.bg}`}
              >
                <Layers
                  className={`size-4 shrink-0 ${selectedPlatformData.text}`}
                />
                <span
                  className={`text-xs font-medium ${selectedPlatformData.text}`}
                >
                  Adaptando para <strong>{selectedPlatformData.name}</strong>
                </span>
                {selectedCV && (
                  <>
                    <span className="text-zinc-600">·</span>
                    <span className="truncate text-xs text-zinc-500">
                      {selectedCV.name}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* PDF Container */}
            <div className="rounded-2xl border border-white/6 bg-zinc-950 p-4">
              {/* Browser-like top bar */}
              <div className="mb-3 flex items-center gap-2 px-1">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="size-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 rounded-md bg-white/4 px-3 py-1 text-center text-[10px] text-zinc-600">
                  {fileName || 'CV Adaptado'}.pdf
                </div>
              </div>

              {/* Erro de geração */}
              {pdfError && (
                <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                  {pdfError}
                </div>
              )}

              {/* Scrollable PDF */}
              <div className="max-h-225 overflow-y-auto rounded-lg">
                <PdfPreview pdfUrl={pdfUrl} isGenerating={isAdapting} />
              </div>

              {/* Botão Adaptar */}
              <div className="mt-4">
                <button
                  type="button"
                  disabled={!canAdapt || isAdapting}
                  onClick={() => {
                    setIsAdapting(true);
                    handleCVAdapter();
                  }}
                  className="flex w-full cursor-pointer disabled:cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/10 py-3 text-sm font-semibold text-violet-300 transition-all hover:border-violet-500/60 hover:bg-violet-600/20 hover:text-violet-200 disabled:opacity-40"
                >
                  {isAdapting ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    <Wand2 className="size-4" />
                  )}
                  {isAdapting
                    ? 'Adaptando currículo para a vaga...'
                    : 'Adaptar Currículo com IA'}
                </button>

                {!canAdapt && (
                  <p className="mt-2 text-center text-xs text-zinc-600">
                    {!selectedCVId
                      ? 'Selecione um currículo para continuar.'
                      : !originalCV
                        ? 'O currículo selecionado não possui código fonte. Gere-o novamente.'
                        : !selectedPlatform
                          ? 'Escolha a plataforma de destino.'
                          : 'Cole a descrição da vaga (mín. 30 caracteres).'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
