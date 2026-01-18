const User = require('../models/User');

// Generate random referral code
function generateReferralCode(name) {
  const namePart = name.toLowerCase().slice(0, 3); // First 3 letters of name
  const digits = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `${namePart}${digits}`;
}

// Ensure referral code is unique
async function generateUniqueReferralCode(name) {
  let code;
  let exists = true;
  while (exists) {
    code = generateReferralCode(name);
    exists = await User.findOne({ myReferralCode: code });
  }
  return code;
}

module.exports = generateUniqueReferralCode;
