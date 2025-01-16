import { Box } from '@/components/Elements'
import { Collapse, Typography } from 'antd'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

const { Panel } = Collapse
const { Title } = Typography

type TAccordionItemProps = {
  key: string
  title: string
  children: ReactElement
  error: boolean
}

export const AccordionItem = (props: TAccordionItemProps) => {
  const { key, title, children, error } = props

  return (
    <Panel
      key={key}
      header={<PanelTitle level={5}>{title}</PanelTitle>}
    >
      <Box error={error}>
        {children}
      </Box>
    </Panel>
  )
}

const PanelTitle = styled(Title)`
    margin-bottom: 0 !important;
`
