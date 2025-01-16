import { Box } from '@/components/Elements'
import { FormSummary } from '@/components/FormSummary.tsx'
import { useFormSummary } from '@/hooks/useFormSummary.tsx'
import { ReactElement } from 'react'
import styled from '@emotion/styled'

type TAccordionFormBoxProps = {
  title: string
  subtitle?: string
  children: ReactElement
  isOpen: boolean
  error: boolean
}

export const AccordionFormBox = (props: TAccordionFormBoxProps) => {
  const { title, subtitle, children, isOpen, error } = props
  const { showForm, setShowForm } = useFormSummary(isOpen)

  if (!showForm) {
    return (
      <BoxStyled
        showForm={true}
        direction="vertical"
        error={error && !showForm}
        onClick={() => setShowForm(true)}
      >
        <FormSummary
          error={error}
          title={error ? 'Missing mandatory data' : title || 'Missing mandatory data'}
          subtitle={subtitle}
        />
      </BoxStyled>
    )
  }

  return (
    <BoxStyled error={false}>
      {children}
    </BoxStyled>
  )
}

// Styled Components
const BoxStyled = styled(Box)`
    margin-bottom: 24px;
`
