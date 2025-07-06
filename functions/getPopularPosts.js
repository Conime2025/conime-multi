import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export async function handler(event, context) {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'DATABASE_URL not configured' }),
    };
  }

  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();

    // Ubah query sesuai data event / page yang kamu anggap populer
    const query = `
      SELECT DISTINCT ON (url_path)
        url_path, page_title, created_at
      FROM website_event
      WHERE event_type = 1
      ORDER BY url_path, created_at DESC
      LIMIT 5
    `;

    const res = await client.query(query);

    // Transform ke bentuk yang bisa dipakai di front-end
    const popular = res.rows
      .filter(row => row.url_path && row.url_path != '/')
      .map(row => ({
        url: row.url_path,
        title: row.page_title || 'Popular Post',
        date: row.created_at,
        image: '/images/default.png'  // kamu bisa upgrade kalau mau ambil dari metadata
      }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(popular),
    };
  } catch (error) {
    console.error('Error in getPopularPosts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await client.end();
  }
}
