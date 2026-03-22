import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool, getUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId obrigatório" }, { status: 400 });
  }

  try {
    const raw = await getUserById(userId);
    if (!raw) {
      return NextResponse.json({ success: false, error: "Nenhum portfólio encontrado" }, { status: 404 });
    }

    const parseJSON = (value: unknown, fallback: unknown[] = []) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        try { return JSON.parse(value); } catch { return fallback; }
      }
      return fallback;
    };

    const portfolio = {
      nome: raw.nome,
      email: raw.email,
      telefone: raw.telefone,
      localizacao: raw.localizacao,
      github: raw.github,
      linkedin: raw.linkedin,
      website: raw.website,
      perfil: raw.perfil,
      tituloProfissional: raw.titulo_profissional,
      skills: parseJSON(raw.skills),
      experiences: parseJSON(raw.experiencias),
      educations: parseJSON(raw.educacoes),
      certifications: parseJSON(raw.certificacoes),
      languages: parseJSON(raw.idiomas),
      projects: parseJSON(raw.projetos),
      template: raw.template,
    };

    return NextResponse.json({ success: true, data: portfolio });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const fieldValues = [
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
    data.template,
  ];

  try {
    const [existing] = await pool.query(
      'SELECT id FROM portfolio WHERE user_id = ? LIMIT 1',
      [data.userId]
    );
    const rows = existing as { id: number }[];

    if (rows.length > 0) {
      await pool.query(
        `UPDATE portfolio SET
          nome=?, email=?, telefone=?, localizacao=?, github=?, linkedin=?, website=?,
          perfil=?, titulo_profissional=?, skills=?, experiencias=?, educacoes=?,
          certificacoes=?, idiomas=?, projetos=?, template=?
         WHERE user_id=?`,
        [...fieldValues, data.userId]
      );
      return NextResponse.json({ success: true });
    } else {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO portfolio
          (user_id, nome, email, telefone, localizacao, github, linkedin, website, perfil,
           titulo_profissional, skills, experiencias, educacoes, certificacoes, idiomas, projetos, template)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.userId, ...fieldValues]
      );
      return NextResponse.json({ success: true, id: result.insertId });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}