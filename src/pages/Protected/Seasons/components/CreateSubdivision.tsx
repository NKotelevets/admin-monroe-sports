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
    (subdivision.playoffFormat === 'Single Elimination Bracket' && !subdivision.name)
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
  const isBracketError = subdivision.playoffFormat === 'Single Elimination Bracket' && !subdivision.brackets?.length
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
    <CreateEntityContainer ref={ref} isError={isError}>
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
        <Flex
          justify="space-between"
          align="center"
          onClick={() => setIsOpenedDetails(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          <Flex vertical>
            <TitleStyle isError={isError}>
              {isError ? 'Missing mandatory data' : subdivision.name || 'subdivision/subpool name'}
            </TitleStyle>
          </Flex>

          {isMultipleSubdivisions && (
            <div onClick={handleDelete} style={{ cursor: 'pointer' }}>
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical style={{ padding: '8px 16px' }}>
          <div style={{ marginBottom: '8px' }}>
            <MonroeInput
              label={<OptionTitle>Subdivision/subpool Name *</OptionTitle>}
              name={`${namePrefix}.name`}
              value={subdivision.name}
              onChange={handleSubdivisionNameChange}
              placeholder="Enter name"
              style={{ width: '100%', height: '32px' }}
              error={subdivError}
              errorPosition="bottom"
              onBlur={handleBlur}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
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
            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Default Playoff Format *</OptionTitle>
              <RadioGroupContainer
                name={`${namePrefix}.playoffFormat`}
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.playoffFormat`, e.target.value)}
                value={subdivision.playoffFormat}
              >
                <Radio value="Best Record Wins">Best Record Wins</Radio>
                <Radio value="Single Elimination Bracket">
                  <StyledFlex>
                    <Typography style={{ marginRight: '4px' }}>Single Elimination Bracket</Typography>

                    {isBracketError && (
                      <Typography style={{ fontSize: '12px', fontWeight: 400, color: '#bc261b' }}>
                        At least one bracket required
                      </Typography>
                    )}
                  </StyledFlex>
                </Radio>
              </RadioGroupContainer>

              <FieldArray name={`divisions[${divisionIndex}.subdivisions[${index}.brackets]]`}>
                {(innerArrayHelpers) => (
                  <>
                    {subdivision.playoffFormat === 'Single Elimination Bracket' && (
                      <>
                        {subdivision?.brackets && (
                          <Flex vertical>
                            {subdivision?.brackets?.map((bracketData, idx) => (
                              <Flex
                                key={bracketData.name}
                                justify="space-between"
                                style={{
                                  marginTop: '5px',
                                }}
                              >
                                <BracketNameWrapper>{bracketData.name}</BracketNameWrapper>

                                <IconsWrapper>
                                  <div
                                    style={{
                                      marginRight: '4px',
                                    }}
                                  >
                                    <ReactSVG
                                      src={SmallEditIcon}
                                      style={{ width: '14px', height: '14px', cursor: 'pointer' }}
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
                                    style={{ width: '14px', height: '14px', cursor: 'pointer' }}
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

            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Default Standings Format *</OptionTitle>
              <RadioGroupContainer
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.standingsFormat`, e.target.value)}
                value={subdivision.standingsFormat}
              >
                <Radio value="Winning %">
                  <RadioGroupLabelTooltip>
                    <RadioGroupLabel>Winning %</RadioGroupLabel>

                    <MonroeTooltip text={DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP} width="135px">
                      <ReactSVG src={InfoCircleIcon} />
                    </MonroeTooltip>
                  </RadioGroupLabelTooltip>
                </Radio>
                <Radio value="Points">
                  <RadioGroupLabelTooltip>
                    <RadioGroupLabel>Points</RadioGroupLabel>

                    <MonroeTooltip text={DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP} width="308px">
                      <ReactSVG src={InfoCircleIcon} />
                    </MonroeTooltip>
                  </RadioGroupLabelTooltip>
                </Radio>
              </RadioGroupContainer>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Default Tiebreakers Format *</OptionTitle>
              <RadioGroupContainer
                onChange={(e: RadioChangeEvent) => setFieldValue(`${namePrefix}.tiebreakersFormat`, e.target.value)}
                value={subdivision.tiebreakersFormat}
              >
                <Radio value="Winning %">
                  <RadioGroupLabelTooltip>
                    <RadioGroupLabel>Winning %</RadioGroupLabel>

                    <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP} width="320px">
                      <ReactSVG src={InfoCircleIcon} />
                    </MonroeTooltip>
                  </RadioGroupLabelTooltip>
                </Radio>
                <Radio value="Points">
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
