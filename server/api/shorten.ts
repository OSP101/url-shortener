
import mysql from 'mysql2/promise'
import { nanoid } from 'nanoid'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default defineEventHandler(async (event) => {
  const { originalURL, customSlug } = await readBody(event)

  let slug = customSlug ? customSlug.slice(0, 8) : nanoid(8)

  try {
    const conn = await pool.getConnection()

    if (customSlug) {
      const [rows] = await conn.query('SELECT * FROM urls WHERE slug = ?', [customSlug])
      if (Array.isArray(rows) && rows.length > 0) {
        conn.release()
        return { error: 'This shortened URL is already used. Please choose another one.',number: 1 }
      }
    }

    const [result] = await conn.query('INSERT INTO urls (original, slug) VALUES (?, ?)', [originalURL, slug])

    conn.release()

    const shortenedURL = `${event.node.req.headers.host}/${slug}`
    return { shortenedURL,originalURL,number:2 }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'เกิดข้อผิดพลาดในการย่อ URL' }
  }
})
