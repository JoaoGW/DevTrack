import OpenAI from "openai";


// REGRAS DE IMPLEMENTAÇÃO DE ACORDO COM A FEATURE
// GPT 4.1 -> Gerar descrição profissional de projetos, adaptar currículo para vagas,
//              gerar feedback completo de perfil.
// GPT 4.1-Mini -> Analisar descrição de vaga, extrair keywords ATS, classificar requisitos
//                  da vaga, normalização de dados, pequenas classificações, validação
//                  de inputs, parsing simples de texto.
// GPT 4.1-Nano -> Reescrever pequenos trechos de texto de X maneira e ler de maneira
//                  rápida um documento.

// Instanciação de um novo cliente para as requisições aos modelos da OpenAI
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateResponseMini(devInput: string, miniInput: string, maxTokens: number): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "developer", content: devInput },
      { role: "user", content: miniInput },
    ],
    temperature: 0.2,
    max_output_tokens: maxTokens  // estourando 500 =~ 375 palavras
  });

  return response.output_text;
}

export async function generateResponseRegular(devInput: string, regularInput: string, maxTokens: number): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      { role: "developer", content: devInput },
      { role: "user", content: regularInput },
    ],
    tools: [{ type: "web_search_preview" }],
    temperature: 0.8,
    max_output_tokens: maxTokens // estourando 800 =~ 640 palavras
  });

  return response.output_text;
}

export async function generateResponseNano(devInput: string, nanoInput: string, maxTokens: number): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1-nano",
    input: [
      { role: "developer", content: devInput },
      { role: "user", content: nanoInput },
    ],
    temperature: 0.1,
    max_output_tokens: maxTokens
  });

  return response.output_text;
}