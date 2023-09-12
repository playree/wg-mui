import { hashPassword } from '../src/helpers/password'
import { prisma } from '../src/helpers/prisma'

async function main() {
  const admin = await prisma.user.findUnique({ where: { name: 'admin' } })
  if (!admin) {
    console.log('create admin')
    await prisma.user.create({
      data: {
        name: 'admin',
        passwordHash: hashPassword('lab@user00'),
        isAdmin: true,
      },
    })
  }

  const testuser = await prisma.user.findUnique({ where: { name: 'testuser' } })
  if (!testuser) {
    console.log('create testuser')
    await prisma.user.create({
      data: {
        name: 'testuser',
        passwordHash: hashPassword('lab@user00'),
        isAdmin: false,
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
