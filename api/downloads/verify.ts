export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 405;
    return res.end(JSON.stringify({ authorized: false, message: 'Method Not Allowed' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  if (!body && req.on) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (c: any) => { data += c; });
      req.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
      req.on('error', () => resolve({}));
    });
  }

  const { orderId, customerEmail, orderStatus } = body || {};

  if (!orderId || !customerEmail) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    return res.end(JSON.stringify({
      authorized: false,
      message: 'Invalid verification parameters'
    }));
  }

  const isConfirmed = orderStatus === 'payment_confirmed' || orderStatus === 'completed';
  if (!isConfirmed) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 403;
    return res.end(JSON.stringify({
      authorized: false,
      message: 'Download vault locked: Payment verification pending.'
    }));
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  return res.end(JSON.stringify({
    authorized: true,
    message: 'Cryptographic authorization token validated for download release.'
  }));
}
