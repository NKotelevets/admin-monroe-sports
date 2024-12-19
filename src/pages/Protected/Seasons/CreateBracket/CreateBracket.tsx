import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import { FormikErrors, FormikTouched } from 'formik'
import { FC, FocusEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Match from '@/pages/Protected/Seasons/CreateBracket/components/Match'
import WinnerBox from '@/pages/Protected/Seasons/CreateBracket/components/WinnerBox'
import { BRACKET_STYLES, BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData'
import { bracketTheme } from '@/pages/Protected/Seasons/CreateBracket/utils/bracketTheme'
import { bracketSchema, ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik'

import {
  BracketWrapper,
  CancelButton,
  MainContainer,
  MonroeBlueText,
  MonroeDivider,
  OptionTitle,
  ProtectedPageSubtitle
} from '@/components/Elements'
import { InputError } from '@/components/Inputs/InputElements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeMultipleSelect from '@/components/MonroeMultipleSelect'
import CustomSelect from '@/components/MonroeSelect'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { PATH_TO_EDIT_SEASON, PATH_TO_SEASONS } from '@/common/constants/paths'
import { PLAYOFFS_TEAMS_OPTIONS } from '@/common/constants/playoffsTeamsOptions'
import { IBracket } from '@/common/interfaces/bracket'
import { TBracketKeys } from '@/common/types/bracket'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { usePageContext } from '@/layouts/Page/context.ts'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'

interface ICreateBracket {
  values: ICreateSeasonFormValues
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<ICreateSeasonFormValues>>

  touched: FormikTouched<ICreateSeasonFormValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: (e: React.FocusEvent<any>) => void

  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<ICreateSeasonFormValues>>
}

const CreateBracket: FC<ICreateBracket> = ({ values, setFieldValue, handleBlur, touched, setFieldTouched }) => {
  const { setShowBracketPage } = useSeasonFormContext()
  const { setPageTitle, setBreadcrumbs } = usePageContext()

  const {
    setSelectedBracketId,
    pathToSubdivisionDataAndIndexes,
    bracketIdx,
    bracketMode
  } = useSeasonSlice()

  const [teamsOptions, setTeamsOptions] = useState<DefaultOptionType[]>([])
  const [selectedSubPools, setSelectedSubPools] = useState<DefaultOptionType[]>([])

  const [namePrefix, divisionIndex] = pathToSubdivisionDataAndIndexes.split('&')
  const subdivisionValues = values.divisions[+divisionIndex]

  const location = useLocation()
  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)
  const pageTitle = !isEditPage ? (bracketMode === 'create' ? 'Create Bracket' : 'Edit Bracket') : 'Edit Bracket'

  const subdivisionsInSeason: DefaultOptionType[] = values.divisions?.[+divisionIndex].subDivisions.flatMap(
    (subdivision) => ({
      label: subdivision.name,
      value: subdivision.name
    })
  )

  const filteredSubdivisionsInSeason = subdivisionsInSeason.filter((s) => !!s?.label)
  const [isEnabledButton, setIsEnabledButton] = useState(true)
  const [newBracketData, setNewBracketData] = useState<IBracket>(subdivisionValues.brackets?.[bracketIdx] || {} as IBracket)
  const screenWidth = window.innerWidth
  const [isLargeScreen, setIsLargeScreen] = useState(screenWidth >= 1660)
  const bracketTouchedFields = touched?.divisions?.[+divisionIndex]?.brackets?.[+bracketIdx] as FormikTouched<IBracket>

  const onCancel = () => {
    setShowBracketPage(false)

    if (bracketMode === 'create') {
      const brackets = subdivisionValues.brackets.filter((_, idx) => idx !== bracketIdx)
      setFieldValue(`${namePrefix}.brackets`, brackets)
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { title: <a href={PATH_TO_SEASONS}>Seasons</a> },
      {
        title: (
          <a
            onClick={() => {
              onCancel()
              setSelectedBracketId(null)
            }}
          >
            {isEditPage ? `Edit` : `Create`} Season
          </a>
        )
      },
      { title: <MonroeBlueText>{pageTitle}</MonroeBlueText> }
    ])
    setPageTitle(pageTitle)
  }, [pageTitle, isEditPage])

  useEffect(() => {
    const validateSchema = async () =>
      await bracketSchema
        .validate(newBracketData)
        .then(() => setIsEnabledButton(false))
        .catch(() => setIsEnabledButton(true))

    validateSchema()
  }, [newBracketData])

  const handleResize = () => {
    const screenWidth = window.innerWidth
    setIsLargeScreen(screenWidth >= 1660)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const calculateTeamsOptions = () => {
    const arrayOfNumbers = Array.from({ length: newBracketData?.playoffTeams || 0 }, (_, index) => ({
      label: index + 1,
      value: index + 1
    }))

    setTeamsOptions(arrayOfNumbers)
  }

  const handleClick = () => {
    setFieldValue(`${namePrefix}.brackets.${bracketIdx}`, newBracketData)
    setShowBracketPage(false)
  }

  useEffect(() => {
    if (newBracketData?.subdivisionsNames?.length) {
      const subpoolOptions = newBracketData?.subdivisionsNames.map((subpool) => ({
        label: subpool,
        value: subpool
      }))
      const filteredOptions = subpoolOptions.filter((s) => s.label)
      setSelectedSubPools(filteredOptions)
    }

    calculateTeamsOptions()

    if (!newBracketData) setShowBracketPage(false)
  }, [newBracketData?.playoffTeams])

  const handleTouchFiled = (fieldName: string) =>
    setFieldTouched(`${namePrefix}.brackets.${bracketIdx}.matches.${fieldName}`, true)

  if (!newBracketData) return <></>

  return (
    <div>
      <Flex className="p0">
        <div className="f-40">
          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
        </div>

        <Flex vertical justify="flex-start">
          <div className="mg-b8">
            <MonroeInput
              name={`${namePrefix}.brackets.${bracketIdx}.name`}
              value={newBracketData.name}
              onChange={(event) => {
                setNewBracketData((prev) => ({ ...prev, name: event.target.value }))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleBlur(event as FocusEvent<any>)
              }}
              placeholder="Enter bracket name"
              className="h-32"
              label={<OptionTitle>Bracket Name *</OptionTitle>}
              error={bracketTouchedFields?.name ? (!newBracketData.name.length ? 'Bracket Name is required' : '') : ''}
              onBlur={handleBlur}
            />
          </div>

          <MainContainer className="mg-b8" vertical>
            <Flex align="center" justify="space-between">
              <OptionTitle>Subpools in Bracket *</OptionTitle>

              {bracketTouchedFields?.subdivisionsNames && newBracketData?.subdivisionsNames?.length === 0 && (
                <InputError>Subpools in Bracket is required</InputError>
              )}
            </Flex>

            <MonroeMultipleSelect
              className="w-full"
              placeholder="Select subpools"
              options={filteredSubdivisionsInSeason}
              name={`${namePrefix}.brackets.${bracketIdx}.subdivisionsNames`}
              value={newBracketData?.subdivisionsNames}
              onChange={(value) => {
                setFieldTouched(`${namePrefix}.brackets.${bracketIdx}.subdivisionsNames`, true)
                const arrayOfSubpools = value as unknown as string[]
                const options = arrayOfSubpools.map((subpool) => ({
                  label: subpool,
                  value: subpool
                }))

                const updatedMatches = newBracketData.matches.map((match) => ({
                  ...match,
                  matchParticipants: match.matchParticipants.map((p) => {
                    if (!arrayOfSubpools.includes(`${p.subDivision}`)) {
                      return {
                        ...p,
                        subDivision: ''
                      }
                    }
                    return p
                  })
                }))

                setNewBracketData((prev) => ({
                  ...prev,
                  subdivisionsNames: arrayOfSubpools,
                  matches: updatedMatches
                }))
                setSelectedSubPools(options)
              }}
              onBlur={() => {
                setFieldTouched(`${namePrefix}.brackets.${bracketIdx}.subdivisionsNames`, true)
              }}
              is_error={`${bracketTouchedFields?.subdivisionsNames && newBracketData?.subdivisionsNames.length === 0}`}
            />
          </MainContainer>

          <Flex className="mg-b8" vertical>
            <OptionTitle># playoffs' teams *</OptionTitle>
            <CustomSelect
              name={`${namePrefix}.brackets[${bracketIdx}].playoffTeams`}
              value={`${newBracketData?.playoffTeams}`}
              options={PLAYOFFS_TEAMS_OPTIONS}
              onChange={(value) => {
                setNewBracketData((prev) => ({
                  ...prev,
                  playoffTeams: +value,
                  matches: BRACKETS_OPTIONS[+value as TBracketKeys]
                }))
                calculateTeamsOptions()
              }}
              className="w-full"
            />
          </Flex>
        </Flex>
      </Flex>

      <MonroeDivider />

      <Flex vertical>
        <Flex className="mg-b24 w-330" vertical>
          <ProtectedPageSubtitle>Bracket</ProtectedPageSubtitle>
        </Flex>

        <BracketWrapper>
          <SingleEliminationBracket
            theme={bracketTheme}
            matches={newBracketData.matches.map((match, index) => {
              return ({
                ...match,
                index,
                participants: match.matchParticipants?.map((pt, idx) => ({ ...pt, index: idx }))
              })
            })}
            options={{
              style: {
                ...BRACKET_STYLES,
                width: isLargeScreen ? 400 : 300
              }
            }}
            matchComponent={(props) => {
              return (
                <Match
                  setNewBracketData={setNewBracketData}
                  matchProps={props}
                  brackets={newBracketData.matches}
                  options={selectedSubPools}
                  teamsOptions={teamsOptions}
                  handleTouchFiled={handleTouchFiled}
                  matches={bracketTouchedFields?.matches}
                  name={`${namePrefix}.brackets[${bracketIdx}].matches`}
                />
              )
            }}
          />

          <WinnerBox />
        </BracketWrapper>
      </Flex>

      <MonroeDivider />

      <Flex className="mg-t20">
        <div className="f-40" />

        <Flex>
          <CancelButton
            type="default"
            onClick={onCancel}
          >
            Cancel
          </CancelButton>

          <MonroeTooltip width="180px" containerWidth="auto" text={isEnabledButton ? 'Missing mandatory data' : ''}>
            <div className="w-150">
              <MonroeButton
                label={pageTitle}
                type="primary"
                onClick={handleClick}
                isDisabled={isEnabledButton}
                className="h-40"
              />
            </div>
          </MonroeTooltip>
        </Flex>
      </Flex>
    </div>
  )
}

export default CreateBracket
