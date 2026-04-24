#!/usr/bin/env node
/**
 * Run from backend folder: node scripts/atlas-connect-debug.js
 * Prints per-server errors (auth vs timeout vs refused) beyond the generic Atlas message.
 */
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI in .env');
  process.exit(1);
}
console.log('Testing:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 25_000,
    connectTimeoutMS: 25_000,
    family: 4,
  })
  .then(() => {
    console.log('SUCCESS: connected');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED:', err.message);
    const servers = err.reason?.servers;
    if (servers?.forEach) {
      servers.forEach((desc, address) => {
        console.error(' ', address, desc?.error?.message || desc?.type);
      });
    }
    process.exit(1);
  });
