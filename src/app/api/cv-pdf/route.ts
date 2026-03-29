import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";

// Garante que as colunas existam (roda uma vez por instância do servidor)
let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  await pool.query(
    "ALTER TABLE cv_pdf ADD COLUMN IF NOT EXISTS latex_source LONGTEXT NULL"
  ).catch(() => { });
  await pool.query(
    "ALTER TABLE cv_pdf ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL"
  ).catch(() => { });
  schemaReady = true;
}

export async function GET(request: NextRequest, response: NextResponse) {
  const userId = request.nextUrl.searchParams.get("userId");
  const list = request.nextUrl.searchParams.get("list");

  if (!userId) {
    return NextResponse.json({ error: "Nao foi encontrado um userId nos parametros da URL" }, { status: 400 });
  }

  // Retorna metadados dos CVs salvos como JSON
  if (list === "true") {
    await ensureSchema();
    try {
      const [rows] = await pool.query(
        "SELECT user_id, updated_at, latex_source, name FROM cv_pdf WHERE user_id = ?",
        [userId]
      );

      const result = rows as { user_id: string; updated_at: Date; latex_source: string | null; name: string | null }[];

      const content = result.map((row) => ({
        id: row.user_id,
        name: row.name ?? "Meu Currículo",
        created_at: row.updated_at ? new Date(row.updated_at).toLocaleDateString("pt-BR") : "-",
        latex_source: Buffer.isBuffer(row.latex_source)
          ? (row.latex_source as Buffer).toString('utf8')
          : (row.latex_source ?? ''),
      }));

      return NextResponse.json({ content });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao listar CVs: " + error }, { status: 500 });
    }
  }

  try {
    const [rows] = await pool.query(
      "SELECT pdf_data FROM cv_pdf WHERE user_id = ?",
      [userId]
    );

    const result = rows as { pdf_data: Buffer | null }[];

    if (!result.length || !result[0].pdf_data) {
      return NextResponse.json(
        { success: false, error: "Nenhum PDF encontrado" },
        { status: 404 },
      );
    }

    // Usa o Buffer diretamente (evita o pool do Node.js onde .buffer pode
    // retornar um ArrayBuffer maior que os dados reais do PDF)
    const pdfData = result[0].pdf_data;
    const safeBuffer = pdfData.buffer.slice(
      pdfData.byteOffset,
      pdfData.byteOffset + pdfData.byteLength,
    ) as ArrayBuffer;

    return new NextResponse(safeBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=cv.pdf",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Um erro foi encontrado durante a solicitacao de informacoes de CV salvos: " + error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Nao foi encontrado um userId nos parametros da URL" },
      { status: 400 },
    );
  }

  await ensureSchema();

  try {
    const contentType = req.headers.get("Content-Type") ?? "";

    let pdfBuffer: Buffer;
    let latexSource: string = "";
    let name: string = "Meu Currículo";

    if (contentType.includes("application/json")) {
      // Novo formato: JSON com pdfBase64 + latexSource + name
      const { pdfBase64, latexSource: ls, name: n } = await req.json();
      pdfBuffer = Buffer.from(pdfBase64, "base64");
      latexSource = ls ?? "";
      name = n ?? "Meu Currículo";
    } else {
      // Formato legado: PDF binário direto
      const arrayBuffer = await req.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    }

    // INSERT ou UPDATE automático com base no UNIQUE de user_id
    await pool.query<ResultSetHeader>(
      `INSERT INTO cv_pdf (user_id, pdf_data, latex_source, name)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pdf_data = VALUES(pdf_data), latex_source = VALUES(latex_source), name = VALUES(name), updated_at = NOW()`,
      [userId, pdfBuffer, latexSource, name],
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Nao foi encontrado um userId nos parametros da URL" },
      { status: 400 },
    );
  }

  try {
    await pool.query("DELETE FROM cv_pdf WHERE user_id = ?", [userId]);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}