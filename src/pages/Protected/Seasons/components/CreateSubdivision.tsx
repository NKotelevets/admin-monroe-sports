import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import styled from '@emotion/styled'
import { Flex, Radio, RadioChangeEvent } from 'antd'
import Typography from 'antd/es/typography'
import { FieldArray, FormikErrors, FormikTouched } from 'formik'
import { ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP,
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips'
import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData'
import { AddBracketButton, BracketNameWrapper, IconsWrapper } from '@/pages/Protected/Seasons/components/Elements'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  ICreateSeasonSubdivision,
} from '@/pages/Protected/Seasons/constants/formik'

import { OptionTitle, RadioGroupContainer, RadioGroupLabel, RadioGroupLabelTooltip } from '@/components/Elements'
import { CreateEntityContainer, TitleStyle } from '@/components/Elements/entity'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTextarea from '@/components/Inputs/MonroeTextarea'
import MonroeModal from '@/components/MonroeModal'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { BEST_RECORD_WINS, POINTS, SINGLE_ELIMINATION_BRACKET, WINNING } from '@/common/constants/league'
import { IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IFECreateSeason } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import InfoCircleIcon from '@/assets/icons/info-circle.svg'
import SmallDeleteIcon from '@/assets/icons/small-delete.svg'
import SmallEditIcon from '@/assets/icons/small-edit.svg'

const StyledFlex = styled(Flex)`
  flex-direction: column;

  @media (width > 1660px) {
    flex-direction: row;
    align-items: flex-end;
  }
`

const ErrorText = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  color: #bc261b;
`

interface ICreateSubdivisionProps {
  subdivision: ICreateSeasonSubdivision
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  errors: FormikErrors<IFECreateSeason>
  index: number
  namePrefix: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<IFECreateSeason>>
  isMultipleSubdivisions: boolean
  removeFn: (index: number) => void
  divisionIndex: number
  division: ICreateSeasonDivision
  values: ICreateSeasonFormValues
  setIds?: React.Dispatch<React.SetStateAction<number[]>>
  touched: FormikTouched<ICreateSeasonFormValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: (e: React.FocusEvent<any>) => void
}

const CreateSubdivision: FC<ICreateSubdivisionProps> = ({
  onChange,
  subdivision,
  namePrefix,
  setFieldValue,
  errors,
  isMultipleSubdivisions,
  removeFn,
  index,
  divisionIndex,
  division,
  values,
  setIds,
  handleBlur,
  touched,
}) => {
  const { setBracketIdx, setBracketMode, setIsDuplicateNames } = useSeasonSlice()
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { isComponentVisible, ref } = useIsActiveComponent(index === 0 ? true : false)
  const subdivisionError =
    touched.divisions?.[+divisionIndex].subdivisions?.[+index] &&
    (errors?.divisions?.[divisionIndex] as FormikErrors<IFEDivision>)?.subdivisions?.[index]
  const isBlockAddBracketButton =
    !!(subdivisionError as FormikErrors<IFESubdivision>)?.name ||
    (subdivision.playoffFormat === SINGLE_ELIMINATION_BRACKET && !subdivision.name)
  const { setIsCreateBracketPage, setSelectedBracketId, setPathToSubdivisionDataAndIndexes } = useSeasonSlice()
  const allSubdivisionsNames = division.subdivisions.map((sd) => sd.name)
  const listOfDuplicatedNames = allSubdivisionsNames
    .map((dN, idx, array) => {
      if (array.indexOf(dN) === idx) return false

      return dN
    })
    .filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === subdivision.name)
    ? 'Name already exists'
    : ''
  const isBracketError = subdivision.playoffFormat === SINGLE_ELIMINATION_BRACKET && !subdivision.brackets?.length
  const isError = !!subdivisionError || !!notUniqueNameErrorText || isBracketError
  const lastBracketIdx = subdivision.brackets?.length ? subdivision.brackets.length : 0
  const [isShowModal, setIsShowModal] = useState(false)
  const subdivisionNameError = (subdivisionError as FormikErrors<IFESubdivision>)?.name
  const isDivisionTouched = touched.divisions?.[divisionIndex]
  const subdivError =
    isDivisionTouched || touched.divisions?.[divisionIndex]?.subdivisions?.[index]?.name
      ? notUniqueNameErrorText || subdivisionNameError
      : ''

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  useEffect(() => {
    if (notUniqueNameErrorText === 'Name already exists') {
      setIsDuplicateNames(true)
    } else {
      setIsDuplicateNames(false)
    }
  }, [notUniqueNameErrorText])

  const handleSubdivisionNameChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newSubdivisionName = event.target.value
    const oldSubdivisionName = subdivision.name

    const updatedValues = values.divisions.map((division) => ({
      ...division,
      subdivisions: division.subdivisions.map((sd) => {
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
                participants: match.participants.map((participant) => {
                  if (participant.subpoolName === oldSubdivisionName) {
                    return {
                      ...participant,
                      subpoolName: newSubdivisionName,
                    }
                  }

                  return participant
                }),
              })),
            })),
          }
        }

        return sd
      }),
    }))

    setFieldValue('divisions', updatedValues)

    onChange(event)
  }

  const handleDelete = () => {
    const isSubDivisionNameUsed = values.divisions.find((division) =>
      division.subdivisions.find((subdiv) =>
        subdiv.brackets?.find((bracket) =>
          bracket.matches?.find((match) =>
            match.participants?.find((p) => p.subpoolName === subdivision.name && subdiv.name !== subdivision.name),
          ),
        ),
      ),
    )

    if (!isSubDivisionNameUsed) {
      removeFn(index)
    } else {
      setIsShowModal(true)
    }
  }

  return (
    <CreateEntityContainer className="w-auto" ref={ref} isError={isError}>
      {isShowModal && (
        <MonroeModal
          okText="Confirm"
          onOk={() => setIsShowModal(false)}
          type="warn"
          title="Forbidden action"
          content={<p>You can't delete this subdivision because it used on brackets</p>}
        />
      )}

      {!isOpenedDetails && (
        <Flex justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)} className="c-p ph-8-v-16">
          <Flex vertical>
            <TitleStyle isError={isError}>
              {isError ? 'Missing mandatory data' : subdivision.name || 'subdivision/subpool name'}
            </TitleStyle>
          </Flex>

          {isMultipleSubdivisions && (
            <div onClick={handleDelete} className="c-p">
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical className="ph-8-v-16">
          <div className="mg-b8">
            <MonroeInput
              label={<OptionTitle>Subdivision/subpool Name *</OptionTitle>}
              name={`${namePrefix}.name`}
              value={subdivision.name}
              onChange={handleSubdivisionNameChange}
              placeholder="Enter name"
              className="w-full h-32"
              error={subdivError}
              errorPosition="bottom"
              onBlur={handleBlur}
            />
          </div>
          <div className="mg-b8">
            <OptionTitle>Subdivision/subpool Description</OptionTitle>
            <MonroeTextarea
              name={`${namePrefix}.description`}
              value={subdivision.description}
              onChange={onChange}
              placeholder="Enter description"
              resize="vertical"
              initialHeight={56}
            />
          </div>

          <Flex vertical justify="flex-start">
            <div className="mg-b8">
              <OptionTitle>Default Playoff Format *</OptionTitle>
              <RadioGroupContainer
                name={`${namePrefix}.playoffFormat`}
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.playoffFormat`, e.target.value)}
                value={subdivision.playoffFormat}
              >
                <Radio value={BEST_RECORD_WINS}>Best Record Wins</Radio>
                <Radio value={SINGLE_ELIMINATION_BRACKET}>
                  <StyledFlex>
                    <Typography className="mg-r4">Single Elimination Bracket</Typography>
                    {isBracketError && <ErrorText>At least one bracket required</ErrorText>}
                  </StyledFlex>
                </Radio>
              </RadioGroupContainer>

              <FieldArray name={`divisions[${divisionIndex}.subdivisions[${index}.brackets]]`}>
                {(innerArrayHelpers) => (
                  <>
                    {subdivision.playoffFormat === SINGLE_ELIMINATION_BRACKET && (
                      <>
                        {subdivision?.brackets && (
                          <Flex vertical>
                            {subdivision?.brackets?.map((bracketData, idx) => (
                              <Flex key={bracketData.name} justify="space-between" className="mg-t5">
                                <BracketNameWrapper>{bracketData.name}</BracketNameWrapper>

                                <IconsWrapper>
                                  <div className="mg-r4">
                                    <ReactSVG
                                      src={SmallEditIcon}
                                      className="c-p default-icon-sizes"
                                      onClick={() => {
                                        setIsCreateBracketPage(true)
                                        setPathToSubdivisionDataAndIndexes(`${namePrefix}&${divisionIndex}-${index}`)
                                        setBracketIdx(idx)
                                        setBracketMode('edit')
                                        setSelectedBracketId(bracketData.id as number)
                                      }}
                                    />
                                  </div>

                                  <ReactSVG
                                    src={SmallDeleteIcon}
                                    className="c-p default-icon-sizes"
                                    onClick={() => {
                                      innerArrayHelpers.remove(idx)
                                      if (bracketData.id && setIds)
                                        setIds((prev) => [...prev, bracketData.id as number])
                                    }}
                                  />
                                </IconsWrapper>
                              </Flex>
                            ))}
                          </Flex>
                        )}

                        <MonroeTooltip
                          text={
                            isBlockAddBracketButton
                              ? "You can't create bracket when you don't have subdivision/subpool name"
                              : ''
                          }
                          width="200px"
                          containerWidth="158px"
                        >
                          <AddBracketButton
                            type="default"
                            icon={<PlusOutlined />}
                            disabled={isBlockAddBracketButton}
                            iconPosition="start"
                            onClick={() => {
                              setIsCreateBracketPage(true)
                              setPathToSubdivisionDataAndIndexes(`${namePrefix}&${divisionIndex}-${index}`)
                              setBracketIdx(lastBracketIdx)
                              setBracketMode('create')
                              innerArrayHelpers.push({
                                name: '',
                                subdivisionsNames: [],
                                playoffTeams: 2,
                                matches: BRACKETS_OPTIONS[2],
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
            </div>

            <div className="mg-b8">
              <OptionTitle>Default Standings Format *</OptionTitle>
              <RadioGroupContainer
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.standingsFormat`, e.target.value)}
                value={subdivision.standingsFormat}
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
            </div>

            <div className="mg-b8">
              <OptionTitle>Default Tiebreakers Format *</OptionTitle>
              <RadioGroupContainer
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.tiebreakersFormat`, e.target.value)}
                value={subdivision.tiebreakersFormat}
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
            </div>
          </Flex>
        </Flex>
      )}
    </CreateEntityContainer>
  )
}

export default CreateSubdivision
