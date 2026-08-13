// Vercel Serverless Function API (/api/analytics)

// In-memory session counter for Vercel Serverless Function
// Note: In serverless environments, in-memory state is maintained per function instance and reset on cold starts.
let memoryStore = {
  views: 0,
  downloads: 0,
  lastUpdated: new Date().toISOString()
};

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: memoryStore
    });
  }

  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'increment_views') {
      memoryStore.views += 1;
    } else if (action === 'increment_downloads') {
      memoryStore.downloads += 1;
    }
    memoryStore.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Analytics action '${action}' processed by Vercel Serverless API`,
      data: memoryStore
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
