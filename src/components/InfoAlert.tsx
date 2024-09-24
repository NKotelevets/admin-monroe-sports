import { Alert, Flex, Typography } from 'antd'
import { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

import ErrorIcon from '@/assets/icons/error.svg'

const backgroundStyles: CSSProperties = {
  position: 'absolute',
  right: '24px',
  bottom: '20px',
  transition: 'all 0.3s linear 0s',
  zIndex: 999,
}

const alertStyles: CSSProperties = {
  minWidth: 'calc(40vw - 48px)',
  width: 'auto',
  padding: '9px 16px',
  backgroundColor: '#FFF1F0',
  borderColor: '#FFCCC7',
  borderRadius: '2px',
}

const alertTypographyStyles: CSSProperties = {
  color: '#3E34CA',
  fontSize: '14px',
  fontWeight: 400,
  cursor: 'pointer',
  marginLeft: '4px',
}

const InfoAlert = () => {
  const { infoNotification, clearInfoNotification } = useAppSlice()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(infoNotification.redirectedPageUrl)
    clearInfoNotification()
  }

  return (
    <Flex style={backgroundStyles}>
      {infoNotification.message && (
        <Alert
          style={alertStyles}
          message={
            <>
              {infoNotification.message}
              <Typography.Text style={alertTypographyStyles} onClick={handleClick}>
                {infoNotification.actionLabel}
              </Typography.Text>
            </>
          }
          showIcon
          type="error"
          icon={<ReactSVG src={ErrorIcon} />}
          closable
          onClose={() => clearInfoNotification()}
        />
      )}
    </Flex>
  )
}

export default InfoAlert
