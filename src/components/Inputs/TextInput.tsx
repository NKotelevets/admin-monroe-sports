import { Input, InputProps } from 'antd'
import { PasswordProps, SearchProps, TextAreaProps } from 'antd/es/input'
import { GroupProps } from 'antd/es/input/Group'
import { CSSProperties, ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'

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

/**
 * TextInput is a functional component for rendering input fields with support for various presets, types, and styles.
 *
 * @param {Object} props The properties for the TextInput component.
 * @param {string} [props.label] The label to be displayed for the input field.
 * @param {string} [props.error] The error message to display when the input is invalid.
 * @param {('top'|'bottom')} [props.errorPosition='top'] The position of the error message.
 * @param {boolean} [props.noMargin] Determines if the default margin should be removed.
 * @param {string} [props.preset] The preset styling option for the input ('app' or custom).
 * @param {string} [props.type] The type for the input field (e.g., 'text', 'password').
 * @param {Object} [props.style] Custom style to be applied to the input field.
 * @param {Function} [props.bottomAccessory] A function rendering additional UI elements below the input.
 * @param {Object} [props.rest] Additional properties to pass to the input element.
 */
const TextInput = (props: X) => {
  const { label, error, errorPosition = 'top', noMargin, preset, type, style, bottomAccessory, ...rest } = props

  const finalStyle = preset === 'app' ? styles.input : style

  return (
    <InputWrapper preset={preset} label={label} errorPosition={errorPosition} error={error} noMargin={noMargin}>
      <>
        {type !== 'password' ? (
          <Input status={error ? 'error' : undefined} type={type} {...rest} style={finalStyle} />
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
