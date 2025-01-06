import { colors } from '@/utils/colors.tsx'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import styled from '@emotion/styled'

type TDeleteIconButtonProps = {
  color?: string
  className?: string
  onClick?(): void
}

export const DeleteIconButton = (props: TDeleteIconButtonProps) => {
  const { onClick, color = colors.primary, className } = props

  return (
    <Delete
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

const Delete = styled(DeleteOutlined)<{ color: string }>`
    color: ${({ color }) => color};
`
