import { boolish } from 'getenv';

export const env = {
  get CI() {
    return boolish('CI', false);
  },
};
