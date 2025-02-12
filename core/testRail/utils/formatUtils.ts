import { TestInfoError } from '@playwright/test'

export const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

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
export const formatTestRunDate = (): string => {
  const now = new Date()
  const [year, month, day] = now.toISOString().slice(0, 10).split('-')
  const time = now.toISOString().slice(11, 19)

  return `${day}-${month}-${year} ${time}`
}
