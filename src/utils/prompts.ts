import prompts, { type PromptObject } from 'prompts';

import { env } from './env';
import { AbortError, CommandError } from './errors';

export function prompt(question: PromptObject) {
  if (!isInteractive()) {
    throw new CommandError(
      'NON_INTERACTIVE',
      'Input is required but process is in non-interactive mode.',
    );
  }

  return prompts(question, {
    onCancel() {
      throw new AbortError('Question was not answered');
    },
  });
}

/** Determine if the current process can receive input */
function isInteractive() {
  return !env.CI && process.stdin.isTTY;
}
