import styled from '@emotion/styled'
import { Props, ReactSVG } from 'react-svg'
import { ReactElement } from 'react'

interface SVGProps {
  $filled?: string
}

/**
 * A functional component that renders an SVG icon. It accepts props for customization.
 *
 * @property {string} [color] Optional color of the SVG icon.
 * @property {string|number} [width] Optional width of the SVG icon.
 *
 * @param {Props} props The properties for configuring the SVG icon.
 * @return {ReactElement} The rendered SVG component.
 */
export const SVGIcon = (props: Props & { color?: string; width?: string | number }): ReactElement => {
  const { color, width, ...rest } = props

  return <SVG {...rest} $filled={color} width={width} />
}

// Styled Components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SVG = styled(ReactSVG as any)<SVGProps & { fill?: string; width?: string | number }>`
    & div svg {
        fill: ${(props) => (props.$filled ? props.$filled : 'none')}
`
