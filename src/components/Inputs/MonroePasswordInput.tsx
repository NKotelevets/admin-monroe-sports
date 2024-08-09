import { Flex } from 'antd'
import { ChangeEventHandler, FC } from 'react'

import { InputLabel, StyledPasswordInput } from '@/components/Inputs/InputElements'

interface IMonroePasswordInputProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
}

const MonroePasswordInput: FC<IMonroePasswordInputProps> = ({ label, ...rest }) => (
  <>
    {label && (
      <Flex vertical={false} justify="space-between" align="center">
        <InputLabel>{label}</InputLabel>
      </Flex>
    )}

    <StyledPasswordInput {...rest} />
  </>
)

export default MonroePasswordInput
