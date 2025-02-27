import { Navigate, useParams } from 'react-router-dom'


// Define specific old paths that need redirection
const redirectMap: Record<string, string> = {
  'create-new-password': '/accounts/reset-password',
  'invite-coach': '/accounts/onboarding',
  'invite-player': '/accounts/onboarding',
  'invite-parent': '/accounts/onboarding',
  'child-parent': '/accounts/onboarding',
  'sign-up': '/accounts/signup',
  'create-password-child-invitation': '/invitations',
}

export function RedirectHandler({ basePath }: { basePath: string }) {
  const { token, accepted } = useParams()
  const newPath = redirectMap[basePath]

  return newPath ? (
    <Navigate replace to={`${newPath}/${token ? token : ''}${accepted ? `/${accepted}` : ''}`}  />
  ) : (
    <Navigate to="/404" />
  )
}
