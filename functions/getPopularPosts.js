const { Client } = require('pg');

let cachedResult = null;
let cachedTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 menit dalam ms

exports.handler = async (event, context) => {
  const now = Date.now();

  // kalau cache masih valid
  if (cachedResult && (now - cachedTimestamp) < CACHE_TTL) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedResult)
    };
  }

  // fresh fetch ke DB
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const websiteId = process.env.UMAMI_WEBSITE_ID;

    const { rows } = await client.query(`
      SELECT url_path, MAX(created_at) AS last_date
      FROM website_event
      WHERE website_id = $1
        AND created_at >= NOW() - INTERVAL '7 days'
        AND url_path ~ '^/posts/[^/]+/[^/]+/?$'
      GROUP BY url_path
      ORDER BY COUNT(*) DESC
      LIMIT 10;
    `, [websiteId]);

    const popularUrls = rows.map(r => ({
      url: r.url_path,
      date: r.last_date
    }));

    // simpan ke cache
    cachedResult = popularUrls;
    cachedTimestamp = now;

    return {
      statusCode: 200,
      body: JSON.stringify(popularUrls)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};
