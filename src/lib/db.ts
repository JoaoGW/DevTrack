import mysql from 'mysql2/promise';

// Pool de conexões — não conecta na importação, evita falha no módulo
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// Cria um novo item dentro da tabela no Database
export async function createItem(userId: string, description: string) {
  try {
    const [result] = await pool.query(
      'INSERT INTO portfolio (user_id, description) VALUES (?, ?)',
      [userId, description]
    );
    return result;
  } catch (err) {
    console.error(err);
  }
}

// Atualiza um item específico
export async function updateItem(userId: string, itemId: number, newDescription: string) {
  try {
    const [result] = await pool.query(
      'UPDATE portfolio SET description = ? WHERE user_id = ?',
      [newDescription, itemId, userId]
    );
    return result;
  } catch (err) {
    console.error(err);
  }
}

// Deletar um item específico
export async function deleteItem(userId: string, itemId: number) {
  try {
    await pool.query(
      'DELETE FROM portfolio WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );
  } catch (err) {
    console.error(err);
  }
}

// Deletar TODOS os itens de um usuário (limpar array)
export async function deleteAllUserItems(userId: string) {
  try {
    await pool.query(
      'DELETE FROM portfolio WHERE user_id = ?',
      [userId]
    );
  } catch (err) {
    console.error(err);
  }
}

// Seleciona um usuário específico para buscar suas informações - GenPortfolio
export async function getUserById(userId: string) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );
    return (rows as Record<string, unknown>[])[0] ?? null;
  } catch (err) {
    console.error(err)
  }
}