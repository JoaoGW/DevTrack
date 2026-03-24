"use client";
import { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// PDF Preview Component
export function PdfPreview({
  pdfUrl,
  isGenerating,
}: {
  pdfUrl: string | null;
  isGenerating: boolean;
}) {
  const hasPdf = useMemo(() => Boolean(pdfUrl), [pdfUrl]);
  const [numPages, setNumPages] = useState<number>(0);

  return (
    <div
      className="w-full origin-top rounded-xl bg-white text-[#1a1a1a] shadow-2xl"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11 }}
    >
      {!hasPdf ? (
        <div className="flex min-h-105 items-center justify-center px-6 text-center text-sm text-zinc-500">
          {!isGenerating
            ? "Gere um PDF para visualizar o resultado aqui."
            : "Finalizando documento e Carregando a prévia online. Aguarde..."}
        </div>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex min-h-105 items-center justify-center text-sm text-zinc-500">
              Carregando PDF...
            </div>
          }
          error={
            <div className="flex min-h-105 items-center justify-center px-6 text-center text-sm text-red-500">
              Erro ao renderizar o PDF.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={760}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      )}
    </div>
  );
}
