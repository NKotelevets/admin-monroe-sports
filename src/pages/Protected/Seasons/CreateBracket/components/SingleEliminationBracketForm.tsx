import React, { ReactElement, useEffect, useMemo } from 'react'
import { useFormikContext } from 'formik'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import Flex from 'antd/es/flex'
import { BracketWrapper, ProtectedPageSubtitle } from '@/components/Elements'
import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets'
import { bracketTheme } from '@/pages/Protected/Seasons/CreateBracket/utils/bracketTheme.ts'
import { BRACKET_STYLES } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData.ts'
import Match from '@/pages/Protected/Seasons/CreateBracket/components/Match'
import WinnerBox from '@/pages/Protected/Seasons/CreateBracket/components/WinnerBox.tsx'
import { IBracket } from '@/common/interfaces/bracket.ts'
import styled from '@emotion/styled'
import { useWindowSize } from '@/hooks/useWindowSize.ts'

type TSingleEliminationBracketFormProps = {
  bracketData: IBracket
  setBracketData: React.Dispatch<React.SetStateAction<IBracket>>
}

/**
 * SingleEliminationBracketForm component renders a single-elimination bracket form.
 * It manages dynamic resizing, updates bracket data based on form values,
 * and integrates custom match and winner components.
 *
 * @param {TSingleEliminationBracketFormProps} props - The props for the component.
 * @returns {ReactElement} The rendered SingleEliminationBracketForm component.
 */
export const SingleEliminationBracketForm = (props: TSingleEliminationBracketFormProps): ReactElement => {
  const {
    bracketData,
    setBracketData
  } = props

  const width = useWindowSize()
  const { values } = useFormikContext<ICreateSeasonFormValues>()
  const {
    pathToSubdivisionDataAndIndexes,
    bracketIdx,
  } = useSeasonSlice()

  const [namePrefix, divisionIndex] = pathToSubdivisionDataAndIndexes.split('&')

  /**
   * Update the bracket data whenever the relevant form values change.
   */
  useEffect(() => {
    setBracketData(values.divisions[+divisionIndex].brackets[+bracketIdx])
  }, [values.divisions[+divisionIndex].brackets[+bracketIdx]])

  /**
   * Generate team options based on the number of playoff teams in the bracket data.
   *
   * @returns {Array<{label: number, value: number}>} Array of team option objects.
   */
  const teamOptions = useMemo(() => (
    Array.from({ length: bracketData?.playoffTeams || 0 }, (_, index) => ({
      label: index + 1,
      value: index + 1
    }))
  ), [bracketData?.playoffTeams])

  if (!bracketData?.matches) return <></>

  const matches = bracketData.matches.map((match, index) => {
    return ({
      ...match,
      index,
      primaryId: match.matchIntegerId,
      id: match.id!,
      participants: match.matchParticipants?.map((pt, idx) => ({ ...pt, index: idx, primaryId: idx })) || []
    })
  })

  return (
    <Wrapper vertical>
      <Flex className="mg-b24 w-330" vertical>
        <ProtectedPageSubtitle>Bracket</ProtectedPageSubtitle>
      </Flex>

      <BracketWrapper>
        <SingleEliminationBracket
          theme={bracketTheme}
          matches={matches}
          options={{
            style: {
              ...BRACKET_STYLES,
              width: width >= 1660 ? 400 : 300
            }
          }}
          matchComponent={(props) => {
            return (
              <Match
                setNewBracketData={setBracketData}
                matchProps={props}
                brackets={bracketData.matches}
                options={bracketData.subdivisionsNames.map(subName => ({ value: subName, label: subName }))}
                teamsOptions={teamOptions}
                handleTouchFiled={alert}
                matches={[]}
                name={`${namePrefix}.brackets[${bracketIdx}].matches`}
              />
            )
          }}
        />

        <WinnerBox />
      </BracketWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Flex)`
    margin-top: 40px;
`
