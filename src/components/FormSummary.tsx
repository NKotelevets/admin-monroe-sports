import { ReactElement } from 'react'
import { Flex, Typography } from 'antd'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'

interface IFormSummaryProps {
  title: string
  subtitle?: string
  icon?: ReactElement
  error?: boolean

  iconAction?(): void
}

export const FormSummary = (props: IFormSummaryProps) => {
  const { title, subtitle, icon, error, iconAction } = props

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    iconAction && iconAction()
  }

  return (
    <Flex vertical={false} justify='space-between'>
      <Flex vertical>
        <Title type={error ? 'danger' : undefined}>{title}</Title>
        {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Flex>
      {!!icon && (
        <Flex onClick={handleClick}>
          {icon}
        </Flex>
      )}
    </Flex>
  )
}

const Title = styled(Typography.Text)<{ type: 'danger' | undefined }>`
    font-weight: 500;
    color: ${({ type }) => type ===  'danger' ? colors.primary : colors.secondaryText} !important
`

const Subtitle = styled(Typography.Text)`
    font-size: 12px;
    color: ${colors.dim}
`
