import chalk from 'chalk';

export class AbortError extends Error {
  readonly name = 'AbortError';
}

export class CommandError extends Error {
  readonly name = 'CommandError';

  constructor(
    readonly code: string,
    message: string = '',
  ) {
    super(message);
  }
}

export function handleError(error: any) {
  switch (error?.name) {
    case 'AbortError':
      console.warn(chalk.red(`Command aborted: ${error.message}`));
      return process.exit(1);

    case 'CommandError':
      console.warn(chalk.red(`Command failed: ${error.message} (${error.code})`));
      return process.exit(1);

    default:
      throw error;
  }
}
