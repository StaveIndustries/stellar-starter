// Prints every balance (XLM + assets) for ACCOUNT_ID.
// Usage: ACCOUNT_ID=G... npm run balance
import 'dotenv/config';
import { horizon } from './config.js';

async function main() {
  // 1. Read the account id from env (set it after npm run account:create).
  const accountId = process.env.ACCOUNT_ID;
  if (!accountId) throw new Error('Set ACCOUNT_ID in .env first.');

  // 2. Load the account from Horizon.
  const account = await horizon().loadAccount(accountId);

  // 3. Print one line per balance (native XLM shows as "native").
  console.log(`Balances for ${accountId}:`);
  for (const b of account.balances) {
    if (b.asset_type === 'native') {
      console.log(`  XLM: ${b.balance}`);
    } else {
      const line = b as { asset_code: string; asset_issuer: string; balance: string };
      console.log(`  ${line.asset_code} (${line.asset_issuer.slice(0, 8)}...): ${line.balance}`);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
