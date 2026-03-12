import { NextRequest, NextResponse } from "next/server";
import { generateResponseRegular } from "../../../services/openai";

export async function POST(req: NextRequest) {
  try {
    const { devInput, miniInput, maxTokens } = await req.json();

    if (!devInput || !miniInput) {
      return NextResponse.json(
        { error: "Os campos devInput e miniInput são obrigatórios." },
        { status: 400 },
      );
    }

    const content = await generateResponseRegular(devInput, miniInput, maxTokens);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Erro ao analisar repositório:", error);
    return NextResponse.json(
      { error: "Falha ao gerar análise - 500" },
      { status: 500 },
    );
  }
}
