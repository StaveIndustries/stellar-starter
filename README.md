# Stellar Starter

Clone it and start building on Stellar. A beginner-friendly template with
working examples for accounts, payments, trustlines, wallets, and a first
Soroban contract.

## First 10 minutes

```bash
git clone https://github.com/StaveIndustries/stellar-starter.git
cd stellar-starter
cp .env.example .env
npm install
npm run setup:check   # verifies your .env and testnet connection
npm run account:create # creates + funds a testnet account, prints the secret
npm run balance        # shows the new account balance (ACCOUNT_ID=...)
npm run payment:send  # sends 1 XLM back to itself as a demo
```

Then open `frontend/` (`npm run dev`) to connect a wallet and try the UI,
and read `contracts/hello/README.md` to deploy your first contract.

## Folders

| Folder | What lives here |
|--------|-----------------|
| `scripts/` | Runnable Node+TypeScript examples: create account, fund testnet, send payment, show balance, setup check, trustline example, multisig example |
| `frontend/` | Minimal React app: wallet connect, send payment, transaction history |
| `contracts/hello/` | Soroban "hello" contract (Rust) with deploy steps |
| `contracts/token/` | Soroban token example with tests (see issue #9) |
| `tests/` | Vitest sample tests |
| `.github/workflows/` | CI: tests contracts + app on every PR (see issue #11) |

Every example file is commented line by line. Start with `scripts/`.

## Testnet only

Everything here targets Stellar testnet by default. Never paste a mainnet
secret into `.env`. See `SECURITY.md` notes in CONTRIBUTING.

## Contributing

See `CONTRIBUTING.md`. Good first issues are labeled for newcomers.

## License

MIT â€” see `LICENSE`.
