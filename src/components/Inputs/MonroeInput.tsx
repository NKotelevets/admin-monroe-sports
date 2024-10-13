import { Flex } from 'antd'
import { CSSProperties, ChangeEventHandler, FC, ReactNode } from 'react'

import { InputError, InputLabel, StyledInput } from '@/components/Inputs/InputElements'

interface IMonroeInputProps {
  label?: string | ReactNode
  placeholder?: string
  value: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  name: string
  error?: string
  style?: CSSProperties
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (e: React.FocusEvent<any>) => void
  errorPosition?: 'top' | 'bottom'
  className?: string
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, error, errorPosition = 'top', ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        {typeof label === 'string' ? <InputLabel>{label}</InputLabel> : label}
        {error && errorPosition === 'top' && <InputError>{error}</InputError>}
      </Flex>
    )}

    <StyledInput is_error={`${error ? 'true' : 'false'}`} {...rest} />

    {error && errorPosition === 'bottom' && <InputError>{error}</InputError>}
  </>
)

export default MonroeInput
