// Shared helpers for the example scripts.
// Every example imports from here so connection logic lives in one place.
import 'dotenv/config';
import { Horizon } from '@stellar/stellar-sdk';

/** Horizon server from HORIZON_URL (testnet by default). */
export function horizon(): Horizon.Server {
  const url = process.env.HORIZON_URL ?? 'https://horizon-testnet.stellar.org';
  return new Horizon.Server(url);
}

/** Network passphrase from NETWORK_PASSPHRASE (testnet default). */
export function networkPassphrase(): string {
  return process.env.NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015';
}

/** Refuse to run destructive examples against mainnet. */
export function assertTestnet(): void {
  const url = process.env.HORIZON_URL ?? '';
  if (url.includes('horizon.stellar.org') && !url.includes('testnet')) {
    throw new Error('Refusing to run against mainnet. Use testnet in .env.');
  }
}
