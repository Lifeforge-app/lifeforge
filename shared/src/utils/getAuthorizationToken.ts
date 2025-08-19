import { parse as parseCookie } from 'cookie'

export default function getAuthorizationToken() {
  const cookies = parseCookie(document.cookie)

  const session = cookies.session || cookies.token

  return session
}
