import { Flex, Input, Typography } from 'antd'
import { ChangeEventHandler, FC } from 'react'

import './monroe-input.style.css'

interface IMonroePasswordInputProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  labelClasses?: string
}

const MonroePasswordInput: FC<IMonroePasswordInputProps> = ({ label, labelClasses, ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        <Typography.Title className={`input-label ${labelClasses}`} level={4}>
          {label}
        </Typography.Title>
      </Flex>
    )}

    <Input.Password className="input" {...rest} />
  </>
)

export default MonroePasswordInput
