/**
 * Local MongoDB launcher (no Atlas required):
 *  1) If something is already listening on 27017 → use mongodb://127.0.0.1:27017/nerdjudge (e.g. Docker: docker compose up -d)
 *  2) Else if a system mongod exists (Homebrew) → mongodb-memory-server uses it (no big download)
 *  3) Else → download embedded MongoDB binary (first run needs network)
 *
 * Override system binary: MONGOMS_SYSTEM_BINARY=/path/to/mongod
 */
require('dotenv').config();
const fs = require('fs');
const net = require('net');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

function portOpen(host, port, ms = 2000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.setTimeout(ms);
    socket.on('timeout', () => {
      try {
        socket.destroy();
      } catch (_) {
        /* ignore */
      }
      resolve(false);
    });
    socket.on('error', () => resolve(false));
  });
}

function findSystemMongod() {
  if (process.env.MONGOMS_SYSTEM_BINARY && fs.existsSync(process.env.MONGOMS_SYSTEM_BINARY)) {
    return process.env.MONGOMS_SYSTEM_BINARY;
  }
  const candidates = ['/opt/homebrew/bin/mongod', '/usr/local/bin/mongod'];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (_) {
      /* ignore */
    }
  }
  return undefined;
}

async function main() {
  const on27017 = await portOpen('127.0.0.1', 27017);
  if (on27017) {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/nerdjudge';
    // eslint-disable-next-line no-console
    console.error('[local-mongo] Using existing MongoDB on 127.0.0.1:27017');
  } else {
    const systemBinary = findSystemMongod();
    const mongod = await MongoMemoryServer.create({
      ...(systemBinary ? { binary: { systemBinary } } : {}),
      instance: { dbName: 'nerdjudge' },
    });
    process.env.MONGODB_URI = mongod.getUri();
    global.__nerdjudge_mongod = mongod;
    // eslint-disable-next-line no-console
    console.error(
      '[local-mongo] Started embedded MongoDB:',
      systemBinary ? `(system binary: ${systemBinary})` : '(downloaded binary)',
      process.env.MONGODB_URI
    );
  }

  const shutdown = async () => {
    try {
      await mongoose.disconnect();
    } catch (_) {
      /* ignore */
    }
    if (global.__nerdjudge_mongod) {
      try {
        await global.__nerdjudge_mongod.stop();
      } catch (_) {
        /* ignore */
      }
    }
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  require('../index.js');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[local-mongo] Failed:', err.message);
  // eslint-disable-next-line no-console
  console.error('Tip: run from repo root `docker compose up -d` or install MongoDB (brew install mongodb-community) and `brew services start mongodb-community`.');
  process.exit(1);
});
