// Node check: API endpoints + on-chain checkpointStatus read + simulations.
import { createPublicClient, http } from "viem"; import { sepolia } from "viem/chains"; import fs from "fs";
import { execFileSync } from "child_process";
const curl = (u) => JSON.parse(execFileSync("curl", ["-sSf", "-m", "30", "-A", H["User-Agent"], u], { encoding: "utf8" }));
const H = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" };
for (const p of ["/status", "/economy/state", "/settlements?range=24h"]) {
  const j = curl("https://api.squeekchain.com/v1" + p);
  console.log(p, "status:", j.status ?? "(none)", p === "/status" ? `core=${j.measurement?.coreStatus} rpmMilli=${j.measurement?.rpmMilli} height=${j.builder?.anchor?.blockHeight} progress=${j.builder?.anchor?.blockProgress}` : "");
}
const dep = JSON.parse(fs.readFileSync("deployments.sepolia.json"));
const M = dep.contracts.SqueekMining.address, T = dep.contracts.SqueekToken.address;
const c = createPublicClient({ chain: sepolia, transport: http("https://ethereum-sepolia-rpc.publicnode.com") });
const mAbi = JSON.parse(fs.readFileSync("abi/SqueekMining.json")), tAbi = JSON.parse(fs.readFileSync("abi/SqueekToken.json"));
console.log("checkpointStatus [corePaused,nextRound,roundSettled]:", await c.readContract({ address: M, abi: mAbi, functionName: "checkpointStatus" }));
const acct = "0x000000000000000000000000000000000000dEaD";
await c.simulateContract({ address: T, abi: tAbi, functionName: "approve", args: [M, 0n], account: acct }); console.log("simulate approve(SqueekMining,0): OK");
try { await c.simulateContract({ address: M, abi: mAbi, functionName: "checkpoint", account: acct }); console.log("simulate checkpoint: OK"); }
catch (e) { console.log("simulate checkpoint reverted (decoded):", e.walk?.(x => x.data?.errorName)?.data?.errorName ?? e.shortMessage); }
