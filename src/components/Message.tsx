import styled from '@emotion/styled'
import { FC } from 'react'
import { ReactSVG } from 'react-svg'

import ErrorIcon from '@/assets/icons/import-modal/error.svg'
import SuccessIcon from '@/assets/icons/import-modal/success.svg'

const MessageContainer = styled.div<{ is_error: string }>`
  display: flex;
  align-items: center;

  padding: 9px 16px;
  border-radius: 2px;
  border: 1px solid ${(props) => (props.is_error === 'true' ? '#FFCCC7' : '#bbe9b4')};
  background-color: ${(props) => (props.is_error === 'true' ? '#FFF1F0' : '#f1faef')};
`

const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  margin-left: 10px;
`

interface IMessageProps {
  type: 'error' | 'success'
  text: string
}

const Message: FC<IMessageProps> = ({ text, type }) => (
  <MessageContainer is_error={`${type === 'error'}`}>
    <div>
      <ReactSVG src={type === 'error' ? ErrorIcon : SuccessIcon} />
    </div>

    <Text>{text}</Text>
  </MessageContainer>
)

export default Message

