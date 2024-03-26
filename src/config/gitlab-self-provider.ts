import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/'
import { GitLabProfile } from 'next-auth/providers/gitlab'
import urljoin from 'url-join'

export const GitLabSelfProvider = <P extends GitLabProfile>(
  gitlabUrl: string,
  options: OAuthUserConfig<P>,
): OAuthConfig<P> => {
  return {
    id: 'gitlab',
    name: 'GitLab',
    type: 'oauth',
    authorization: {
      url: urljoin(gitlabUrl, '/oauth/authorize'),
      params: { scope: 'read_user' },
    },
    token: urljoin(gitlabUrl, '/oauth/token'),
    userinfo: urljoin(gitlabUrl, '/api/v4/user'),
    checks: ['pkce', 'state'],
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    style: { logo: '/gitlab.svg', bg: '#FC6D26', text: '#fff' },
    options,
  }
}
