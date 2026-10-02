import { useEffect, useState } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';

// Minimal wallet example: connect Freighter, show address + XLM balance,
// send 1 XLM to self, list recent transactions.
const HORIZON = import.meta.env.VITE_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    freighterApi?: any;
  }
}

export default function App() {
  // Connected wallet address (empty = not connected).
  const [address, setAddress] = useState('');
  // XLM balance string once loaded.
  const [balance, setBalance] = useState('');
  // Recent transaction hashes for the history demo.
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Connect: ask Freighter for the public key, then load balances + history.
  async function connect() {
    setError('');
    try {
      if (!window.freighterApi) throw new Error('Install a Freighter-compatible wallet first.');
      const key: string = await window.freighterApi.getPublicKey();
      setAddress(key);
      const server = new StellarSdk.Horizon.Server(HORIZON);
      const account = await server.loadAccount(key);
      const native = account.balances.find((b) => b.asset_type === 'native');
      setBalance(native?.balance ?? '0');
      const txs = await server.transactions().forAccount(key).order('desc').limit(5).call();
      setHistory(txs.records.map((t) => t.hash));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connect failed.');
    }
  }

  // Send 1 XLM to self (demo): build, Freighter-sign, submit, refresh.
  async function sendSelf() {
    setError('');
    try {
      const server = new StellarSdk.Horizon.Server(HORIZON);
      const source = await server.loadAccount(address);
      const tx = new StellarSdk.TransactionBuilder(source, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: address,
            asset: StellarSdk.Asset.native(),
            amount: '1',
          }),
        )
        .setTimeout(120)
        .build();
      const { signedTxXdr } = await window.freighterApi.signTransaction(tx.toXDR(), {
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });
      const signed = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, StellarSdk.Networks.TESTNET);
      const result = await server.submitTransaction(signed);
      setHistory((h) => [result.hash, ...h]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed.');
    }
  }

  useEffect(() => {
    document.title = 'Stellar Starter';
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 16 }}>
      <h1>Stellar Starter</h1>
      {!address ? (
        <button onClick={connect}>Connect wallet</button>
      ) : (
        <div>
          <p>Address: <code>{address}</code></p>
          <p>XLM balance: <strong>{balance}</strong></p>
          <button onClick={sendSelf}>Send 1 XLM to self</button>
          <h2>Recent transactions</h2>
          {history.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul>
              {history.map((h) => (
                <li key={h}><code>{h.slice(0, 12)}...</code></li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
