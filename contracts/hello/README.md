# Hello contract

Minimal Soroban contract storing one greeting per caller.

## Build and test

```bash
cargo test    # runs set_and_get_roundtrip (no network needed)
stellar contract build
```

## Deploy to testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

Then call it from the frontend example (`frontend/src/App.tsx` pattern) using
the deployed contract ID.
