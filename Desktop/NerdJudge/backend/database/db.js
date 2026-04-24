const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/** Fail fast with a clear message instead of hanging queries on a dead connection. */
mongoose.set('bufferCommands', false);

function logServerSelectionDetails(error) {
  const servers = error.reason?.servers;
  if (!servers || typeof servers.forEach !== 'function') {
    return;
  }
  console.error('Per-server details (helps when the generic whitelist message is misleading):');
  servers.forEach((desc, address) => {
    const errMsg = desc?.error?.message || desc?.error?.codeName || '';
    const state = desc?.type || '';
    console.error(`  ${address}  state=${state}  ${errMsg}`);
  });
}

const DBConnection = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI || !MONGODB_URI.trim()) {
    throw new Error('MONGODB_URI is missing. Set it in backend/.env');
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 25_000,
      connectTimeoutMS: 25_000,
      // Prefer IPv4 — some networks break IPv6 routes to Atlas; Atlas then often
      // surfaces the generic "whitelist" error even when 0.0.0.0/0 is allowed.
      family: 4,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    logServerSelectionDetails(error);
    console.error(
      'Also verify: (1) Atlas cluster is not Paused — open Atlas → Database → Resume if shown. ' +
        '(2) Network Access rule is for the same Atlas project as this cluster. ' +
        '(3) School/office Wi‑Fi often blocks port 27017 — try a phone hotspot or home network. ' +
        '(4) Database user + password in Atlas → Database Users match this URI.'
    );
    throw error;
  }
};

module.exports = { DBConnection };
