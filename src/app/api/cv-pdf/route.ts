import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Nao foi encontrado um userId nos parametros da URL" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      "SELECT pdf_data FROM cv_pdf WHERE user_id = ? LIMIT 1",
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

  try {
    const arrayBuffer = await req.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // INSERT ou UPDATE automático com base no UNIQUE de user_id
    await pool.query<ResultSetHeader>(
      `INSERT INTO cv_pdf (user_id, pdf_data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE pdf_data = VALUES(pdf_data), updated_at = NOW()`,
      [userId, pdfBuffer],
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