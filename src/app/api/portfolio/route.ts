import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool, getUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId obrigatório" }, { status: 400 });
  }

  try {
    const portfolio = await getUserById(userId);
    if (!portfolio) {
      return NextResponse.json({ success: false, error: "Nenhum portfólio encontrado" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: portfolio });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO portfolio 
        (user_id, nome, email, telefone, localizacao, github, linkedin, website, perfil, titulo_profissional, skills, experiencias, educacoes, certificacoes, idiomas, projetos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
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
        JSON.stringify(data.languages),
        JSON.stringify(data.projects),
      ]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}