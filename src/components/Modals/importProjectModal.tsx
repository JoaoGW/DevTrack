"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  FolderGit2,
  Github,
  Search,
  CheckCircle2,
  ChevronRight,
  X,
  Inbox,
} from "lucide-react";

type ImportProjectProps = {
  onClose: () => void;
  content: Record<string, string | null>;
  onImport?: (projectName: string, description: string) => void;
};

export function ImportProjectModal({
  onClose,
  content,
  onImport,
}: ImportProjectProps) {
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allEntries = Object.entries(content).filter(
    ([, description]) => description !== null,
  ) as [string, string][];

  const filtered = allEntries.filter(([key]) =>
    key.replace("PROJECT_", "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleImport = () => {
    if (!selectedKey) return;
    const description = content[selectedKey] ?? "";
    const projectName = selectedKey.replace("PROJECT_", "");
    onImport?.(projectName, description);
    onClose();
  };

  const isEmpty = allEntries.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* ── Overlay ── */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── MODAL ── */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e1a] shadow-2xl shadow-black/60">
        {/* Glow interno */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative px-8 pb-8 pt-8">
          {/* Botão fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex size-7 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/6 hover:text-zinc-300"
          >
            <X className="size-4" />
          </button>

          {/* Ícone */}
          <div className="mb-5 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-500/20">
              <FolderGit2 className="size-7 text-blue-400" />
            </div>
          </div>

          {/* Textos */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-extrabold text-white">
              Importar projeto analisado
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Selecione um projeto do{" "}
              <span className="font-medium text-zinc-300">GitHub Analyzer</span>{" "}
              para importar a descrição gerada por IA automaticamente.
            </p>
          </div>

          {isEmpty ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center gap-4 rounded-xl border border-white/5 bg-white/2 px-6 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/4">
                <Inbox className="size-6 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Nenhum projeto analisado
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Analise seus repositórios no GitHub Analyzer antes de
                  importar.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => router.push("/tools/analyzer")}
                className="mt-1 cursor-pointer gap-2 bg-blue-600 text-white hover:bg-blue-500"
              >
                <Github className="size-4" />
                Ir para o GitHub Analyzer
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : (
            <>
              {/* ── SEARCH ── */}
              <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar projeto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/6 bg-white/2 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:bg-white/4"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* ── PROJECT LIST ── */}
              <ul className="mb-6 flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <li className="py-6 text-center text-sm text-zinc-600">
                    Nenhum projeto encontrado para &quot;{search}&quot;
                  </li>
                ) : (
                  filtered.map(([key, description]) => {
                    const name = key.replace("PROJECT_", "");
                    const isSelected = selectedKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => setSelectedKey(key)}
                          className={`flex w-full cursor-pointer items-start gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                            isSelected
                              ? "border-blue-500/40 bg-blue-500/8"
                              : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4"
                          }`}
                        >
                          {/* Ícone repo */}
                          <div
                            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isSelected ? "bg-blue-500/15" : "bg-white/4"
                            }`}
                          >
                            <Github
                              className={`size-4 ${isSelected ? "text-blue-400" : "text-zinc-500"}`}
                            />
                          </div>

                          {/* Textos */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-300"}`}
                            >
                              {name}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                              {description}
                            </p>
                          </div>

                          {/* Check */}
                          {isSelected && (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-400" />
                          )}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </>
          )}

          {/* ── CTAs ── */}
          {!isEmpty && (
            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                size="lg"
                disabled={!selectedKey}
                onClick={handleImport}
                className="h-11 w-full cursor-pointer gap-2 bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FolderGit2 className="size-4" />
                Importar projeto selecionado
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={onClose}
                className="h-10 w-full cursor-pointer text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
