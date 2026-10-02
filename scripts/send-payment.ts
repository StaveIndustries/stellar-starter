// Sends 1 XLM from ACCOUNT_SECRET back to itself (demo payment).
// Usage: set ACCOUNT_ID + ACCOUNT_SECRET in .env, then npm run payment:send
import 'dotenv/config';
import { Asset, Horizon, Keypair, Operation, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import { assertTestnet, horizon, networkPassphrase } from './config.js';

async function main() {
  // 1. Safety: never run the demo against mainnet.
  assertTestnet();
  const secret = process.env.ACCOUNT_SECRET;
  if (!secret) throw new Error('Set ACCOUNT_SECRET in .env first.');

  // 2. Load the source account (also the destination for this demo).
  const pair = Keypair.fromSecret(secret);
  const server: Horizon.Server = horizon();
  const source = await server.loadAccount(pair.publicKey());

  // 3. Build a 1 XLM self-payment with a demo memo.
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: networkPassphrase(),
  })
    .addOperation(
      Operation.payment({
        destination: pair.publicKey(),
        asset: Asset.native(),
        amount: '1',
      }),
    )
    .addMemo(Horizon.Memo.text('starter-demo'))
    .setTimeout(120)
    .build();

  // 4. Sign locally and submit.
  tx.sign(pair);
  const result = await server.submitTransaction(tx);
  console.log('Sent! Hash:', result.hash);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
