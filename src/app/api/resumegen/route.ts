import { NextRequest, NextResponse } from "next/server";
import { generateResponseMini, generateResponseNano } from "@/services/openai";

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

    const miniInputFinal = miniInput + ". As informações para colocar no currículo são: " + fieldFormValues

    if (actionType === "rewrite") {
      const content = await generateResponseNano(devInput, nanoInput, maxTokens);
      return NextResponse.json({ content });
    } else if (actionType === "update") {
      const content = await generateResponseMini(devInput, miniInputFinal, maxTokens);
      return NextResponse.json({ content });
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