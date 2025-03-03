import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import { InvitationError } from '@/pages/Account/Onboarding/components/InvitationError.tsx'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useInvitation } from '@/hooks/useInvitation.ts'

const {
  Page,
  Styles: { Body },
} = Layout

/**
 * The `Onboarding` component handles the invitation-based onboarding flow for users.
 * It retrieves prefilled user data and invitation details using a token, and navigates
 * users to the appropriate page based on their account status.
 *
 * The component:
 * - Fetches prefilled data using a token from URL parameters.
 * - Handles expired invitations or errors during data retrieval.
 * - Redirects to login or account creation based on user status.
 *
 * State Variables:
 * - `invitation`: Holds the invitation details.
 * - `invitationExpired`: Indicates whether the invitation is expired.
 * - `hasErrors`: Represents if an error occurred during data retrieval.
 * - `userData`: Stores user data fetched with the invitation details.
 *
 * Dependencies:
 * - React hooks: `useState`, `useEffect`
 * - React Router: `useNavigate`, `useParams`
 * - API hook: `useLazyGetPrefilledDataQuery`
 * - Navigation constants: `PATH_TO_ACCOUNT_INVITATIONS`, `PATH_TO_ACCOUNT_CREATE_PASSWORD`
 *
 * UI Components:
 * - Displays a loading spinner while data is being processed.
 * - Shows `InvitationExpired` or `InvitationError` components if applicable.
 */
const Onboarding = () => {
  const { invitationExpired, hasErrors, loaded } = useInvitation()

  return (
    <Page centered>
      <Body>
        {!loaded && <Spin indicator={<LoadingOutlined spin />} size="large" />}
        {invitationExpired && <InvitationExpired />}
        {hasErrors && !invitationExpired && <InvitationError />}
      </Body>
    </Page>
  )
}

export default Onboarding
