import { hashPassword } from '../src/helpers/password'
import { prisma } from '../src/helpers/prisma'

async function main() {
  await prisma.user.create({
    data: {
      name: 'admin',
      passwordHash: hashPassword('lab@user00'),
      isAdmin: true,
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
