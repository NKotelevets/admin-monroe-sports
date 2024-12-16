// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import { FieldArray, useFormikContext } from 'formik'
import { Button, Collapse, Divider, Form, Input, Radio, RadioChangeEvent, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import styled from '@emotion/styled'
import TextInput from '@/components/Inputs/TextInput.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import { BEST_RECORD_WINS, POINTS, SINGLE_ELIMINATION_BRACKET, WINNING } from '@/common/constants/league.ts'
import { colors } from '@/utils/colors.tsx'
import { RadioGroupContainer, RadioGroupLabel, RadioGroupLabelTooltip } from '@/components/Elements'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips.tsx'
import { ReactSVG } from 'react-svg'
import InfoCircleIcon from '@/assets/icons/info-circle.svg'

const { Panel } = Collapse
const { TextArea } = Input
const { Title } = Typography

interface SubDivisionFormProps {
  divisionIndex: number
  subDivisionIndex: number
}

const SubDivisionForm: React.FC<SubDivisionFormProps> = ({ divisionIndex, subDivisionIndex }) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ICreateSeasonFormValues>()
  const field = `divisions[${divisionIndex}].subdivisions[${subDivisionIndex}]`
  const subdivision = {
    values: values?.divisions?.[divisionIndex]?.subdivisions?.[subDivisionIndex],
    touched: touched?.divisions?.[divisionIndex]?.subdivisions?.[subDivisionIndex],
    errors: errors?.divisions?.[divisionIndex]?.subdivisions?.[subDivisionIndex]
  }

  return (
    <div>
      <TextInput
        label="Sub Division Name"
        name={`${field}.name`}
        placeholder="Enter name"
        onChange={handleChange(`${field}.name`)}
        value={subdivision.values?.name}
        errorPosition="bottom"
        error={subdivision.touched?.name ? subdivision.errors?.name || '' : ''}
        onBlur={handleBlur(`${field}.name`)}
      />

      <InputWrapper
        label="Sub Division Description"
        errorPosition="bottom"
        error={subdivision.touched?.description ? subdivision.errors.description || '' : ''}
      >
        <TextArea
          name={`${field}.description`}
          placeholder="Enter description"
          rows={3}
          onChange={handleChange}
          value={subdivision.values?.description}
        />
      </InputWrapper>

      <InputWrapper
        label="Standings Format"
        errorPosition="bottom"
        error={subdivision.touched?.standingsFormat ? subdivision.errors.standingsFormat || '' : ''}
      >
        <RadioGroupContainer
          onChange={(e: RadioChangeEvent) => setFieldValue(`${field}.standingsFormat`, e.target.value)}
          value={subdivision.values?.standingsFormat}
        >
          <Radio value={WINNING}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Winning %</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP} width="135px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
          <Radio value={POINTS}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Points</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP} width="308px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
        </RadioGroupContainer>
      </InputWrapper>

      <InputWrapper
        label="Standings Format"
        errorPosition="bottom"
        error={subdivision.touched?.standingsFormat ? subdivision.errors.standingsFormat || '' : ''}
      >
        <RadioGroupContainer
          onChange={(e: RadioChangeEvent) => setFieldValue(`${field}.standingsFormat`, e.target.value)}
          value={subdivision.values?.standingsFormat}
        >
          <Radio value={WINNING}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Winning %</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP} width="135px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
          <Radio value={POINTS}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Points</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP} width="308px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
        </RadioGroupContainer>
      </InputWrapper>

      <InputWrapper
        label="Default Tiebreakers Format *"
        errorPosition="bottom"
        error={subdivision.touched?.tiebreakersFormat ? subdivision.errors.tiebreakersFormat || '' : ''}
      >
        <RadioGroupContainer
          onChange={(e: RadioChangeEvent) => setFieldValue(`${field}.tiebreakersFormat`, e.target.value)}
          value={subdivision.values.tiebreakersFormat}
        >
          <Radio value={WINNING}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Winning %</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP} width="320px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
          <Radio value={POINTS}>
            <RadioGroupLabelTooltip>
              <RadioGroupLabel>Points</RadioGroupLabel>

              <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP} width="125px">
                <ReactSVG src={InfoCircleIcon} />
              </MonroeTooltip>
            </RadioGroupLabelTooltip>
          </Radio>
        </RadioGroupContainer>
      </InputWrapper>
    </div>
  )
}

interface DivisionFormProps {
  index: number
}

const DivisionForm: React.FC<DivisionFormProps> = ({ index }) => {
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<ICreateSeasonFormValues>()

  return (
    <Box direction="vertical" style={{ width: '100%' }}>
      <Form layout="vertical">
        <TextInput
          label="Division/Pool Name *"
          placeholder="Enter name"
          name={`divisions[${index}].name`}
          onChange={handleChange(`divisions[${index}].name`)}
          value={values?.divisions?.[index]?.name}
          error={touched.divisions?.[index].name ? errors.divisions?.[index].name || '' : ''}
          onBlur={handleBlur(`divisions[${index}].name`)}
        />

        <InputWrapper
          label="Division/Pool description"
          errorPosition="bottom"
          error={touched.divisions?.[index].description ? errors.divisions?.[index].description || '' : ''}
        >
          <TextArea
            name={`divisions[${index}].description`}
            placeholder="Enter description"
            rows={3}
            onChange={handleChange}
            value={values?.divisions?.[index]?.description}
          />
        </InputWrapper>

        <InputWrapper
          label="Playoff Format *"
          error={touched.divisions?.[index].playoffFormat ? errors.divisions?.[index].playoffFormat || '' : ''}
        >
          <Radio.Group
            name={`divisions[${index}].playoffFormat`}
            onChange={handleChange}
            value={values?.divisions?.[index]?.playoffFormat}
          >
            <Radio value={BEST_RECORD_WINS}>Best Record Wins</Radio>
            <Radio value={SINGLE_ELIMINATION_BRACKET}>Single Elimination Bracket</Radio>
          </Radio.Group>
        </InputWrapper>

        <Divider />

        <FieldArray
          name={`divisions[${index}].subdivisions`}
          render={(arrayHelpers) => (
            <>
              {values?.divisions?.[index]?.subdivisions?.map((_, subDivisionIndex: number) => (
                <Accordion
                  bordered={false}
                  defaultActiveKey={['0']}
                  expandIconPosition="end"
                  size="small"
                >
                  <Panel
                    key={subDivisionIndex.toString()}
                    header={<SubdivisionTitle>#{subDivisionIndex + 1} Sub Division</SubdivisionTitle>}
                  >
                    <SubDivisionForm
                      key={subDivisionIndex}
                      divisionIndex={index}
                      subDivisionIndex={subDivisionIndex}
                    />
                  </Panel>
                </Accordion>
              ))}
              <Button type="dashed" onClick={() => arrayHelpers.push({})} style={{ width: '100%' }}>
                + Add Sub Division
              </Button>
            </>
          )}
        />
      </Form>
    </Box>
  )
}

const DivisionPoolForm: React.FC = () => {
  const { values } = useFormikContext<ICreateSeasonFormValues>()

  return (
    <Form layout="vertical">
      <FieldArray
        name="divisions"
        render={(arrayHelpers) => (
          <>
            <Accordion
              bordered={false}
              defaultActiveKey={['0']}
              expandIconPosition="end"
              size="small"
            >
              {values?.divisions?.map((_, divisionIndex: number) => (
                <Panel
                  key={divisionIndex.toString()}
                  header={<PanelTitle level={5}>#{divisionIndex + 1} Division/Pool</PanelTitle>}
                >
                  <DivisionForm index={divisionIndex} />
                </Panel>
              ))}
            </Accordion>

            <Button
              type="dashed"
              onClick={() => arrayHelpers.push({ name: '', description: '', playoffFormat: '', subdivisions: [] })}
              icon={<PlusOutlined />}
              style={{ marginTop: 16 }}
            >
              Add Division
            </Button>
          </>
        )}
      />
    </Form>
  )
}

export default DivisionPoolForm

// Styled Components
const Accordion = styled(Collapse)`
    width: 352px;

    & .ant-collapse {
        width: 100%;
    }
`
const Box = styled(Space)`
    border: 1px solid ${colors.dimLight};
    padding: 18px;
    border-radius: 2px;
`
const PanelTitle = styled(Title)`
    margin-bottom: 0 !important;
`
const SubdivisionTitle = styled.div`
    font-size: 14px !important;
    color: ${colors.dim};
`
