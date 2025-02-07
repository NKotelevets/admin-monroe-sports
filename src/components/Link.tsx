import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { Link as LK, LinkProps } from 'react-router-dom'

import { colors } from '@/utils/colors.tsx'

export type TCustomLinkProps = {
  color?: string
  hoverColor?: string
  underline?: boolean
  disableHover?: boolean
}

/**
 * Drop-in replacement for React Router Dom's Link component.
 * It combines provided styles with default styles, and passes on any additional props.
 *
 * @param {LinkProps} props - The properties object for the Link component.
 * @returns {ReactElement} A rendered link element with appropriate styles and children.
 */
export const Link = (props: LinkProps & TCustomLinkProps): ReactElement => {
  const { children, ...rest } = props

  return <LinkStyle {...rest}>{children}</LinkStyle>
}

// Styled Components
const LinkStyle = styled(LK)<TCustomLinkProps>`
    color: ${({ color }) => color || style.default.color};
    text-decoration: ${({ underline }) => (underline ? 'underline' : style.default.textDecoration)} !important;
    transition: opacity ease-in-out .3s !important;
    
    &:hover {
        color: ${({ hoverColor, color, disableHover}) =>  disableHover ? color : hoverColor || style.default.color} !important;
        opacity: ${({ disableHover }) => disableHover ? 1 : 0.6};
        transition: opacity ease-in-out .3s !important;
    }
`

const style = {
  default: {
    color: colors.secondary,
    textDecoration: 'none',
    lineHeight: 'normal',
  },
}
