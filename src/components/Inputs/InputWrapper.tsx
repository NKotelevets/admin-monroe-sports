import { Flex } from 'antd'
import React, { CSSProperties, ReactNode, InputHTMLAttributes, useMemo, ReactElement } from 'react'

import { InputError } from '@/components/Inputs/InputElements'
import { OptionTitle } from '@/components/Elements'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'

export interface IInputWrapper extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string | ReactNode
  error?: string
  style?: CSSProperties
  last?: boolean
  errorPosition?: 'top' | 'bottom'
  className?: string
  helpText?: string
  children: ReactElement
}

const InputWrapper = React.memo((props: IInputWrapper) => {
  const {
    label,
    error,
    errorPosition = 'top',
    children,
    helpText,
    ...rest
  } = props
  const errorOnTop = errorPosition === 'top'

  const labelComponent = useMemo(() => (
    typeof label === 'string' ? <OptionTitle className="pb-5">{label}</OptionTitle> : label
  ), [label])

  return (
    <Wrapper {...rest}>
      {label && (
        <Flex vertical={false} justify="space-between" align="center">
          {labelComponent}
          {error && errorOnTop && <InputError>{error}</InputError>}
        </Flex>
      )}
      {children}
      {error && !errorOnTop && <InputError>{error}</InputError>}
      {helpText && <HelpText>{helpText}</HelpText>}

    </Wrapper>
  )
}, (prev,next) => {
  return (
    prev.error === next.error
    && prev.children === next.children
  )
})

export default InputWrapper

// Styled Components
const Wrapper = styled.div<{ last?: boolean }>`
    margin-bottom: ${({ last }) => last === true ? 0 : 12}px;
`
const HelpText = styled(InputError)`
    margin-top: 4px;
    color: ${colors.dim} !important;
`
