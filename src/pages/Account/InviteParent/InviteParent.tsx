import { useEffect } from 'react'

import { ChildInvitation } from '@/pages/Account/Invitations/components/ChildInvitation/ChildInvitation.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

const {
  Page,
  Styles: { Body },
} = Layout

const InviteParent = () => {
  const { setUnder16 } = useAccountSlice()

  useEffect(() => {
    setUnder16()
  }, [])

  return (
    <Page centered>
      <Body>
        <ChildInvitation />
      </Body>
    </Page>
  )
}

export default InviteParent
