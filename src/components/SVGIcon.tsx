import { Props, ReactSVG } from 'react-svg'
import styled from '@emotion/styled'

export const SVGIcon = (props: Props & { color?: string; width?: string | number }) => {
  const { color, width, ...rest } = props

  return (
    <SVG
      {...rest}
      fill={color}
      width={width}
    />
  )
}

interface SVGProps {
  $filled?: boolean
}

// Styled Components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SVG = styled(ReactSVG as any)<SVGProps & { fill?: string; width?: string | number }>`
    color: ${({ fill }) => fill || '#f0f'};
    width: ${({ width }) => width || 0};
`
