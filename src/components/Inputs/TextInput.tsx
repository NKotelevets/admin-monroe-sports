import { Input, InputProps } from 'antd'
import { PasswordProps, SearchProps, TextAreaProps } from 'antd/es/input'
import { GroupProps } from 'antd/es/input/Group'
import { CSSProperties, ChangeEventHandler, FC, InputHTMLAttributes, ReactNode } from 'react'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'

import { colors } from '@/utils/colors.tsx'

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
  noMargin?: boolean
  preset?: 'default' | 'app'
  bottomAccessory?: () => ReactNode
}

type X = ITextInputProps & GroupProps & InputProps & PasswordProps & SearchProps & TextAreaProps

const TextInput: FC<X> = (props) => {
  const { label, error, errorPosition = 'top', noMargin, preset, type, style, bottomAccessory, ...rest } = props

  const finalStyle = preset === 'app' ? styles.input : style

  return (
    <InputWrapper preset={preset} label={label} errorPosition={errorPosition} error={error} noMargin={noMargin}>
      <>
        {type !== 'password' ? (
          <Input status={error ? 'error' : undefined} {...rest} style={finalStyle} />
        ) : (
          <Input.Password status={error ? 'error' : undefined} {...rest} style={finalStyle} />
        )}
        {!!bottomAccessory && bottomAccessory()}
      </>
    </InputWrapper>
  )
}

export default TextInput

const styles = {
  input: {
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 16,
    border: '1px solid transparent',
    width: '100%',
    backgroundColor: colors.lightGray,
  },
  label: {
    color: colors.blackText,
  },
}
