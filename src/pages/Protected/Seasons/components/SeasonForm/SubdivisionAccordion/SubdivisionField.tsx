import React, { ChangeEvent, useEffect, useState } from 'react'
import { useFormSummary } from '@/hooks/useFormSummary.tsx'
import { FieldArrayRenderProps, useFormikContext } from 'formik'
import { ICreateSeasonDivision, ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { FormSummary } from '@/components/FormSummary.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import { RadioGroupContainer, RadioGroupLabel, RadioGroupLabelTooltip } from '@/components/Elements'
import { Input, Radio, RadioChangeEvent, Space } from 'antd'
import { POINTS, WINNING } from '@/common/constants/league.ts'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips.tsx'
import { ReactSVG } from 'react-svg'
import InfoCircleIcon from '@/assets/icons/info-circle.svg'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import MonroeModal from '@/components/MonroeModal.tsx'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'

const { TextArea } = Input

interface SubDivisionFormProps {
  divisionIndex: number
  subDivisionIndex: number
  isOpened: boolean
  arrayHelpers: FieldArrayRenderProps
}


export const SubdivisionField: React.FC<SubDivisionFormProps> = (props) => {
  const { divisionIndex, subDivisionIndex, isOpened, arrayHelpers } = props
  const { showForm, setShowForm } = useFormSummary(isOpened)
  const { getErrorMessage } = useSeasonFormContext()
  const { setIsDuplicateNames } = useSeasonSlice()
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ICreateSeasonFormValues>()

  const field = `divisions[${divisionIndex}].subDivisions[${subDivisionIndex}]`
  const subdivision = {
    values: values?.divisions?.[divisionIndex]?.subDivisions?.[subDivisionIndex],
    touched: touched?.divisions?.[divisionIndex]?.subDivisions?.[subDivisionIndex],
    errors: (errors?.divisions?.[divisionIndex] as Partial<ICreateSeasonDivision>)?.subDivisions?.[subDivisionIndex]
  }

  const generalError = (errors?.divisions?.[divisionIndex] as Partial<ICreateSeasonDivision>)?.subDivisions
  const nameError = typeof generalError === 'string' ? generalError : undefined

  const isError = !!subdivision.errors
  const canDelete = values?.divisions?.[divisionIndex]?.subDivisions?.length > 1
  const allSubdivisionsNames = values?.divisions?.[divisionIndex]?.subDivisions?.map((sd) => sd.name)
  const listOfDuplicatedNames = allSubdivisionsNames.map((dN, idx, array) => {
    if (array.indexOf(dN) === idx) return false
    return dN
  }).filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === subdivision.values.name)
    ? 'Name already exists'
    : ''

  const [isShowModal, setIsShowModal] = useState(false)

  useEffect(() => {
    if (notUniqueNameErrorText === 'Name already exists') {
      setIsDuplicateNames(true)
    } else {
      setIsDuplicateNames(false)
    }
  }, [notUniqueNameErrorText])

  const handleSubdivisionNameChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newSubdivisionName = event.target.value
    const oldSubdivisionName = subdivision.values.name

    const updatedValues = values.divisions.map((sd) => {
      if ((sd.name === oldSubdivisionName && sd.brackets) || sd.brackets) {
        return {
          ...sd,
          brackets: sd.brackets.map((bracket) => ({
            ...bracket,
            subdivisionsNames: bracket.subdivisionsNames.map((subdivisionName) => {
              if (subdivisionName === oldSubdivisionName) return newSubdivisionName
              return subdivisionName
            }),
            matches: bracket.matches.map((match) => ({
              ...match,
              participants: match.matchParticipants.map((participant) => {
                if (participant.subDivision === oldSubdivisionName) {
                  return {
                    ...participant,
                    subpoolName: newSubdivisionName
                  }
                }

                return participant
              })
            }))
          }))
        }
      }

      return sd
    })

    setFieldValue('divisions', updatedValues)

    handleChange(`${field}.name`)(newSubdivisionName)
  }


  const handleDelete = () => {
    const isSubDivisionNameUsed = values.divisions.find((division) =>
      division.brackets?.find((bracket) =>
        bracket.matches?.find((match) =>
          match.matchParticipants?.find((p) => p.subDivision === subdivision.values.name)
        )
      )
    )

    if (!isSubDivisionNameUsed) {
      arrayHelpers.remove(subDivisionIndex)
    } else {
      setIsShowModal(true)
    }
  }


  if (!showForm) {
    return (
      <Box
        direction="vertical"
        collapsed
        error={nameError || isError}
        onClick={() => setShowForm(true)}
      >
        {isShowModal && (
          <MonroeModal
            okText="Confirm"
            onOk={() => setIsShowModal(false)}
            closable={false}
            type="warn"
            title="Forbidden action"
            content={<p>You can't delete this subdivision because it used on brackets</p>}
          />
        )}

        <FormSummary
          error={nameError || isError}
          title={nameError || isError ? 'Missing mandatory data' : subdivision.values.name || 'Missing mandatory data'}
          icon={canDelete ? <Delete /> : undefined}
          iconAction={handleDelete}
        />
      </Box>
    )
  }

  return (
    <Box
      direction="vertical"
      collapsed={!showForm}
      error={(nameError || isError) && !showForm}
      onClick={!showForm ? () => setShowForm(true) : undefined}
    >
      <div>
        <TextInput
          label="Sub Division Name"
          name={`${field}.name`}
          placeholder="Enter name"
          onChange={handleSubdivisionNameChange}
          value={subdivision.values?.name}
          errorPosition="bottom"
          error={getErrorMessage(nameError || subdivision.errors?.name, subdivision.touched?.name || nameError)}
          onBlur={handleBlur(`${field}.name`)}
        />

        <InputWrapper
          label="Sub Division Description"
          errorPosition="bottom"
          error={getErrorMessage(subdivision.errors?.description, subdivision.touched?.description)}
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
          error={getErrorMessage(subdivision.errors?.standingsFormat, subdivision.touched?.standingsFormat)}
        >
          <RadioGroupContainer
            onChange={(e: RadioChangeEvent) => setFieldValue(`${field}.standingsFormat`, e.target.value)}
            value={subdivision.values?.standingsFormat || WINNING}
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
          error={getErrorMessage(subdivision.errors?.tiebreakersFormat, subdivision.touched?.tiebreakersFormat)}
        >
          <RadioGroupContainer
            onChange={(e: RadioChangeEvent) => setFieldValue(`${field}.tiebreakersFormat`, e.target.value)}
            value={subdivision.values.tiebreakersFormat || WINNING}
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
    </Box>
  )
}

// Styled Components
const Box = styled(Space)<{ error: boolean, collapsed: boolean }>`
    width: 100%;
    padding: ${({ error, collapsed }) => error || collapsed ? 14 : 0}px;
    border-radius: 3px;
    border: 1px solid ${({ error, collapsed }) => collapsed ? (error ? colors.primary : colors.dimLight) : 0};
`
const Delete = styled(DeleteOutlined)`
    font-size: 16px;
    color: ${colors.primary}
`
