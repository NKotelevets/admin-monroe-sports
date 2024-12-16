import { ProtectedPageSubtitle, ProtectedPageSubtitleDescription } from '@/components/Elements'
import styled from '@emotion/styled'
import { Divider, Flex } from 'antd'

interface IFormSectionProps {
  title: string
  isFirst?: boolean
  subtitle?: string
  showDivider?: boolean
}

export const FormSection = (props: IFormSectionProps) => {
  const { isFirst, showDivider, title, subtitle } = props

  return (
    <>
      {showDivider && <DividerLine />}
      <Section vertical isFirst={isFirst}>
        <Title>{title}</Title>
        {!!subtitle && (<Subtitle>{subtitle}</Subtitle>)}
      </Section>
    </>
  )
}

// Styled Components
const DividerLine = styled(Divider)`
    margin: 24px 0 !important;
`
const Section = styled(Flex)<{ isFirst?: boolean }>`
    flex: 0 0 40%;
    margin-top: ${({ isFirst }) => isFirst === true ? 0 : 24}px;
`
const Title = styled(ProtectedPageSubtitle)`
`
const Subtitle = styled(ProtectedPageSubtitleDescription)`
    margin-top: 4px
`
