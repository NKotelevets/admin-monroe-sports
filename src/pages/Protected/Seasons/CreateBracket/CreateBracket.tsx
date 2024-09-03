import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import { FormikErrors } from 'formik'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Match from '@/pages/Protected/Seasons/CreateBracket/components/Match'
import WinnerBox from '@/pages/Protected/Seasons/CreateBracket/components/WinnerBox'
import { BRACKETS_OPTIONS, BRACKET_STYLES } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData'
import { bracketTheme } from '@/pages/Protected/Seasons/CreateBracket/utils/bracketTheme'
import { ICreateSeasonFormValues, bracketSchema } from '@/pages/Protected/Seasons/constants/formik'

import {
  BracketWrapper,
  CancelButton,
  MainContainer,
  MonroeDivider,
  OptionTitle,
  ProtectedPageSubtitle,
} from '@/components/Elements'
import { InputError } from '@/components/Inputs/InputElements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeMultipleSelect from '@/components/MonroeMultipleSelect'
import CustomSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { PATH_TO_EDIT_SEASON } from '@/constants/paths'
import { PLAYOFFS_TEAMS_OPTIONS } from '@/constants/playoffsTeamsOptions'

import { TBracketKeys } from '@/common/types/bracket'

interface ICreateBracket {
  values: ICreateSeasonFormValues
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ICreateSeasonFormValues>>
}

const CreateBracket: FC<ICreateBracket> = ({ values, setFieldValue }) => {
  const { setIsCreateBracketPage, pathToSubdivisionDataAndIndexes, bracketIdx, bracketMode } = useSeasonSlice()
  const [teamsOptions, setTeamsOptions] = useState<DefaultOptionType[]>([])
  const [selectedSubpools, setSelectedSubpools] = useState<DefaultOptionType[]>([])
  const [namePrefix, indexes] = pathToSubdivisionDataAndIndexes.split('&')
  const [divisionIndex, subdivisionIndex] = indexes.split('-')
  const subdivisionValues = values.divisions[+divisionIndex].subdivisions[+subdivisionIndex]
  const location = useLocation()
  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)
  const buttonLabel = !isEditPage ? (bracketMode === 'create' ? 'Create Bracket' : 'Save') : 'Save'
  const subdivisionsInSeason: DefaultOptionType[] = values.divisions?.[+divisionIndex].subdivisions.flatMap(
    (subdivision) => ({
      label: subdivision.name,
      value: subdivision.name,
    }),
  )
  const filteredSubdivisionsInSeason = subdivisionsInSeason.filter((s) => !!s?.label)
  const [newBracketData, setNewBracketData] = useState(subdivisionValues.brackets?.[bracketIdx])
  const [isEnabledButton, setIsEnabledButton] = useState(true)
  const screenWidth = window.innerWidth
  const [isLargeScreen, setIsLargeScreen] = useState(screenWidth >= 1660)

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
    const arrayOfNumbers = Array.from({ length: newBracketData?.playoffTeams }, (_, index) => ({
      label: index + 1,
      value: index + 1,
    }))

    setTeamsOptions(arrayOfNumbers)
  }

  useEffect(() => {
    if (newBracketData?.subdivisionsNames?.length) {
      const subpoolOptions = newBracketData?.subdivisionsNames.map((subpool) => ({
        label: subpool,
        value: subpool,
      }))
      const filteredOptions = subpoolOptions.filter((s) => s.label)
      setSelectedSubpools(filteredOptions)
    }

    calculateTeamsOptions()

    if (!newBracketData) setIsCreateBracketPage(false)
  }, [newBracketData?.playoffTeams])

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () =>
      await bracketSchema
        .validate(newBracketData)
        .then(() => setIsEnabledButton(false))
        .catch(() => setIsEnabledButton(true)))()
  }, [newBracketData])

  if (!newBracketData) return <></>

  return (
    <div>
      <Flex style={{ padding: 0 }}>
        <div style={{ flex: '0 0 40%' }}>
          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
        </div>

        <Flex vertical justify="flex-start">
          <div style={{ marginBottom: '8px' }}>
            <MonroeInput
              name={`${namePrefix}.brackets.${bracketIdx}.name`}
              value={newBracketData.name}
              onChange={(event) => setNewBracketData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Enter bracket name"
              style={{ height: '32px' }}
              label={<OptionTitle>Bracket Name *</OptionTitle>}
              error={newBracketData.name.length ? '' : 'Bracket Name is required'}
            />
          </div>

          <MainContainer vertical style={{ marginBottom: '8px' }}>
            <Flex align="center" justify="space-between">
              <OptionTitle>Subpools in Bracket *</OptionTitle>

              {newBracketData?.subdivisionsNames.length === 0 && (
                <InputError>Subpools in Bracket is required</InputError>
              )}
            </Flex>
            <MonroeMultipleSelect
              styles={{ width: '100%' }}
              placeholder="Select subpools"
              options={filteredSubdivisionsInSeason}
              name={`${namePrefix}.brackets.${bracketIdx}.subdivisionsNames`}
              value={newBracketData?.subdivisionsNames}
              onChange={(value) => {
                const arrayOfSubpools = value as unknown as string[]
                const options = arrayOfSubpools.map((subpool) => ({
                  label: subpool,
                  value: subpool,
                }))

                const updatedMatches = newBracketData.matches.map((match) => ({
                  ...match,
                  participants: match.participants.map((p) => {
                    if (!arrayOfSubpools.includes(`${p.subpoolName}`)) {
                      return {
                        ...p,
                        subpoolName: '',
                      }
                    }
                    return p
                  }),
                }))

                setNewBracketData((prev) => ({
                  ...prev,
                  subdivisionsNames: arrayOfSubpools,
                  matches: updatedMatches,
                }))
                setSelectedSubpools(options)
              }}
              is_error={`${newBracketData?.subdivisionsNames.length === 0}`}
            />
          </MainContainer>

          <Flex vertical style={{ marginBottom: '8px' }}>
            <OptionTitle># playoffs' teams *</OptionTitle>
            <CustomSelect
              name={`${namePrefix}.brackets.${bracketIdx}.playoffTeams`}
              value={`${newBracketData?.playoffTeams}`}
              options={PLAYOFFS_TEAMS_OPTIONS}
              onChange={(value) => {
                setNewBracketData((prev) => ({
                  ...prev,
                  playoffTeams: +value,
                  matches: BRACKETS_OPTIONS[+value as TBracketKeys],
                }))
                calculateTeamsOptions()
              }}
              styles={{
                width: '100% !important',
              }}
            />
          </Flex>
        </Flex>
      </Flex>

      <MonroeDivider />

      <Flex vertical>
        <Flex vertical style={{ width: '330px', marginBottom: '24px' }}>
          <ProtectedPageSubtitle>Bracket</ProtectedPageSubtitle>
        </Flex>

        <BracketWrapper>
          <SingleEliminationBracket
            theme={bracketTheme}
            matches={newBracketData.matches}
            options={{
              style: {
                ...BRACKET_STYLES,
                width: isLargeScreen ? 400 : 300,
              },
            }}
            matchComponent={(props) => (
              <Match
                setNewBracketData={setNewBracketData}
                matchProps={props}
                brackets={newBracketData.matches}
                options={selectedSubpools}
                teamsOptions={teamsOptions}
              />
            )}
          />

          <WinnerBox />
        </BracketWrapper>
      </Flex>

      <MonroeDivider />

      <Flex style={{ marginTop: '20px' }}>
        <div style={{ flex: '0 0 40%' }} />

        <Flex>
          <CancelButton
            type="default"
            onClick={() => {
              setIsCreateBracketPage(false)

              if (bracketMode === 'create') {
                const brackets = subdivisionValues.brackets.filter((_, idx) => idx !== bracketIdx)
                setFieldValue(`${namePrefix}.brackets`, brackets)
              }
            }}
          >
            Cancel
          </CancelButton>

          <MonroeTooltip width="180px" containerWidth="auto" text={isEnabledButton ? 'Missing mandatory data' : ''}>
            <MonroeButton
              label={buttonLabel}
              type="primary"
              onClick={() => {
                setFieldValue(`${namePrefix}.brackets.${bracketIdx}`, newBracketData)
                setIsCreateBracketPage(false)
              }}
              isDisabled={isEnabledButton}
              style={{ width: '150px' }}
            />
          </MonroeTooltip>
        </Flex>
      </Flex>
    </div>
  )
}

export default CreateBracket
