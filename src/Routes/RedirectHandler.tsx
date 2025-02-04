import { Navigate, useParams } from 'react-router-dom'


// Define specific old paths that need redirection
const redirectMap: Record<string, string> = {
  'create-new-password': '/accounts/reset-password',
  'invite-coach': '/accounts/invitations',
  'invite-player': '/accounts/invitations',
  'invite-parent': '/accounts/invitations',
  'child-parent': '/accounts/invitations',
  'sign-up': '/accounts/signup',
  'create-password-child-invitation': '/invitations',
}

export function RedirectHandler({ basePath }: { basePath: string }) {
  const { token } = useParams()
  const newPath = redirectMap[basePath]

  return newPath ? (
    <Navigate replace to={`${newPath}/${token ? token : ''}`} />
  ) : (
    <Navigate to="/404" />
  )
}
