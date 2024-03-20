export type PackageManager = 'bun' | 'yarn' | 'npm' | 'pnpm';

/**
 * Detect the currently used package manager.
 * This looks up the `npm_config_user_agent` environment variable.
 */
export function detectPackageManager(): PackageManager {
  const header = process.env.npm_config_user_agent;

  if (header?.startsWith('bun/')) {
    return 'bun';
  } else if (header?.startsWith('yarn/')) {
    return 'yarn';
  } else if (header?.startsWith('npm/')) {
    return 'npm';
  } else if (header?.startsWith('pnpm/')) {
    return 'pnpm';
  }

  return 'npm';
}
