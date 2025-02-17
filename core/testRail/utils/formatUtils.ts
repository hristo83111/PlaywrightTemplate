import { TestInfoError } from '@playwright/test'

/**
 * Formats a duration in milliseconds into a human-readable string (minutes and seconds).
 *
 * This function takes a duration in milliseconds and converts it into a string formatted as either
 * "Xm Ys" (for durations over 60 seconds) or "Ys" (for durations under 60 seconds), where X is the
 * number of minutes and Y is the number of seconds.
 *
 * @param durationMs - The duration in milliseconds to be formatted.
 *
 * @returns A string representing the duration in a human-readable format.
 *          For example, "2m 30s" or "45s".
 *
 * @example
 * const formattedDuration = formatDuration(75000)
 * console.log(formattedDuration)  // Output: "1m 15s"
 */
export const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

/**
 * Formats an array of `TestInfoError` objects into a clean string representation.
 *
 * This function iterates over each `TestInfoError` in the `testInfoErrors` array and, if a stack trace
 * is available, it removes any terminal escape codes (such as color codes used in CLI outputs)
 * and any lines containing five or more consecutive equal signs (`=====`), which are commonly
 * used as separators in error logs. The resulting stack trace is then concatenated into a single string.
 *
 * If no `TestInfoError` objects are provided, or the array is empty, the function returns just a newline character (`\n`).
 *
 * @param testInfoErrors - An array of `TestInfoError` objects that contain error stack traces.
 *
 * @returns A string containing the formatted stack traces. If no errors are provided, it returns a newline character.
 *
 * @example
 * const errors = [
 *   { stack: "Error: Something went wrong\n=====\n at function1" },
 *   { stack: "Error: Another issue\n=====\n at function2" }
 * ];
 * const formattedErrors = formatTestInfoError(errors);
 * console.log(formattedErrors);  // Output: formatted error messages without escape codes or "=====" lines
 */
export const formatTestInfoError = (
  testInfoErrors: TestInfoError[]
): string => {
  if (!testInfoErrors || testInfoErrors.length === 0) {
    return '\n'
  }

  let result = ''

  for (const testInfoError of testInfoErrors) {
    if (testInfoError.stack) {
      // Remove remaining escape codes and replace '=====' lines
      const formattedStack = testInfoError.stack
        // eslint-disable-next-line no-control-regex
        .replace(/[\u001B]\[\d+m/g, '')
        .replace(/={5,}/g, '')

      result += `${formattedStack}\n`
    }
  }

  return `\n${result}`
}

/**
 * Formats the current date and time in a specific format (DD-MM-YYYY HH:MM:SS).
 *
 * This function retrieves the current date and time using `new Date()` and then formats it into
 * a human-readable string. The resulting string has the format:
 * - Day-Month-Year Hour:Minute:Second (e.g., "17-02-2025 13:45:30").
 *
 * The function uses ISO string representation of the date and time, extracting and reordering the
 * components to fit the desired format.
 *
 * @returns A string representing the current date and time in the format "DD-MM-YYYY HH:MM:SS".
 *
 * @example
 * const formattedDate = formatTestRunDate();
 * console.log(formattedDate);  // Output: "17-02-2025 13:45:30" (depending on the current date and time)
 */
export const formatTestRunDate = (): string => {
  const now = new Date()
  const [year, month, day] = now.toISOString().slice(0, 10).split('-')
  const time = now.toISOString().slice(11, 19)

  return `${day}-${month}-${year} ${time}`
}
