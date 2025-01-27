import styled from '@emotion/styled'
import { Tag as T } from 'antd'
import { TagProps } from 'antd/es/tag'

type TColorMap = { color: string; bg: string; border: string }
type TTagProps = TagProps & {
  title: string
  color: string
}

export const Tag = (props: TTagProps) => {
  const { title, color, ...rest } = props

  const typeMap: Record<string, TColorMap> = {
    green: {
      bg: 'rgba(241, 250, 239, 1)',
      border: 'rgba(158, 224, 148, 1)',
      color: 'rgba(16, 177, 22, 1)'
    },
    blue: {
      bg: 'rgba(241, 240, 255, 1)',
      border: 'rgba(164, 158, 255, 1)',
      color: 'rgba(76, 65, 230, 1)'
    },
    gray: {
      bg: 'rgba(250, 250, 250, 1)',
      border: 'rgba(216, 215, 219, 1)',
      color: 'rgba(26, 22, 87, 0.85)'
    },
    yellow: {
      bg: 'rgba(255, 249, 235, 1)',
      border: 'rgba(255, 215, 112, 1)',
      color: 'rgba(163, 119, 5, 1)'
    },
    yellowVibrant: {
      bg: 'rgba(255, 244, 214, 1)',
      border: 'rgba(255, 144, 0, 1)',
      color: 'rgba(255, 144, 0, 1)'
    },
    red: {
      bg: 'rgba(255, 241, 240, 1)',
      border: 'rgba(244, 64, 52, 1)',
      color: 'rgba(244, 64, 52, 1)'
    },
  }

  if (color in typeMap) {
    return <TagStyled {...typeMap[color]} {...rest}>{title}</TagStyled>
  }

  return <TagStyled {...typeMap[color]} {...rest}>{title}</TagStyled>
}

const TagStyled = styled(T)<TColorMap & { bordered?: boolean }>`
  background-color: ${({ bg }) => bg} !important;
  color: ${({ color }) => color} !important;
  border-color: ${({ border, bordered }) => bordered === false ? 'transparent' : border} !important;
`
