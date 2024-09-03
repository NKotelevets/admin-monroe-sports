import { Flex } from 'antd'
import { ChangeEventHandler, FC, ReactNode } from 'react'

import { InputError, InputLabel, StyledPasswordInput } from '@/components/Inputs/InputElements'

interface IMonroePasswordInputProps {
  label: string | ReactNode
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  error?: string
}

const MonroePasswordInput: FC<IMonroePasswordInputProps> = ({ label, error, ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        <InputLabel>{label}</InputLabel>
      </Flex>
    )}

    <StyledPasswordInput is_error={`${error ? 'true' : 'false'}`} {...rest} />

    {error && <InputError>{error}</InputError>}
  </>
)

export default MonroePasswordInput
