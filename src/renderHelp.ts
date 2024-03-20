import chalk from 'chalk';

import { detectPackageManager } from './utils/node';

export function renderHelp() {
  const manager = detectPackageManager();

  // Note, template literal is broken with bun build
  // In the future, support:
  //  ${chalk.dim('$')} ${manager} [tool]
  return `
  ${chalk.bold('Usage')}
    ${chalk.dim('$')} ${manager} [tool]

  ${chalk.bold('Options')}
    --version, -v   Version number
    --help, -h      Usage info
  `;
}
