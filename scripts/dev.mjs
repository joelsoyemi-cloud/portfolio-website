import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// Accept the generic host/port flags used by the preview supervisor and
// translate them into Next.js flags. Direct npm run dev still works normally.
const require = createRequire(import.meta.url);
const args = process.argv
  .slice(2)
  .filter((arg) => arg !== "--strictPort")
  .map((arg) => (arg === "--host" ? "--hostname" : arg));
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", "--webpack", ...args],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
