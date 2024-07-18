import type { AuthProps } from '@/components/nextekit/auth'

export const authProps: AuthProps = {
  targetAuth: {
    exclude: ['/auth/signin', '/initialize', '/pwreset/:path', '/oauth/:path', '/mlchange/:path'],
  },
  targetAdmin: {
    require: ['/admin/:path'],
  },
}
