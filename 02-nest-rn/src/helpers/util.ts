const bcrypt = require('bcrypt')
const saltRounds = 10

export const hashPasswordHelper = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}
