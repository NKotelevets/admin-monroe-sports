import { Flex } from 'antd'
import { CSSProperties, ChangeEventHandler, FC } from 'react'

import { InputError, InputLabel, StyledInput } from '@/components/Inputs/InputElements'

interface IMonroeInputProps {
  label?: string
  placeholder?: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  error?: string
  style?: CSSProperties
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, error, ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        <InputLabel>{label}</InputLabel>
        {error && <InputError>{error}</InputError>}
      </Flex>
    )}

    <StyledInput {...rest} />
  </>
)

export default MonroeInput
