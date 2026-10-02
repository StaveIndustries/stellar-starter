// Adds a USDC trustline to ACCOUNT_ID (testnet).
// Trustlines are required before an account can hold a non-native asset.
// Usage: set ACCOUNT_ID + ACCOUNT_SECRET in .env, then npm run trustline
import 'dotenv/config';
import { Asset, Horizon, Keypair, Operation, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import { assertTestnet, horizon, networkPassphrase } from './config.js';

// Testnet USDC issuer (Circle testnet). Mainnet uses a different issuer.
const TESTNET_USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

async function main() {
  // 1. Safety + credentials.
  assertTestnet();
  const secret = process.env.ACCOUNT_SECRET;
  if (!secret) throw new Error('Set ACCOUNT_SECRET in .env first.');

  // 2. Build a changeTrust operation for USDC (no limit = maximum).
  const pair = Keypair.fromSecret(secret);
  const server: Horizon.Server = horizon();
  const source = await server.loadAccount(pair.publicKey());
  const usdc = new Asset('USDC', TESTNET_USDC_ISSUER);

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: networkPassphrase(),
  })
    .addOperation(Operation.changeTrust({ asset: usdc }))
    .setTimeout(120)
    .build();

  // 3. Sign + submit, then verify with npm run balance.
  tx.sign(pair);
  const result = await server.submitTransaction(tx);
  console.log('Trustline added! Hash:', result.hash);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
