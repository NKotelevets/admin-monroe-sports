import { Tag } from 'antd'
import { ReactElement } from 'react'
import { eventType } from '@/common/constants/events.ts'
import styled from '@emotion/styled'

type TEventTypeTagProps = {
  type: number
}

type TColorMap = { color: string; name: string; bg: string; border: string }

/**
 * EventTypeTag Component
 *
 * This component renders a `Tag` element based on the event type provided in the props.
 * Each event type is associated with a specific color and name, as defined in the `typeMap`.
 *
 * Props:
 * - `type` (number): The numeric event type identifier.
 *   Valid values are:
 *   - 0: Game (green tag)
 *   - 1: Practice (blue tag)
 *   - 2: Playoff (default tag)
 *   - 5: Other event (yellow tag)
 *
 * Behavior:
 * - If the `type` matches a key in `typeMap`, the corresponding `Tag` is rendered.
 * - If the `type` does not match any key in `typeMap`, a default "Other event" (yellow tag) is rendered.
 *
 * Example Usage:
 * ```tsx
 * <EventTypeTag type={0} /> // Renders a green "Game" tag
 * <EventTypeTag type={1} /> // Renders a blue "Practice" tag
 * <EventTypeTag type={99} /> // Renders a yellow "Other event" tag (default)
 * ```
 *
 * @param {TEventTypeTagProps} props - The properties for the EventTypeTag component.
 * @returns {ReactElement} A styled `Tag` component based on the event type.
 */
export const EventTypeTag = (props: TEventTypeTagProps): ReactElement => {
  const { type } = props

  const typeMap: Record<number, TColorMap> = {
    [eventType.GAME]: {
      bg: 'rgba(241, 250, 239, 1)',
      border: 'rgba(158, 224, 148, 1)',
      color: 'rgba(16, 177, 22, 1)',
      name: 'Game'
    },
    [eventType.PRACTICE]: {
      bg: 'rgba(241, 240, 255, 1)',
      border: 'rgba(164, 158, 255, 1)',
      color: 'rgba(76, 65, 230, 1)',
      name: 'Practice'
    },
    [eventType.PLAYOFF]: {
      bg: 'rgba(250, 250, 250, 1)',
      border: 'rgba(216, 215, 219, 1)',
      color: 'rgba(26, 22, 87, 0.85)',
      name: 'Playoff'
    },
    [eventType.OTHER]: {
      bg: 'rgba(255, 249, 235, 1)',
      border: 'rgba(255, 215, 112, 1)',
      color: 'rgba(163, 119, 5, 1)',
      name: 'Other event' },
  }

  if (type in typeMap) {
    return <TagStyled {...typeMap[type]}>{typeMap[type].name}</TagStyled>
  }

  return <TagStyled {...typeMap[type]}>{typeMap[5].name}</TagStyled>
}

const TagStyled = styled(Tag)<TColorMap>`
    background-color: ${({ bg }) => bg} !important;
    color: ${({ color }) => color} !important;
    border-color: ${({ border }) => border} !important;
`
