import { Accordion } from '@/components/Elements'
import { useAccordionFormContext } from './hooks/useAccordionFormContext.ts'
import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { Typography } from 'antd'
import { AccordionFormBox } from '@/components/AccordionForm/hooks/AccordionFormBox.tsx'

const { Title } = Typography

export type TAccordionFormProps = {
  items: {
    label: string
    key: string
    children: ReactElement
    title: string
    subtitle?: string
    error?: string
  }[]
}

export const AccordionForm = (props: TAccordionFormProps) => {
  const { items } = props
  const { activeKey, handleCollapseChange } = useAccordionFormContext()

  const styledItems = items.map(item => ({
    key: item.key,
    label: renderTitle(item.label),
    children: (
      <AccordionFormBox
        error={!!item.error}
        isOpen={parseInt(item.key) === parseInt(activeKey as string)}
        title={item.title}
        subtitle={item.subtitle}
      >
        {item.children}
      </AccordionFormBox>
    )
  }))

  return (
    <AccordionStyled
      accordion
      size="small"
      bordered={false}
      expandIconPosition="end"
      activeKey={activeKey}
      onChange={handleCollapseChange}
      items={styledItems}
      expandIcon={({ isActive }) => <div className={`arrow-custom ${isActive ? 'active' : ''}`} />}
    />
  )
}

const renderTitle = (title: string) => {
  return <PanelTitle level={5}>{title}</PanelTitle>
}

// Styled Components
const AccordionStyled = styled(Accordion)`
    margin-bottom: 0 !important;
`
const PanelTitle = styled(Title)`
    margin-bottom: 0 !important;
`
