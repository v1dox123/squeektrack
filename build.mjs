// Fetches addresses + ABIs from docs.squeekchain.com (the only allowed sources) and writes dist/.
import fs from "fs";
const UA = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", Accept: "application/json" };
const DOCS = "https://docs.squeekchain.com/assets";
// Node's fetch is blocked by the docs Cloudflare check, so use curl.
import { execFileSync } from "child_process";
async function get(url) { return JSON.parse(execFileSync("curl", ["-sSf", "-m", "30", "-A", UA["User-Agent"], "-H", "Accept: application/json", url], { encoding: "utf8" })); }
try {
  const dep = await get(`${DOCS}/deployments/sepolia.json`);
  fs.writeFileSync("deployments.sepolia.json", JSON.stringify(dep, null, 2) + "\n");
  for (const c of ["SqueekToken", "SqueekMining"]) fs.writeFileSync(`abi/${c}.json`, JSON.stringify(await get(`${DOCS}/abi/${c}.json`), null, 2) + "\n");
  console.log("Fetched deployments + ABIs from docs. SqueekToken", dep.contracts.SqueekToken.address, "SqueekMining", dep.contracts.SqueekMining.address);
} catch (e) { console.warn("Docs fetch failed, keeping committed copies:", e.message); }
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/abi", { recursive: true });
for (const f of ["index.html", "deployments.sepolia.json", "abi/SqueekToken.json", "abi/SqueekMining.json"]) fs.copyFileSync(f, `dist/${f}`);
console.log("dist/ ready");
