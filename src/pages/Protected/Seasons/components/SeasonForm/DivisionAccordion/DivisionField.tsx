import React, { useEffect, useMemo } from 'react'
import { FieldArray, FormikErrors, useFormikContext } from 'formik'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  IDivisionFormik
} from '@/pages/Protected/Seasons/constants/formik.ts'
import { useFormSummary } from '@/hooks/useFormSummary.tsx'
import { FormSummary } from '@/components/FormSummary.tsx'
import { Flex, Form, Input, Radio, Space, Typography } from 'antd'
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

export const DivisionField: React.FC<DivisionFormProps> = (props) => {
  const { index, isOpened, arrayHelpers } = props
  const { setShowBracketPage, setIds } = useSeasonFormContext()
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

  // mapped values for better readability
  const division: IDivisionFormik = {
    values: values?.divisions?.[index],
    touched: touched.divisions?.[index],
    errors: errors.divisions?.[index] as FormikErrors<ICreateSeasonDivision>
  }

  const showDeleteButton = values?.divisions?.length > 1
  const hasErrors = !!division.errors
  const isByBracket = useMemo(() => division.values?.playoffFormat === SINGLE_ELIMINATION_BRACKET, [division.values?.playoffFormat])
  const isBracketError = isByBracket && !division.values?.brackets?.length
  const canAddBracket = !division.errors?.subDivisions && !!division.values?.name
  const bracketsTooltipMessage = !canAddBracket
    ? `You can't create bracket when you don't have division or subdivision name`
    : undefined

  const allDivisionNames = values.divisions.map((d) => d.name)
  const listOfDuplicatedNames = allDivisionNames
    .map((dN, idx, array) => (array.indexOf(dN) === idx ? false : dN))
    .filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === division.values?.name) ? 'Name already exists' : ''
  const isError = touched?.divisions?.[index] ? !!errors?.divisions?.[index] || isDuplicateNames : false

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
          error={
            touched?.divisions?.[index]
              ? notUniqueNameErrorText || (errors?.divisions?.[index] as FormikErrors<IFEDivision>)?.name
              : ''
          }
          onBlur={handleBlur(`divisions[${index}].name`)}
        />

        <InputWrapper
          label="Division/Pool description"
          errorPosition="bottom"
          error={division.touched?.description ? division.errors?.description || '' : ''}
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
          error={division.touched?.playoffFormat ? division.errors?.playoffFormat || '' : ''}
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
                        {isBracketError && <ErrorText>At least one bracket required</ErrorText>}
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
                      onClick={() => {
                        setShowBracketPage(true)
                        setPathToSubdivisionDataAndIndexes(`divisions[${index}]&${index}`)
                        setBracketIdx(division.values?.brackets?.length || 0)
                        setBracketMode('create')
                        innerArrayHelpers.push({
                          name: '',
                          subdivisionsNames: [],
                          playoffTeams: 2,
                          matches: BRACKETS_OPTIONS[2]
                        })
                        setSelectedBracketId(null)
                      }}
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
const ErrorText = styled(Typography)`
    font-weight: 400;
    font-size: 12px;
    color: #bc261b;
    padding: 0 24px;
    position: relative;
    top: -4px
`
