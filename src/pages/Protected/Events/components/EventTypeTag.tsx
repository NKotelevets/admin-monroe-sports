import { Tag } from 'antd'
import { ReactElement } from 'react'
import { eventType } from '@/common/constants/events.ts'

type TEventTypeTagProps = {
  type: number
}

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

  const typeMap: Record<number, { color: string; name: string }> = {
    [eventType.GAME]: { color: 'green', name: 'Game' },
    [eventType.PRACTICE]: { color: 'blue', name: 'Practice' },
    [eventType.PLAYOFF]: { color: 'default', name: 'Playoff' },
    [eventType.OTHER]: { color: 'yellow', name: 'Other event' },
  }

  if (type in typeMap) {
    return <Tag color={typeMap[type].color}>{typeMap[type].name}</Tag>
  }

  return <Tag color={typeMap[5].color}>{typeMap[5].name}</Tag>
}
