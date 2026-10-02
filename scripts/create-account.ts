// Creates a Stellar keypair, funds it with friendbot (testnet), and prints
// the address + secret. Save the secret into .env as ACCOUNT_SECRET.
import 'dotenv/config';
import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { horizon } from './config.js';

async function main() {
  // 1. Generate a fresh random keypair (local only, nothing on-chain yet).
  const pair = Keypair.random();
  console.log('Address:', pair.publicKey());
  console.log('Secret: ', pair.secret());
  console.log('Save the secret into .env as ACCOUNT_SECRET (testnet only!).');

  // 2. Fund it via friendbot so the account exists on testnet.
  const server = horizon();
  const friendbotUrl = 'https://friendbot.stellar.org';
  console.log('Funding via friendbot...');
  const res = await fetch(`${friendbotUrl}?addr=${pair.publicKey()}`);
  if (!res.ok) throw new Error(`Friendbot failed: ${res.status}`);
  console.log('Funded! Verify with: ACCOUNT_ID=<addr> npm run balance');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
