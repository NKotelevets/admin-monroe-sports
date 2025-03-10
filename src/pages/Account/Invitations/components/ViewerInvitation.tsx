import { LoadingOutlined } from '@ant-design/icons'
import { Spin, notification } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { PlayerInvitationAccepted } from '@/pages/Account/Invitations/components/PlayerInvitation/PlayerInvitationAccepted.tsx'

import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'
import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

export const ViewerInvitation = () => {
  const { invitation } = useInvitation()
  const { updatedUserData, tempPassword, childData } = useAccountSlice()

  const [acceptInvite, { isLoading }] = useAcceptInviteMutation()
  const [api, contextHolder] = notification.useNotification()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!invitation) return

    acceptInvite({ invite_id: invitation.id, password: tempPassword, ...updatedUserData, child_object: childData })
      .unwrap()
      .then(() => {
        setDone(true)
      })
      .catch(() => {
        api.error({
          message: 'Something went wrong',
          description: 'We were unable to change your password. Please, try again.',
          placement: 'bottomRight',
        })
      })
  }, [invitation, tempPassword, updatedUserData])

  const content = useMemo(() => {
    if (isLoading) {
      return <Spin indicator={<LoadingOutlined spin />} size="large" />
    }

    if (done && !isLoading) {
      return <PlayerInvitationAccepted />
    }
  }, [isLoading, done])

  return (
    <>
      {contextHolder}
      {content}
    </>
  )
}
