import type { AuthProps } from '@/components/nextekit/auth'

export const authProps: AuthProps = {
  targetAuth: {
    exclude: ['/auth/signin', '/initialize'],
  },
  targetAdmin: {
    require: ['/admin/:path'],
  },
}
