export async function handler() {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;

  const limit = 10;
  const url = `https://umami.conime.id/api/websites/${websiteId}/events?limit=${limit}&type=pageview`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: 'Failed to fetch Umami API', details: await res.text() })
      };
    }

    const rawData = await res.json();

    // ⚡ Filter hanya posts/{category}/{slug}/
    const filtered = rawData.data
      .map(item => {
        let path = item.url;
        // buang trailing slash
        path = path.replace(/\/$/, '');
        return { ...item, path };
      })
      .filter(item => {
        const parts = item.path.split('/').filter(Boolean);
        return parts.length >= 3 && parts[0] === 'posts';
      });

    // hapus duplikat path
    const uniquePaths = Array.from(new Set(filtered.map(item => item.path)));

    // mapping manual untuk gambar
    const imageMap = {
      "posts/anime/dandadan-season-2-trailer-jadwal-20250601": "/images/anime/dandadan.jpg",
      "posts/anime/kimetsu-no-yaiba-infinity-castle-film-trailer-20250630": "/images/anime/kimetsu.jpg",
      "posts/anime/kaoru-hana-wa-rin-to-saku-teaser-pv-visual-202507": "/images/anime/kaoruhana.jpg",
      "posts/anime/jigoku-sensei-nube-2025-trailer-jadwal-20250701": "/images/anime/nube.jpg",
      "posts/anime/anime-gachiakuta-penayangan-global-lagu-tema-karakter-baru-20250630": "/images/anime/gachiakuta.jpg",
      // tambahkan mapping lain sesuai kontenmu
    };

    const result = uniquePaths.slice(0, 5).map(path => {
      const match = filtered.find(item => item.path === path);
      return {
        url: `/${path}/`,
        title: match.title,
        date: match.createdAt || new Date().toISOString(),
        image: imageMap[path] || "/images/default.png"
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
