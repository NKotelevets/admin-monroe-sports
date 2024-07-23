import { Button } from 'antd'
import { CSSProperties, FC, ReactNode } from 'react'

interface IMonroeButtonProps {
  label: string
  isDisabled?: boolean
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: ReactNode
  iconPosition?: 'start' | 'end' | undefined
  style?: CSSProperties
}

const MonroeButton: FC<IMonroeButtonProps> = ({
  isDisabled = false,
  label,
  onClick,
  type,
  htmlType = 'button',
  className,
  icon,
  iconPosition,
  style = {},
}) => (
  <Button
    className={className}
    style={{
      border: 0,
      height: '40px',
      width: '100%',
      fontSize: '16px',
      ...style,
    }}
    type={type}
    onClick={onClick}
    disabled={isDisabled}
    htmlType={htmlType}
    icon={icon}
    iconPosition={iconPosition}
  >
    {label}
  </Button>
)

export default MonroeButton
