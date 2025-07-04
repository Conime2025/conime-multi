export async function handler(event, context) {
  // Umami API config
  const websiteId = '22aa83cf-a325-47ce-824c-ba05044bbcd1';
  const apiKey = 'api_GUqKESZbrRmdfPPFcGpaNARWhPckYMvQ';
  const limit = 3;

  const url = `https://cloud.umami.is/api/websites/${websiteId}/pages?limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: 'Failed to fetch Umami API' })
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
