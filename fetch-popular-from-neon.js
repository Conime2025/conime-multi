const pg = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Pool = pg.Pool;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function getPopularPages() {
  try {
    console.log("🔗 Connecting to Neon...");

    const client = await pool.connect();

    // ✅ Query yang sesuai dengan kolom website_event
    const query = `
      SELECT url_path AS url, COUNT(*) AS visits
      FROM website_event
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND event_type = 1
        AND url_path IS NOT NULL
      GROUP BY url
      ORDER BY visits DESC
      LIMIT 20
    `;

    const result = await client.query(query);

    client.release();

    const pages = result.rows.map(row => row.url);

    console.log("✅ Popular pages fetched:", pages);

    // Write to /data
    const outputPath = path.resolve('./data/popular.json');
    fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
    console.log(`✅ Written to ${outputPath}`);

    process.exit(0);
  } catch (err) {
    console.error("💥 Error:", err);
    process.exit(1);
  }
}

getPopularPages();
