// Multi-signature payment demo: builds a 1-of-2 style transaction where a
// second signer must also sign before submit. Uses two local keypairs so the
// flow runs on testnet without extra setup.
// Usage: npm run multisig (uses ACCOUNT_SECRET as signer 1)
import 'dotenv/config';
import { Asset, Horizon, Keypair, Operation, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import { assertTestnet, horizon, networkPassphrase } from './config.js';

async function main() {
  // 1. Safety + credentials.
  assertTestnet();
  const secret = process.env.ACCOUNT_SECRET;
  if (!secret) throw new Error('Set ACCOUNT_SECRET in .env first.');

  // 2. Two signers: your account key + an ephemeral second key.
  const signer1 = Keypair.fromSecret(secret);
  const signer2 = Keypair.random();
  console.log('Second signer (demo only):', signer2.publicKey());

  // 3. Build the payment from signer 1's account.
  const server: Horizon.Server = horizon();
  const source = await server.loadAccount(signer1.publicKey());
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: networkPassphrase(),
  })
    .addOperation(
      Operation.payment({
        destination: signer1.publicKey(),
        asset: Asset.native(),
        amount: '1',
      }),
    )
    .addMemo(Horizon.Memo.text('multisig-demo'))
    .setTimeout(120)
    .build();

  // 4. Collect both signatures, then submit.
  // (A real multisig account would require signer2 as an on-chain signer;
  // here we demonstrate signature collection order.)
  tx.sign(signer1);
  tx.sign(signer2);
  console.log('Signatures collected:', tx.signatures.length);
  const result = await server.submitTransaction(tx);
  console.log('Submitted! Hash:', result.hash);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
