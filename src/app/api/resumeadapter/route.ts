import { NextRequest, NextResponse } from "next/server";
import { generateResponseNano } from "@/services/openai";

export async function POST(request: NextRequest, response: NextResponse) {
  const { devInput, nanoInput, maxTokens, payload } = await request.json();

  if (!devInput || !nanoInput) {
    return NextResponse.json({ error: "Inputs de Dev e Nano Prompt são obrigatórios" }, { status: 400 });
  }

  try {
    // Parâmetros do usuários transformados em texto
    const adaptOptionsStringfied: string = payload.selectedOptions.join(', ');
    const finalDevInput: string =
      devInput +
      `
        O CV deve ser adequado para a plataforma do ${payload.platform}.
        As informações da vaga que o CV será adaptado são:${payload.positionDescription}.
        \n
        Você deve obrigatoriamente: ${adaptOptionsStringfied}.
        \n
        REGRA CRÍTICA: O currículo retornado NUNCA pode ser idêntico ao original. As seções modificadas devem apresentar mudanças visíveis e relevantes em relação ao texto original.
      `
    const content = await generateResponseNano(finalDevInput, nanoInput, maxTokens);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Ocorreu um erro ao tentar processar a solicitação de adaptação de currículo" }, { status: 500 });
  }
}