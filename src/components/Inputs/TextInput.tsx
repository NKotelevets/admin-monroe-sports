import { Input } from 'antd'
import { CSSProperties, ChangeEventHandler, FC, ReactNode, InputHTMLAttributes, useMemo } from 'react'

import { OptionTitle } from '@/components/Elements'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'

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

  const labelComponent = useMemo(() => (
    typeof label === 'string' ? <OptionTitle className="pb-5">{label}</OptionTitle> : label
  ), [label])

  return (
    <InputWrapper label={labelComponent} errorPosition={errorPosition} error={error}>
      <Input status={error ? 'error' : undefined} {...rest} />
    </InputWrapper>
  )
}

export default TextInput
