import { useCallback, useState } from 'react'
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik'
import { ICreateSeasonFormValues, seasonInitialFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { Button, Collapse, Tooltip, Typography } from 'antd'
import styled from '@emotion/styled'
import { DivisionField } from '@/pages/Protected/Seasons/components/SeasonForm/DivisionAccordion/DivisionField.tsx'
import { PlusOutlined } from '@ant-design/icons'

const { Panel } = Collapse
const { Title } = Typography

export interface DivisionFormProps {
  index: number
  isOpened: boolean
  arrayHelpers: FieldArrayRenderProps

  setIds?: React.Dispatch<React.SetStateAction<number[]>>
}

export const DivisionAccordion = () => {
  const [activeKey, setActiveKey] = useState<string | string[]>('90')
  const { values, errors } = useFormikContext<ICreateSeasonFormValues>()

  const hasErrors = !!errors.divisions
  const tooltipMessage = hasErrors ? 'Missing mandatory data' : undefined

  const handleCollapseChange = useCallback((key: string | string[]) => {
    setActiveKey(key)
  }, [])

  const onAddSubdivision = (arrayHelpers: FieldArrayRenderProps) => {
    return () => {
      arrayHelpers.push(seasonInitialFormValues.divisions[0])
      setActiveKey(key => `${parseInt(key as string) + 1}`)
    }
  }

  /**
   * Render accordions for divisions fields
   */
  const renderForm = useCallback((arrayHelpers: FieldArrayRenderProps) => (
    values?.divisions?.map((_, divisionIndex: number) => (
      <Panel
        key={`9${divisionIndex.toString()}`}
        header={<PanelTitle level={5}>#{divisionIndex + 1} Division/Pool</PanelTitle>}
      >
        <DivisionField
          index={divisionIndex}
          isOpened={parseInt(activeKey as string) === parseInt(`9${divisionIndex}`)}
          arrayHelpers={arrayHelpers}
        />
      </Panel>
    ))
  ), [values, activeKey])

  return (
    <FieldArray
      name="divisions"
      render={(arrayHelpers) => (
        <DivisionsWrapper>
          <Accordion
            accordion
            size="small"
            bordered={false}
            expandIconPosition="end"
            activeKey={activeKey}
            onChange={handleCollapseChange}
            expandIcon={({ isActive }) => <div className={`arrow-custom ${isActive ? 'active' : ''}`} />}
          >
            {renderForm(arrayHelpers)}
          </Accordion>

          <Tooltip title={tooltipMessage}>
            <AddDivisionButton
              disabled={hasErrors}
              onClick={onAddSubdivision(arrayHelpers)}
              icon={<PlusOutlined />}
            >
              Add Division
            </AddDivisionButton>
          </Tooltip>
        </DivisionsWrapper>
      )}
    />
  )
}

// Styled Components
const DivisionsWrapper = styled.div`
  margin-top: 12px
`
const Accordion = styled(Collapse)`
    width: 352px;

    & .ant-collapse {
        width: 100%;
    }
`
const PanelTitle = styled(Title)`
    margin-bottom: 0 !important;
`
const AddDivisionButton = styled(Button)`
    margin-top: 16px;
`
