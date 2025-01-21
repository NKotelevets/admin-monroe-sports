import React, { useEffect, useMemo } from 'react'
import { FieldArray, FieldArrayRenderProps, FormikErrors, useFormikContext } from 'formik'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  IDivisionFormik
} from '@/pages/Protected/Seasons/constants/formik.ts'
import { useFormSummary } from '@/hooks/useFormSummary.tsx'
import { FormSummary } from '@/components/FormSummary.tsx'
import { Flex, Form, Input, Radio, Space } from 'antd'
import TextInput from '@/components/Inputs/TextInput.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import { BEST_RECORD_WINS, SINGLE_ELIMINATION_BRACKET } from '@/common/constants/league.ts'
import { SubdivisionAccordion } from '@/pages/Protected/Seasons/components/SeasonForm/SubdivisionAccordion'
import { DivisionFormProps } from '@/pages/Protected/Seasons/components/SeasonForm/DivisionAccordion/index.tsx'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import { BracketItem } from '@/pages/Protected/Seasons/components/BracketItem.tsx'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import { PlusOutlined } from '@ant-design/icons'
import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData.ts'
import { Button } from '@/components/Button.tsx'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import { IFEDivision } from '@/common/interfaces/division.ts'

const { TextArea } = Input

/**
 * The DivisionField component handles the rendering and management of division forms
 * within a season form, including sub-forms for subdivisions and brackets.
 *
 * @param {DivisionFormProps} props - The properties for the DivisionField component.
 * @returns {JSX.Element} The rendered DivisionField component.
 */
export const DivisionField: React.FC<DivisionFormProps> = (props) => {
  const { index, isOpened, arrayHelpers } = props
  const { setShowBracketPage, setIds, getErrorMessage } = useSeasonFormContext()
  const { showForm, setShowForm } = useFormSummary(isOpened)
  const {
    setBracketIdx,
    setBracketMode,
    setSelectedBracketId,
    setPathToSubdivisionDataAndIndexes,
    setIsDuplicateNames,
    isDuplicateNames
  } = useSeasonSlice()

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldError
  } = useFormikContext<ICreateSeasonFormValues>()

  const division: IDivisionFormik = {
    values: values?.divisions?.[index],
    touched: touched.divisions?.[index],
    errors: errors.divisions?.[index] as FormikErrors<ICreateSeasonDivision>
  }

  const showDeleteButton = values?.divisions?.length > 1
  const hasErrors = !!division.errors
  const isByBracket = useMemo(() => division.values?.playoffFormat === SINGLE_ELIMINATION_BRACKET, [division.values?.playoffFormat])
  const canAddBracket = !division.errors?.subDivisions && !!division.values?.name
  const bracketsTooltipMessage = !canAddBracket
    ? `You can't create bracket when you don't have division or subdivision name`
    : undefined

  const allDivisionNames = values.divisions.map((d) => d.name)
  const listOfDuplicatedNames = allDivisionNames
    .map((dN, idx, array) => (array.indexOf(dN) === idx ? false : dN))
    .filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === division.values?.name) ? 'Name already exists' : ''
  const isError = !!getErrorMessage(errors?.divisions?.[index] ? 'error' : '', !!touched?.divisions?.[index]) || isDuplicateNames

  useEffect(() => {
    if (notUniqueNameErrorText === 'Name already exists') {
      setIsDuplicateNames(true)
    } else {
      setIsDuplicateNames(false)
    }
  }, [notUniqueNameErrorText])

  useEffect(() => {
    if (isDuplicateNames) {
      setFieldError(`divisions[${index}].name`, 'Name already exists')
    } else {
      setFieldError(`divisions[${index}].name`, undefined)
    }
  }, [isDuplicateNames])

  const divisionLength = division.values?.subDivisions.length || 0

  /**
   * Handles the addition of a new bracket to the division.
   *
   * @param {FieldArrayRenderProps} innerArrayHelpers - Helpers provided by FieldArray.
   * @returns {Function} Callback to add a new bracket.
   */
  const onAddBracket = (innerArrayHelpers: FieldArrayRenderProps) => {
    return () => {
      setShowBracketPage(true)
      setPathToSubdivisionDataAndIndexes(`divisions[${index}]&${index}`)
      setBracketIdx(division.values?.brackets?.length || 0)
      setBracketMode('create')
      innerArrayHelpers.push({
        name: '',
        subdivisionsNames: division.values?.subDivisions.map(sd => sd.name),
        playoffTeams: 2,
        matches: BRACKETS_OPTIONS[2]
      })
      setSelectedBracketId(null)
    }
  }

  if (!showForm) {
    return (
      <Box
        showForm={true}
        direction="vertical"
        error={hasErrors || isError}
        onClick={() => setShowForm(true)}
      >
        <FormSummary
          error={hasErrors || isError}
          title={hasErrors || isError ? 'Missing mandatory data' : division.values?.name || 'Missing mandatory data'}
          subtitle={`${division.values?.subDivisions.length} Subdivision${divisionLength > 1 ? 's' : ''}`}
          icon={showDeleteButton ? <Delete /> : undefined}
          iconAction={() => arrayHelpers.remove(index)}
        />
      </Box>
    )
  }

  return (
    <Box
      direction="vertical"
      error={(hasErrors || isError) && !showForm}
      onClick={!showForm ? () => setShowForm(true) : undefined}
    >
      <Form layout="vertical" key={index.toString()}>
        <TextInput
          label="Division/Pool Name *"
          placeholder="Enter name"
          name={`divisions[${index}].name`}
          onChange={handleChange(`divisions[${index}].name`)}
          value={division.values?.name || ''}
          error={getErrorMessage(notUniqueNameErrorText || (errors?.divisions?.[index] as FormikErrors<IFEDivision>)?.name,!!touched?.divisions?.[index])}
          onBlur={handleBlur(`divisions[${index}].name`)}
        />

        <InputWrapper
          label="Division/Pool description"
          errorPosition="bottom"
          error={getErrorMessage(division.errors?.description || '', division.touched?.description)}
        >
          <TextArea
            name={`divisions[${index}].description`}
            placeholder="Enter description"
            rows={3}
            onChange={handleChange}
            value={values?.divisions?.[index]?.description}
          />
        </InputWrapper>

        <RadioWrapper
          isBracket={isByBracket}
          label="Playoff Format *"
          error={getErrorMessage(division.errors?.playoffFormat, division.touched?.playoffFormat)}
        >
          <Radio.Group
            name={`divisions[${index}].playoffFormat`}
            onChange={handleChange}
            value={values?.divisions?.[index]?.playoffFormat}
          >
            <Radio value={BEST_RECORD_WINS}>Best Record Wins</Radio>
            <Radio value={SINGLE_ELIMINATION_BRACKET}>Single Elimination Bracket</Radio>
          </Radio.Group>
        </RadioWrapper>

        <FieldArray name={`divisions[${index}.brackets]`}>
          {(innerArrayHelpers) => (
            <>
              {isByBracket && (
                <>
                  {division.values?.brackets && (
                    <Flex vertical>
                      <BracketWrapper>
                        {division.values?.brackets?.map((bracket, idx) => {
                          const onDelete = () => {
                            innerArrayHelpers.remove(idx)
                            if (bracket.id && setIds)
                              setIds((prev) => [...prev, bracket.id as number])
                          }
                          const onEdit = () => {
                            setShowBracketPage(true)
                            setPathToSubdivisionDataAndIndexes(`divisions[${index}]&${index}`)
                            setBracketIdx(idx)
                            setBracketMode('edit')
                            setSelectedBracketId(bracket.id as number)
                          }

                          return <BracketItem key={`bracket-${idx}`} bracket={bracket} onEdit={onEdit} onDelete={onDelete} />
                        })}
                      </BracketWrapper>
                    </Flex>
                  )}

                  <MonroeTooltip text={bracketsTooltipMessage} width="200px" containerWidth="158px">
                    <AddBracketButton
                      size="small"
                      type="default"
                      icon={<PlusOutlined />}
                      disabled={!canAddBracket}
                      iconPosition="start"
                      onClick={onAddBracket(innerArrayHelpers)}
                    >
                      Add Bracket
                    </AddBracketButton>
                  </MonroeTooltip>
                </>
              )}
            </>
          )}
        </FieldArray>

        <SubdivisionAccordion index={index} division={division} />
      </Form>
    </Box>
  )
}

// Styled Components
const Box = styled(Space)<{ error: boolean, showForm?: boolean }>`
    width: 100%;
    padding: 16px;
    border-radius: 3px;
    cursor: ${({ showForm }) => showForm ? 'pointer' : 'default' };
    
    border: 1px solid ${({ error }) => error ? colors.primary : colors.dimLight};
`
const RadioWrapper = styled(InputWrapper)<{ isBracket: boolean }>`
    margin-bottom: ${({ isBracket }) => isBracket ? 0 : 16}px !important
`
const Delete = styled(DeleteOutlined)`
    font-size: 16px;
    color: ${colors.primary}
`
const BracketWrapper = styled.div`
    margin-top: 4px;
`
const AddBracketButton = styled(Button)`
    margin-top: 8px;
    margin-bottom: 16px;
    font-size: 12px !important;
`
