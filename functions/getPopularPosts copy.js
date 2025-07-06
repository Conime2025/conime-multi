const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const websiteId = process.env.UMAMI_WEBSITE_ID;

    // hanya posts/section/slug/
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
