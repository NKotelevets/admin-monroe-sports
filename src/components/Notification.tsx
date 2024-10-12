import styled from '@emotion/styled'
import { Alert, Flex } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

const NotificationWrapper = styled(Flex)<{ is_message: string }>`
  position: absolute;
  right: 24px;
  bottom: ${({ is_message }) => (is_message === 'true' ? '20px' : '5px')};
  opacity: ${({ is_message }) => (is_message === 'true' ? 1 : 0)};
  transition: all 0.3s linear;
  z-index: 999;
`

const StyledAlert = styled(Alert)`
  width: calc(40vw - 48px);
  padding: 9px 16px;
`

interface IResetSeconds {
  resetSeconds: () => void
}

const Notification = () => {
  const { clearNotification, notification } = useAppSlice()
  const [seconds, setSeconds] = useState<number>(0)

  const restoreCounter = () => setSeconds(0)

  const messageRef = useRef<IResetSeconds>({ resetSeconds: restoreCounter })

  useEffect(() => {
    if (notification.message) restoreCounter()
  }, [notification.message])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (notification.message) {
      interval = setInterval(() => {
        setSeconds((state) => state + 1)
      }, 1000)

      if (seconds >= 5) {
        clearNotification()
        setSeconds(0)
        clearInterval(interval)
      }
    }

    if (!notification.message && interval) {
      clearNotification()
      setSeconds(0)
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [seconds, notification.message])

  useEffect(() => {
    if (messageRef.current && notification.message) messageRef.current.resetSeconds()
  }, [notification.timestamp])

  return (
    <NotificationWrapper is_message={`${!!notification.message}`}>
      {notification.message && (
        <StyledAlert
          message={notification.message}
          showIcon
          type={notification.type}
          closable
          onClose={() => {
            clearNotification()
            setSeconds(0)
          }}
        />
      )}
    </NotificationWrapper>
  )
}

export default Notification
