import { NextRequest, NextResponse } from "next/server";

import { generateResponseMini, generateResponseNano } from "@/services/openai";
import { compileTex } from "@/services/pdfLatex";


export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { devInput, nanoInput, miniInput, maxTokens, actionType, data } = await request.json();

    const fieldFormValues = [
      data.nomeArquivo,
      data.nome,
      data.email,
      data.telefone,
      data.localizacao,
      data.github,
      data.linkedin,
      data.website,
      data.perfil,
      data.tituloProfissional,
      JSON.stringify(data.skills),
      JSON.stringify(data.experiences),
      JSON.stringify(data.educations),
      JSON.stringify(data.certifications),
      JSON.stringify(data.languages)
    ];

    if (!devInput || (actionType === "rewrite" && !nanoInput)) {
      return NextResponse.json(
        { error: "Os campos devInput e nanoInput são obrigatórios para rewrite." },
        { status: 400 },
      );
    }

    if (actionType === "rewrite") {
      const content = await generateResponseNano(devInput, nanoInput, maxTokens);
      return NextResponse.json({ content });
    } else if (actionType === "update") {
      const rawTexCode = await generateResponseMini(devInput, miniInput + fieldFormValues, maxTokens);

      // (SOLUÇÃO DO COPILOT): A IA às vezes envolve o código em blocos markdown (```latex ... ```) — remove antes de compilar
      const texCode = rawTexCode
        .replace(/^```(?:latex|tex)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      let pdfBuffer: Buffer;
      try {
        pdfBuffer = await compileTex(texCode);
      } catch (latexError) {
        return NextResponse.json(
          { error: `Erro na compilação LaTeX: ${latexError}` },
          { status: 500 },
        );
      }

      return NextResponse.json({
        pdfBase64: pdfBuffer.toString('base64'),
        texCode,
      });
    } else {
      return NextResponse.json(
        { error: "Tipo de ação não definido no escopo" },
        { status: 404 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: `Ocorreu um problema ao tentar realizar uma ação com a OpenAI em ResumeGen - ${error}` },
      { status: 500 }
    )
  }
}