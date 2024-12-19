import { Fragment, useCallback, useState } from 'react'
import { FieldArray, FieldArrayRenderProps } from 'formik'
import { IDivisionFormik } from '@/pages/Protected/Seasons/constants/formik.ts'
import { Button, Collapse, Tooltip } from 'antd'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import {
  SubdivisionField
} from '@/pages/Protected/Seasons/components/SeasonForm/SubdivisionAccordion/SubdivisionField.tsx'
import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData.ts'

const { Panel } = Collapse

export const SubdivisionAccordion = (props: { index: number, division: IDivisionFormik }) => {
  const { index, division } = props
  const [activeKey, setActiveKey] = useState<string | string[]>('9990')

  const hasErrors = !!division.errors?.subDivisions
  const tooltipMessage = hasErrors ? 'Missing mandatory data' : undefined

  const handleCollapseChange = useCallback((key: string | string[]) => {
    setActiveKey(key)
  }, [])

  const onAddSubdivision = (arrayHelpers: FieldArrayRenderProps) => {
    return () => {
      arrayHelpers.push({
        name: '',
        subdivisionsNames: [],
        playoffTeams: 2,
        matches: BRACKETS_OPTIONS[2],
      })
      setActiveKey(`999${(division.values?.subDivisions.length || 0)}`)
    }
  }

  const renderSubdivisions = useCallback((arrayHelpers: FieldArrayRenderProps) => (
    division.values?.subDivisions?.map((_, subDivisionIndex: number) => {
      const title = division.values?.subDivisions?.[subDivisionIndex]?.name
      const isOpened = parseInt(activeKey as string) === parseInt(`999${subDivisionIndex}`)

      const panelTitle = title && !isOpened ? (
        <AccordionTitle>{title}</AccordionTitle>
      ) : (
        <SubdivisionTitle error={!!division.touched && !!division.errors?.subDivisions?.[subDivisionIndex]}>
          #{subDivisionIndex + 1} Sub Division
        </SubdivisionTitle>
      )

      return (
        <Fragment key={`${subDivisionIndex.toString()}`}>
          <Divider />

          <Panel key={`999${subDivisionIndex.toString()}`} header={panelTitle}>
            <SubdivisionField
              key={subDivisionIndex}
              divisionIndex={index}
              subDivisionIndex={subDivisionIndex}
              isOpened={isOpened}
              arrayHelpers={arrayHelpers}
            />
          </Panel>
        </Fragment>
      )
    })
  ), [division.values, activeKey, division.touched, division.errors, index])

  return (
    <FieldArray
      name={`divisions[${index}].subDivisions`}
      render={(arrayHelpers) => (
        <>
          <Accordion
            accordion
            size="small"
            bordered={false}
            expandIconPosition="end"
            activeKey={activeKey}
            onChange={handleCollapseChange}
            expandIcon={({ isActive }) => <div className={`arrow-custom ${isActive ? 'active' : ''}`} />}
          >
            {renderSubdivisions(arrayHelpers)}
          </Accordion>
          <Divider />

          <Tooltip title={tooltipMessage}>
            <AddSubdivision
              type="link"
              size="small"
              icon={<PlusOutlined />}
              onClick={onAddSubdivision(arrayHelpers)}
              disabled={hasErrors}
            >
              Add Sub Division
            </AddSubdivision>
          </Tooltip>
        </>
      )}
    />
  )

}

// Styled Components
const Accordion = styled(Collapse)`
    width: 352px;

    & .ant-collapse {
        width: 100%;
    }
`
const Divider = styled.div`
    background-color: ${colors.dimLight};
    height: 1px !important;
    width: 100%;
    margin-top: 12px;
    margin-bottom: 8px;
    position: realative;
`
const AddSubdivision = styled(Button)<{ disabled?: boolean }>`
    margin-top: 8px;
    color: ${({ disabled }) => !disabled ? `${colors.secondaryText} !important` : undefined};
`
const AccordionTitle = styled.div<{ error?: boolean }>`
    font-size: 14px !important;
    font-weight: 500;
    color: ${({ error }) => error ? colors.primary : colors.secondaryText};
`
const SubdivisionTitle = styled.div<{ error?: boolean }>`
    font-size: 12px !important;
    color: ${({ error }) => error ? colors.primary : colors.dim};
`
