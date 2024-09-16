import styled from '@emotion/styled'
import { Flex } from 'antd'
import { CSSProperties, ChangeEvent, FC, RefObject, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { SearchLeagueInput, SearchLeagueInputIcon } from '@/components/Elements'
import { Subtext } from '@/components/Elements/entity'

import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IFELeague } from '@/common/interfaces/league'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const DEFAULT_LIMIT_RECORDS = 20

const ListItem = styled.li`
  padding: 5px 12px;
  color: rgba(26, 22, 87, 0.85);
  border-bottom: 0;
  cursor: pointer;
`

const List = styled.ul`
  position: absolute;
  left: 0;
  background-color: white;
  height: auto;
  max-height: 240px;
  width: 100%;
  box-shadow:
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding-right: 4px;
  z-index: 20;
  overflow: scroll;
`

const Container = styled.div`
  position: relative;
`

const defaultPadding: CSSProperties = {
  padding: '5px 12px',
}

interface ISearchLeagueTournamentProps {
  setSelectedLeague: (data: IFELeague) => void
  selectedLeague: undefined | string
  isError: boolean
  onBlur: () => void
  setFieldError: (field: string, message: string | undefined) => void
}

const SearchLeagueTournament: FC<ISearchLeagueTournamentProps> = ({
  setSelectedLeague,
  selectedLeague,
  isError,
  onBlur,
  setFieldError,
}) => {
  const [value, setValue] = useState(selectedLeague || '')
  const { isComponentVisible, ref, onClose } = useIsActiveComponent(false)
  const [offset, setOffset] = useState(0)
  const [getLeagues, { data }] = useLazyGetLeaguesQuery()
  const [leaguesList, setLeaguesList] = useState<IFELeague[]>([])

  const getData = async () => {
    if (data && data?.count > leaguesList.length) {
      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)

      const response = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        league_name: value,
      }).unwrap()

      if (response?.leagues) setLeaguesList((prev) => [...prev, ...response.leagues])
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const response = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
      }).unwrap()

      setLeaguesList(response.leagues || [])
    })()
  }, [])

  useEffect(() => {
    if (selectedLeague && !value) setValue(selectedLeague)
  }, [selectedLeague])

  const handleChange = async (leagueName: string) => setValue(leagueName)

  const getDataWithNewName = async () => {
    const res = await getLeagues({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      league_name: value === selectedLeague ? '' : value,
    }).unwrap()

    setLeaguesList(res?.leagues || [])
  }

  useDebounceEffect(getDataWithNewName, [value])

  useEffect(() => {
    if (!isComponentVisible && selectedLeague) setValue(selectedLeague)
  }, [isComponentVisible])

  return (
    <Flex vertical style={{ width: '100%' }}>
      <div ref={ref} style={{ width: '100%' }}>
        <Container>
          <SearchLeagueInput
            name="league"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChange(event.target.value)
              setFieldError('league', '')
            }}
            value={value}
            placeholder="Find league or tournament"
            style={{ height: '32px' }}
            is_error={`${isError}`}
            onBlur={onBlur}
          />

          <SearchLeagueInputIcon isComponentVisible={isComponentVisible}>
            <ReactSVG src={ShowAllIcon} />
          </SearchLeagueInputIcon>
        </Container>

        {isComponentVisible && (
          <Container style={defaultPadding}>
            {leaguesList.length ? (
              <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
                {leaguesList.map((league) => (
                  <ListItem
                    key={league.id}
                    onClick={() => {
                      setSelectedLeague(league)
                      onClose()
                    }}
                  >
                    {league.name}
                  </ListItem>
                ))}
              </List>
            ) : (
              <List as="div" style={defaultPadding}>
                <Subtext>There's no match. Try a different name or create a league/tourn first.</Subtext>
              </List>
            )}
          </Container>
        )}
      </div>
    </Flex>
  )
}

export default SearchLeagueTournament
