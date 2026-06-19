export function hasRequiredEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}
