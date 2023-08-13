import bcrypt from 'bcrypt'

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10)
}

export const checkPassword = (password: string, passwordHash: string) => bcrypt.compareSync(password, passwordHash)
