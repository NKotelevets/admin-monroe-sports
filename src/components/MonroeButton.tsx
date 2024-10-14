import styled from '@emotion/styled'
import { Button } from 'antd'
import { FC, ReactNode } from 'react'

interface IMonroeButtonProps {
  label: string
  isDisabled?: boolean
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: ReactNode
  iconPosition?: 'start' | 'end' | undefined
}

const StyledMonroeButton = styled(Button)`
  border: 0;
  width: 100%;
  font-size: 16px;
`

const MonroeButton: FC<IMonroeButtonProps> = ({ isDisabled = false, label, htmlType = 'button', ...rest }) => (
  <StyledMonroeButton disabled={isDisabled} htmlType={htmlType} {...rest}>
    {label}
  </StyledMonroeButton>
)

export default MonroeButton
