import styled from '@emotion/styled'
import { Flex } from 'antd'
import React, { CSSProperties, InputHTMLAttributes, ReactElement, ReactNode, useMemo } from 'react'

import { OptionTitle } from '@/components/Elements'
import { InputError } from '@/components/Inputs/InputElements'

import { colors } from '@/utils/colors.tsx'

export interface IInputWrapper extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string | ReactNode
  error?: string
  style?: CSSProperties
  last?: boolean
  errorPosition?: 'top' | 'bottom'
  className?: string
  helpText?: string
  noMargin?: boolean
  children: ReactElement
  preset?: 'default' | 'app'
}

const InputWrapper = React.memo(
  (props: IInputWrapper) => {
    const { label, error, errorPosition = 'top', children, helpText, preset, ...rest } = props
    const errorOnTop = errorPosition === 'top'

    const finalStyle = preset === 'app' ? styles.label : undefined

    const labelComponent = useMemo(() => {
      if (typeof label === 'string' && preset !== 'app')
        return (
          <OptionTitle className="pb-5" style={finalStyle}>
            {label}
          </OptionTitle>
        )

      if (typeof label === 'string' && preset === 'app') return <AppLabel>{label}</AppLabel>
      return label
    }, [label, preset])

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
  },
  (prev, next) => {
    return prev.error === next.error && prev.children === next.children
  },
)

export default InputWrapper

const styles = {
  label: {
    color: colors.blackText,
    fontWeight: 400,
  },
}

// Styled Components
const Wrapper = styled.div<{ last?: boolean; noMargin?: boolean }>`
  margin-bottom: ${({ last, noMargin }) => (last === true || noMargin === true ? 0 : 12)}px;
`
const HelpText = styled(InputError)`
  margin-top: 4px;
  color: ${colors.dim} !important;
`
const AppLabel = styled.div`
  color: ${colors.blackText};
  font-size: 14px;
  display: block;
  font-weight: 400;
  line-height: 22px;
  padding: 5px 0;
`
