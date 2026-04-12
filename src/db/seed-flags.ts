/** True when the script was run with `--refresh` (e.g. `pnpm db:seed-verbs -- --refresh`). */
export function argvHasRefresh(): boolean {
  return process.argv.includes('--refresh')
}
