
import mysql from 'mysql2/promise'
import { RowDataPacket } from 'mysql2'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

interface UrlRow extends RowDataPacket {
    originalurl: string;
}

export default defineEventHandler(async (event) => {
    const slug = event.node.req.url?.slice(1)

    if (slug && slug !== 'api/shorten') {
        try {
            const conn = await pool.getConnection()
            const [rows] = await conn.query<UrlRow[]>('SELECT original FROM urls WHERE slug = ?', [slug])
            conn.release()

            if (rows.length > 0) {
                const originalURL = rows[0].original
                return sendRedirect(event, originalURL, 301)
            } else {
                return sendRedirect(event, '/', 302)
            }
        } catch (error) {
            console.error('Error:', error)
            return sendRedirect(event, '/', 302)
        }
    }
})