import { Flex } from 'antd'
import { CSSProperties, ChangeEventHandler, FC, ReactNode, InputHTMLAttributes, useMemo } from 'react'

import { InputError, StyledInput } from '@/components/Inputs/InputElements'
import { OptionTitle } from '@/components/Elements'

interface ITextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

const TextInput: FC<ITextInputProps> = (props) => {
  const {
    label,
    error,
    errorPosition = 'top',
    ...rest
  } = props
  const errorOnTop = errorPosition === 'top'

  const labelComponent = useMemo(() => (
    typeof label === 'string' ? <OptionTitle className="pb-5">{label}</OptionTitle> : label
  ), [label])

  return (
    <>
      {label && (
        <Flex vertical={false} justify="space-between" align="center">
          {labelComponent}
          {error && errorOnTop && <InputError>{error}</InputError>}
        </Flex>
      )}

      <StyledInput isError={error !== undefined} {...rest} />

      {error && !errorOnTop && <InputError>{error}</InputError>}
    </>
  )
}

export default TextInput
