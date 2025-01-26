import styled from '@emotion/styled'

/**
 * Represents a styled container element with customizable width.
 *
 * This styled component applies a dynamic width based on the `width` prop provided.
 * The `width` prop is expected to be a number (in pixels).
 *
 * Properties:
 * - `width`: A number that specifies the width of the `Cell` in pixels.
 *
 * Example:
 * ```
 * const MyCell = <Cell width={100} />;
 * ```
 * This would render a `Cell` component with a width of 100px.
 */
export const Cell = styled.div<{width: number}>`
    width: ${({ width }) => width}px;
`
