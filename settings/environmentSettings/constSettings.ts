const getConstSettings = () => ({
  password: 'Test123!'
})

export const constSettings = getConstSettings()
export type ConstSettings = ReturnType<typeof getConstSettings>
