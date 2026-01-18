// utils/cfPrivateKey.js
const { Buffer } = require('buffer');

function getPrivateKeyPem() {
  const b64 = process.env.CLOUDFRONT_PRIVATE_KEY_BASE64;
  if (!b64) throw new Error('Missing CLOUDFRONT_PRIVATE_KEY_BASE64');
  return Buffer.from(b64, 'base64').toString('utf8');
}

module.exports = { getPrivateKeyPem };
