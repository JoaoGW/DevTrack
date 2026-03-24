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

    if (!devInput || !nanoInput) {
      return NextResponse.json(
        { error: "Os campos devInput e nanoInput são obrigatórios." },
        { status: 400 },
      );
    }

    if (actionType === "rewrite") {
      const content = await generateResponseNano(devInput, nanoInput, maxTokens);
      return NextResponse.json({ content });
    } else if (actionType === "update") {
      const texCode = await generateResponseMini(devInput, miniInput + fieldFormValues, maxTokens);
      const pdfBuffer = await compileTex(texCode);
      return new Response(new Uint8Array(pdfBuffer), {
        headers: { "Content-Type": "application/pdf" },
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