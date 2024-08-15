import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex, Radio } from 'antd'
import Typography from 'antd/es/typography'
import { FieldArray, FormikErrors } from 'formik'
import { CSSProperties, ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP,
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips'
import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData'
import { AddBracketButton } from '@/pages/Protected/Seasons/components/Elements'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  ICreateSeasonSubdivision,
} from '@/pages/Protected/Seasons/constants/formik'

import { OptionTitle, RadioGroupContainer, RadioGroupLabel, RadioGroupLabelTooltip } from '@/components/Elements'
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

interface ICreateSubdivisionProps {
  subdivision: ICreateSeasonSubdivision
  onChange: ChangeEventHandler
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
}

const getContainerStyles = (isError: boolean): CSSProperties => ({
  padding: '8px 16px',
  backgroundColor: 'white',
  borderRadius: '3px',
  border: '1px solid #D8D7DB',
  borderColor: isError ? '#BC261B' : '#D8D7DB',
  marginTop: '8px',
})

const getTitleStyles = (isError: boolean): CSSProperties => ({
  color: isError ? '#BC261B' : '#1A1657',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: 0,
  cursor: 'pointer',
})

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
}) => {
  const { setBracketIdx, setBracketMode } = useSeasonSlice()
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { isComponentVisible, ref } = useIsActiveComponent(index === 0 ? true : false)
  const subdivisionError = (errors?.divisions?.[divisionIndex] as FormikErrors<IFEDivision>)?.subdivisions?.[index]
  const isBlockAddBracketButton = !!(subdivisionError as FormikErrors<IFESubdivision>)?.name
  const { setIsCreateBracketPage, setPathToSubdivisionDataAndIndexes } = useSeasonSlice()
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
  const isError = !!subdivisionError || !!notUniqueNameErrorText
  const lastBracketIdx = subdivision.brackets?.length ? subdivision.brackets.length : 0
  const [isShowModal, setIsShowModal] = useState(false)

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  const handleSubdivisionNameChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        subdiv.brackets.find((bracket) =>
          bracket.matches.find((match) =>
            match.participants.find((p) => p.subpoolName === subdivision.name && subdiv.name !== subdivision.name),
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
    <div
      ref={ref}
      style={{
        ...getContainerStyles(isError),
      }}
    >
      {isShowModal && (
        <MonroeModal
          okText="Confirm"
          onOk={() => setIsShowModal(false)}
          onCancel={() => setIsShowModal(false)}
          type="warn"
          title="Forbidden action"
          content={<p>You can't delete this subdivision because it used on brackets</p>}
        />
      )}

      {!isOpenedDetails && (
        <Flex justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)}>
          <Flex vertical>
            <Typography.Title level={4} style={getTitleStyles(isError)}>
              {isError ? 'Missing mandatory data' : subdivision.name || 'subdivision/subpool name'}
            </Typography.Title>
          </Flex>

          {isMultipleSubdivisions && (
            <div onClick={handleDelete}>
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical>
          <div style={{ marginBottom: '8px' }}>
            <MonroeInput
              label={<OptionTitle>Subdivision/subpool Name *</OptionTitle>}
              name={`${namePrefix}.name`}
              value={subdivision.name}
              onChange={handleSubdivisionNameChange}
              placeholder="Enter name"
              style={{ width: '100%', height: '32px' }}
              error={notUniqueNameErrorText}
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
                onChange={(e) => setFieldValue(`${namePrefix}.playoffFormat`, e.target.value)}
                value={subdivision.playoffFormat}
              >
                <Radio value="Best Record Wins">Best Record Wins</Radio>
                <Radio value="Single Elimination Bracket">Single Elimination Bracket</Radio>
              </RadioGroupContainer>

              <FieldArray name={`divisions[${divisionIndex}.subdivisions[${index}.brackets]]`}>
                {(innerArrayHelpers) => {
                  return (
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
                                  <Typography
                                    style={{
                                      color: 'rgba(26, 22, 87, 1)',
                                      fontWeight: 500,
                                      fontSize: '14px',
                                    }}
                                  >
                                    {bracketData.name}
                                  </Typography>

                                  <Flex>
                                    <div
                                      style={{
                                        marginRight: '4px',
                                      }}
                                    >
                                      <ReactSVG
                                        src={SmallEditIcon}
                                        style={{ width: '14px', height: '14px' }}
                                        onClick={() => {
                                          setIsCreateBracketPage(true)
                                          setPathToSubdivisionDataAndIndexes(`${namePrefix}&${divisionIndex}-${index}`)
                                          setBracketIdx(idx)
                                          setBracketMode('edit')
                                        }}
                                      />
                                    </div>

                                    <ReactSVG
                                      src={SmallDeleteIcon}
                                      style={{ width: '14px', height: '14px' }}
                                      onClick={() => innerArrayHelpers.remove(idx)}
                                    />
                                  </Flex>
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
                            arrowPosition="bottom"
                            containerWidth="134px"
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
                              }}
                            >
                              Add Bracket
                            </AddBracketButton>
                          </MonroeTooltip>
                        </>
                      )}
                    </>
                  )
                }}
              </FieldArray>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Default Standings Format *</OptionTitle>
              <RadioGroupContainer
                onChange={(e) => setFieldValue(`${namePrefix}.standingsFormat`, e.target.value)}
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
                onChange={(e) => setFieldValue(`${namePrefix}.tiebreakersFormat`, e.target.value)}
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
    </div>
  )
}

export default CreateSubdivision
