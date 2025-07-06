import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
const UMAMI_API_KEY = process.env.UMAMI_API_KEY;

export async function handler(event, context) {
  try {
    // 1️⃣ Fetch popular paths from Umami
    const umamiResponse = await fetch(
      `https://umami.conime.id/api/websites/${UMAMI_WEBSITE_ID}/pages?limit=5`,
      {
        headers: { Authorization: `Bearer ${UMAMI_API_KEY}` },
      }
    );

    if (!umamiResponse.ok) {
      return { statusCode: umamiResponse.status, body: 'Umami fetch failed' };
    }

    const umamiData = await umamiResponse.json();
    const paths = umamiData.data.map(item => item.url);

    // 2️⃣ For each path, get content data from Neon
    const results = [];
    for (const path of paths) {
      // Skip list page
      const segments = path.split('/').filter(Boolean);
      if (segments.length < 3) continue;

      const { rows } = await pool.query(
        `SELECT url_path, page_title, created_at, image
         FROM website_event
         WHERE url_path = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [path]
      );

      if (rows.length) {
        const row = rows[0];
        results.push({
          url: row.url_path,
          title: row.page_title || 'Untitled',
          date: row.created_at,
          image: row.image || "/images/default.png",
        });
      }
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(results),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
