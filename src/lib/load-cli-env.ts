import { loadEnvConfig } from "@next/env";

export function loadCliEnv(
  projectDir = process.cwd(),
  nodeEnv: "development" | "production" | "test" =
    process.env.NODE_ENV === "production" ? "production" : "development",
) {
  const mutableEnv = process.env as NodeJS.ProcessEnv & {
    NODE_ENV?: string;
  };
  const previousNodeEnv = mutableEnv.NODE_ENV;
  mutableEnv.NODE_ENV = nodeEnv;

  try {
    loadEnvConfig(projectDir, nodeEnv !== "production", undefined, true);
  } finally {
    if (previousNodeEnv === undefined) {
      Reflect.deleteProperty(mutableEnv, "NODE_ENV");
    } else {
      mutableEnv.NODE_ENV = previousNodeEnv;
    }
  }
}
