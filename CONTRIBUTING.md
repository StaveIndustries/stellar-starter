# Contributing to Stellar Starter

Thanks for contributing! A few ground rules:

1. Check the open issues - `good first issue` ones are beginner-friendly.
2. Keep changes small and focused; one issue per pull request.
3. Run the checks before pushing:
   - `npm test` (root Vitest samples)
   - `cd contracts/hello && cargo test` (if you touched the contract)
   - `cd frontend && npm run build` (if you touched the app)
4. Comment your code - this is a teaching repo, every example should explain itself.
5. Testnet only. Never commit secrets. Never paste a mainnet key anywhere.

## Project layout

- `scripts/` - runnable Node+TS Stellar examples.
- `frontend/` - minimal React demo app.
- `contracts/hello/` - example Soroban contract.
- `contracts/token/` - token example (see issue #9).
- `tests/` - Vitest samples.
