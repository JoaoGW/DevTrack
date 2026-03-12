import type { NextApiRequest, NextApiResponse } from 'next';

import OpenAI from "openai";

// REGRAS DE IMPLEMENTAÇÃO DE ACORDO COM A FEATURE
// GPT 4.1 -> Gerar descrição profissional de projetos, adaptar currículo para vagas,
//              gerar feedback completo de perfil.
// GPT 4.1-Mini -> Analisar descrição de vaga, extrair keywords ATS, classificar requisitos
//                  da vaga, normalização de dados, pequenas classificações, validação
//                  de inputs, parsing simples de texto.

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateResponseMini(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { devInput, miniInput } = req.body;

    try {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "developer",
            input: devInput,
          },
          {
            role: "user",
            input: miniInput,
          },
        ],
        tools: [{ type: "web_search" }],
        temperature: 0.2,
        max_output_tokens: 500,
      });

      res.status(200).json({ satisfies: "Requisição ao modelo Mini realizada com sucesso" });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar uma response:', error);
      res.status(500).json({ error: 'Falha para gerar uma response - 500' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} Não Permitido`);
  }
}

export async function generateResponseRegular(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { devInput, regularInput } = req.body;

    try {
      const response = await client.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "developer",
            input: devInput,
          },
          {
            role: "user",
            input: regularInput,
          },
        ],
        tools: [{ type: "web_search" }],
        temperature: 0.8,
        max_output_tokens: 800,
      });

      res.status(200).json({ satisfies: "Requisição ao modelo Mini realizada com sucesso" });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar uma response:', error);
      res.status(500).json({ error: 'Falha para gerar uma response - 500' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} Não Permitido`);
  }
}