import { IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IFELeague } from '@/common/interfaces/league.ts'
import { ReactElement, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_LEAGUE_PAGE } from '@/common/constants/paths.ts'
import { Flex } from 'antd'
import { MonroeLightBlueText, ViewText, ViewTextInfo } from '@/components/Elements'
import styled from '@emotion/styled'

interface ILinkedLeagueListProps {
  leagues: IFELeague[]
  divisions: IFEDivision[]
  subdivisions: IFESubdivision[]
}

/**
 * LinkedLeagueList component displays a list of leagues associated with a master team.
 * Each league can be navigated to, and it also shows the relevant division and subdivision names.
 *
 * @component
 * @param {ILinkedLeagueListProps} props - Properties for the component.
 * @returns {ReactElement} A component that renders linked leagues with division and subdivision details.
 */
export const LinkedLeagueList = (props: ILinkedLeagueListProps): ReactElement => {
  const { leagues, divisions, subdivisions } = props
  const navigate = useNavigate()

  const goToLeague = (id: string) => navigate(`${PATH_TO_LEAGUE_PAGE}/${id}`)

  /**
   * Renders the list of leagues, each with its division and subdivision names if available.
   *
   * @function
   * @returns {ReactElement[]} An array components, each displaying a league name with division and subdivision info.
   */
  const renderLeagues = useCallback(() => (
    leagues.map((league, index) => {
      const divisionName = divisions[index]?.name
      const subdivisionName = subdivisions[index]?.name ? `, ${subdivisions[index]?.name}` : undefined

      return (
        <Flex vertical key={league.id}>
          <MonroeLightBlueText className="c-p" onClick={() => goToLeague(league.id)}>
            {league.name}
          </MonroeLightBlueText>

          <SubText>
            {divisionName} {subdivisionName}
          </SubText>
        </Flex>
      )
    })
  ), [leagues])

  return (
    <Flex className="mb-16" align="start">
      <ViewText className="w-auto">Linked league/tourn:</ViewText>

      <Flex vertical>
        {renderLeagues()}
      </Flex>
    </Flex>
  )
}


const SubText = styled(ViewTextInfo)`
    width: auto;
    margin-top: 0;
    margin-bottom: 12px
`
