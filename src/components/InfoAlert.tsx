import styled from '@emotion/styled'
import { Alert, Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

import ErrorIcon from '@/assets/icons/error.svg'

const Overlay = styled(Flex)`
  position: absolute;
  right: 24px;
  bottom: 20px;
  transition: all 0.3s linear;
  z-index: 999;
`

const StyledAlert = styled(Alert)`
  min-width: calc(40vw - 48px);
  width: auto;
  padding: 9px 16px;
  background-color: #fff1f0;
  border-color: #ffccc7;
  border-radius: 2px;
`

const AlertMessage = styled(Typography)`
  color: #3e34ca;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  margin-left: 4px;
`

const InfoAlert = () => {
  const { infoNotification, clearInfoNotification } = useAppSlice()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(infoNotification.redirectedPageUrl)
    clearInfoNotification()
  }

  return (
    <Overlay>
      {infoNotification.message && (
        <StyledAlert
          message={
            <Flex>
              {infoNotification.message}
              <AlertMessage onClick={handleClick}>{infoNotification.actionLabel}</AlertMessage>
            </Flex>
          }
          showIcon
          type="error"
          icon={<ReactSVG src={ErrorIcon} />}
          closable
          onClose={() => clearInfoNotification()}
        />
      )}
    </Overlay>
  )
}

export default InfoAlert
