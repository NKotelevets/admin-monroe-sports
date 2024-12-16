import { PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Flex, Radio, RadioChangeEvent } from 'antd'
import { FieldArray, FormikErrors, FormikTouched, useFormikContext } from 'formik'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import CreateSubdivision from '@/pages/Protected/Seasons/components/CreateSubdivision'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  INITIAL_SUBDIVISION_DATA
} from '@/pages/Protected/Seasons/constants/formik'

import { Accordion, AccordionHeader, MonroeDivider, OptionTitle, RadioGroupContainer } from '@/components/Elements'
import { CreateEntityContainer, Subtext, TitleStyle } from '@/components/Elements/entity'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTextarea from '@/components/Inputs/MonroeTextarea'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { IFEDivision } from '@/common/interfaces/division'
import { IFECreateSeason } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import ShowAllIcon from '@/assets/icons/show-all.svg'
import { BEST_RECORD_WINS, SINGLE_ELIMINATION_BRACKET } from '@/common/constants/league.ts'
import Typography from 'antd/es/typography'
import { AddBracketButton } from '@/pages/Protected/Seasons/components/Elements.tsx'
import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData.ts'
import { BracketItem } from '@/pages/Protected/Seasons/components/BracketItem.tsx'


interface ICreateDivisionProps {
  index: number
  division: ICreateSeasonDivision
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  errors: FormikErrors<IFECreateSeason>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<IFECreateSeason>>
  removeFn: (index: number) => void
  isMultipleDivisions: boolean
  values: ICreateSeasonFormValues
  setIds?: React.Dispatch<React.SetStateAction<number[]>>
  touched: FormikTouched<ICreateSeasonFormValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: (e: React.FocusEvent<any>) => void
}

const CreateDivision: FC<ICreateDivisionProps> = (props) => {
  const {
    index,
    division,
    removeFn,
    isMultipleDivisions,
    setIds
  } = props

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    handleChange: onChange
  } = useFormikContext<ICreateSeasonFormValues>()

  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0)
  const { isComponentVisible, ref } = useIsActiveComponent(index === 0)
  const isDisabled = !!(errors?.divisions?.[+index] as FormikErrors<IFEDivision>)?.sub_division?.length
  const allDivisionNames = values.divisions.map((d) => d.name)
  const { setIsDuplicateNames, isDuplicateNames } = useSeasonSlice()
  const listOfDuplicatedNames = allDivisionNames
    .map((dN, idx, array) => (array.indexOf(dN) === idx ? false : dN))
    .filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === division.name) ? 'Name already exists' : ''
  const isError = touched?.divisions?.[index] ? !!errors?.divisions?.[index] || isDuplicateNames : false

  useEffect(() => {
    if (notUniqueNameErrorText === 'Name already exists') {
      setIsDuplicateNames(true)
    } else {
      setIsDuplicateNames(false)
    }
  }, [notUniqueNameErrorText])

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  const namePrefix = `divisions.${index}`

  return (
    <CreateEntityContainer ref={ref} isError={isError}>
      {!isOpenedDetails && (
        <Flex justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)} className="c-p ph-8-v-16">
          <Flex vertical>
            <TitleStyle isError={isError}>{isError ? 'Missing mandatory data' : division.name}</TitleStyle>

            <Subtext>
              {division.subdivisions.length}{' '}
              {division.subdivisions.length === 1 ? 'Subdivision/Subpool' : 'Subdivisions/Subpools'}
            </Subtext>
          </Flex>

          {isMultipleDivisions && (
            <div onClick={() => removeFn(index)}>
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex className="ph-8-v-16" vertical>
          <Flex vertical>
            <div className="mg-b8">
              <MonroeInput
                label={<OptionTitle>Division/Pool Name *</OptionTitle>}
                name={`divisions.${index}.name`}
                value={division.name}
                onChange={onChange}
                placeholder="Enter name"
                className="h-32"
                error={
                  touched?.divisions?.[index]
                    ? notUniqueNameErrorText || (errors?.divisions?.[index] as FormikErrors<IFEDivision>)?.name
                    : ''
                }
                errorPosition="bottom"
                onBlur={handleBlur}
              />
            </div>
            <div className="mg-b8">
              <OptionTitle>Division/Pool Description</OptionTitle>
              <MonroeTextarea
                name={`divisions.${index}.description`}
                value={division.description}
                onChange={onChange}
                placeholder="Enter description"
                resize="vertical"
                initialHeight={56}
              />
            </div>
            <div className="mg-b8">
              <OptionTitle>Default Playoff Format *</OptionTitle>
              <RadioGroupContainer
                name={`${namePrefix}.playoffFormat`}
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.playoffFormat`, e.target.value)}
                value={division.playoffFormat}
              >
                <Radio value={BEST_RECORD_WINS}>Best Record Wins</Radio>
                <Radio value={SINGLE_ELIMINATION_BRACKET}>
                  <StyledFlex>
                    <Typography className="mg-r4">Single Elimination Bracket</Typography>
                    {/*{isBracketError && <ErrorText>At least one bracket required</ErrorText>}*/}
                  </StyledFlex>
                </Radio>
              </RadioGroupContainer>
              <FieldArray name={`divisions[${index}.brackets]`}>
                {(innerArrayHelpers) => (
                  <>
                    {division.playoffFormat === SINGLE_ELIMINATION_BRACKET && (
                      <>
                        {division?.brackets && (
                          <Flex vertical>
                            {division?.brackets?.map((bracket, idx) => {
                              const onDelete = () => {
                                innerArrayHelpers.remove(idx)
                                if (bracket.id && setIds)
                                  setIds((prev) => [...prev, bracket.id as number])
                              }

                              const onEdit = () => {
                                alert('editing bracket')
                                // setIsCreateBracketPage(true)
                                // setPathToSubdivisionDataAndIndexes(`${namePrefix}&${divisionIndex}-${index}`)
                                // setBracketIdx(idx)
                                // setBracketMode('edit')
                                // setSelectedBracketId(bracket.id as number)
                              }

                              return (
                                <BracketItem
                                  bracket={bracket}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                />
                              )
                            })}
                          </Flex>
                        )}

                        <MonroeTooltip
                          text="You can't create bracket when you don't have division/pool name"
                          width="200px"
                          containerWidth="158px"
                        >
                          <AddBracketButton
                            type="default"
                            icon={<PlusOutlined />}
                            // disabled={isBlockAddBracketButton}
                            iconPosition="start"
                            onClick={() => {
                              alert('creating breacket')
                              // setIsCreateBracketPage(true)
                              // setPathToSubdivisionDataAndIndexes(`${namePrefix}&${divisionIndex}-${index}`)
                              // setBracketIdx(lastBracketIdx)
                              // setBracketMode('create')
                              innerArrayHelpers.push({
                                name: '',
                                subdivisionsNames: [],
                                playoffTeams: 2,
                                matches: BRACKETS_OPTIONS[2],
                              })
                              // setSelectedBracketId(null)
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
            </div>
          </Flex>

          <MonroeDivider />

          <FieldArray name={`divisions[${index}.subdivisions]`}>
            {(innerArrayHelpers) => {
              const collapsedDivisionItems = division.subdivisions.map((subdivision, idx) => {
                const namePrefix = `divisions.${index}.subdivisions.${idx}`

                return {
                  key: idx,
                  children: (
                    <CreateSubdivision
                      index={idx}
                      divisionIndex={index}
                      onChange={onChange}
                      subdivision={subdivision}
                      namePrefix={namePrefix}
                      setFieldValue={setFieldValue}
                      isMultipleSubdivisions={division.subdivisions.length > 1}
                      removeFn={innerArrayHelpers.remove}
                      errors={errors}
                      division={division}
                      values={values}
                      setIds={setIds}
                      touched={touched}
                      handleBlur={handleBlur}
                    />
                  ),
                  label: <AccordionHeader is_add_margin={`${idx > 0}`}>#{idx + 1} Subdivision/subpool</AccordionHeader>
                }
              })

              return (
                <div>
                  {!!division.subdivisions.length && (
                    <>
                      <StyledAccordion
                        items={collapsedDivisionItems}
                        expandIconPosition="end"
                        defaultActiveKey={[0]}
                        expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                        accordion
                        className="subdivision-collapse"
                      />

                      <MonroeDivider />
                    </>
                  )}

                  <MonroeTooltip
                    text={
                      isDisabled
                        ? 'You can\'t create subdivision/subpool when you have errors in other subdivisions/subpools'
                        : ''
                    }
                    width="280px"
                    containerWidth="200px"
                  >
                    <TextButton
                      icon={<PlusOutlined />}
                      onClick={() => innerArrayHelpers.push(INITIAL_SUBDIVISION_DATA)}
                      disabled={isDisabled}
                    >
                      Add subdivision/subpool
                    </TextButton>
                  </MonroeTooltip>
                </div>
              )
            }}
          </FieldArray>
        </Flex>
      )}
    </CreateEntityContainer>
  )
}

export default CreateDivision

// Styled Components
const StyledFlex = styled(Flex)`
    flex-direction: column;

    @media (width > 1660px) {
        flex-direction: row;
        align-items: flex-end;
    }
`
// const ErrorText = styled(Typography)`
//     font-weight: 400;
//     font-size: 12px;
//     color: #bc261b;
// `
const TextButton = styled(Button)`
    border: 0;
    background: transparent;
    box-shadow: none;
`
const StyledAccordion = styled(Accordion)`
    width: 320px;

    @media (width > 1660px) {
        width: 568px;
    }
`
