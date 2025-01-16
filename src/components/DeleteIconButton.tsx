import { colors } from '@/utils/colors.tsx'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import styled from '@emotion/styled'

type TDeleteIconButtonProps = {
  color?: string
  className?: string
  fontSize?: number
  onClick?(): void
}

export const DeleteIconButton = (props: TDeleteIconButtonProps) => {
  const { onClick, color = colors.primary, className, fontSize } = props

  return (
    <Delete
      color={color}
      className={className}
      fontSize={fontSize}
      onClick={onClick}
    />
  )
}

const Delete = styled(DeleteOutlined)<{ color: string, fontSize?: number }>`
    color: ${({ color }) => color};
    font-size: ${({ size }) => size !== undefined ? size : 18}px
`
