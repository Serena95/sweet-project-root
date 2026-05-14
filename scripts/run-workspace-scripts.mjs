import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const [, , scriptName, ...workspaceDirs] = process.argv;

if (!scriptName || workspaceDirs.length === 0) {
  console.error("Usage: node scripts/run-workspace-scripts.mjs <script> <workspace-dir...>");
  process.exit(1);
}

for (const workspaceDir of workspaceDirs) {
  const packageJsonPath = join(workspaceDir, "package.json");
  if (!existsSync(packageJsonPath)) continue;

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  if (!packageJson.scripts?.[scriptName]) continue;

  console.log(`\n> ${packageJson.name ?? workspaceDir}: ${scriptName}`);
  const result = spawnSync("bun", ["run", scriptName], {
    cwd: workspaceDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}