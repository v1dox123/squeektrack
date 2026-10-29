# Squeek Pit Crew 🐹

A tiny hamster-cam companion for **Squeekchain (Sepolia testnet)**, made for Squeekchain Genesis CODE.
It's one static `index.html`: no backend, no keys. Your own injected wallet signs everything.

- **Live hamster:** SPINNING/IDLE, wheel RPM, speed, total work, block height with progress to the next block, economy round, 24h settlements. Data comes from the public read-only API `https://api.squeekchain.com/v1` and refreshes every 15s. `"status":"unavailable"` shows as unknown, never as zero.
- **🏁 Pit stop ping:** connects your wallet, switches it to Sepolia (11155111), **simulates** `SqueekToken.approve(SqueekMining, 0)` and then sends it. It's a harmless zero-allowance transaction (gas only) so anyone can make a first Squeekchain transaction.
- **⏱ Run checkpoint:** reads `SqueekMining.checkpointStatus()` every 30s. The button only turns on when the core isn't paused and a settled round is ready. It simulates `checkpoint()` first and, if that reverts, decodes the error from the ABI (for example `RoundNotSettled`) and stops.

## Quick start

```bash
npm install          # only needed for build/verify scripts (viem)
node build.mjs       # re-fetches addresses + ABIs from docs.squeekchain.com, writes dist/
npx serve dist       # or: python3 -m http.server -d dist 8080
```
Open the page in a browser that has MetaMask, Rabby or a similar wallet, with some Sepolia ETH. `node verify.mjs` checks the API endpoints, the on-chain `checkpointStatus()` read and both simulations.

## Sources (the only ones used)
- Addresses: https://docs.squeekchain.com/assets/deployments/sepolia.json (fetched at build time and again at runtime, with the bundled copy as fallback)
  - SqueekToken `0x6872bfa5ccc3e9e440c6c16e5ffdabb8dba4cc76`
  - SqueekMining `0x3beE588fC20dE788Bac17d33b41Da7346cb27EC4`
- ABIs: https://docs.squeekchain.com/assets/abi/SqueekToken.json, SqueekMining.json (in `abi/`)
- viem 2.21.54 from esm.sh (jsDelivr fallback); RPC: ethereum-sepolia-rpc.publicnode.com

## Files
`index.html` (the app) · `abi/` · `deployments.sepolia.json` · `build.mjs` · `verify.mjs` · `dist/` (deployable output)

## Note
The docs deployments and the API's `/v1/economy/state` `identities` currently name **different** contract sets. This app follows the docs file, as required. Testnet only.

MIT licensed.
