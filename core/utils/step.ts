import { test } from '@playwright/test'

/**
 * A helper function to wrap actions inside `test.step()`
 * with `{ box: true }`, while also supporting return values.
 *
 * @template T
 * @param {string} name - The step name.
 * @param {() => Promise<T>} fn - The function to execute inside the step.
 * @returns {Promise<T>} - The result of the executed function.
 */
export const step = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  return test.step(name, fn, { box: true })
}
