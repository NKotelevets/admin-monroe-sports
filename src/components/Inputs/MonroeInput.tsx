import { Flex } from 'antd'
import { CSSProperties, ChangeEventHandler, FC, ReactNode } from 'react'

import { InputError, InputLabel, StyledInput } from '@/components/Inputs/InputElements'

interface IMonroeInputProps {
  label?: string | ReactNode
  placeholder?: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  error?: string
  style?: CSSProperties
  disabled?: boolean
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, error, ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        {typeof label === 'string' ? <InputLabel>{label}</InputLabel> : label}
        {error && <InputError>{error}</InputError>}
      </Flex>
    )}

    <StyledInput {...rest} />
  </>
)

export default MonroeInput
