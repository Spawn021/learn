const bcrypt = require('bcrypt')

export const hashPasswordHelper = async (password: string): Promise<string> => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}
export const comparePasswordHelper = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}
