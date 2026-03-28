import { loadEnvConfig } from "@next/env";

export function loadCliEnv(projectDir = process.cwd()) {
  loadEnvConfig(projectDir);
}
