// Setup check: verifies .env exists, Horizon is reachable, and (optionally)
// ACCOUNT_ID exists on the network. Run: npm run setup:check
import 'dotenv/config';
import * as fs from 'node:fs';
import { horizon } from './config.js';

async function main() {
  let ok = true;

  // 1. .env file present?
  if (!fs.existsSync('.env')) {
    console.error('FAIL: .env missing - copy .env.example to .env first.');
    ok = false;
  } else {
    console.log('OK: .env found.');
  }

  // 2. Horizon reachable?
  try {
    const res = await fetch(`${process.env.HORIZON_URL ?? 'https://horizon-testnet.stellar.org'}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('OK: Horizon reachable.');
  } catch {
    console.error('FAIL: Horizon unreachable - check HORIZON_URL.');
    ok = false;
  }

  // 3. Account exists (only if ACCOUNT_ID set)?
  const accountId = process.env.ACCOUNT_ID;
  if (accountId) {
    try {
      await horizon().loadAccount(accountId);
      console.log(`OK: account ${accountId.slice(0, 8)}... exists.`);
    } catch {
      console.error('FAIL: ACCOUNT_ID not found - run npm run account:create.');
      ok = false;
    }
  } else {
    console.log('SKIP: ACCOUNT_ID not set yet (run npm run account:create).');
  }

  if (!ok) process.exit(1);
  console.log('Setup looks good!');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
