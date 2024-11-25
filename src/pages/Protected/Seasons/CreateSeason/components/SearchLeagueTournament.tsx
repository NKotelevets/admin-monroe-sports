import { Flex, Typography } from 'antd'
import { FC, RefObject, useEffect, useState } from 'react'

import MonroeInput from '@/components/Inputs/MonroeInput'

import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IFELeague } from '@/common/interfaces/league'

const DEFAULT_LIMIT_RECORDS = 20

interface ISearchLeagueTournamentProps {
  setLeagueTournament: (data: IFELeague) => void
  selectedLeague: IFELeague | null
}

const SearchLeagueTournament: FC<ISearchLeagueTournamentProps> = ({ setLeagueTournament, selectedLeague }) => {
  const [value, setValue] = useState(selectedLeague?.name || '')
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
    getLeagues({
      limit: DEFAULT_LIMIT_RECORDS,
      offset,
      league_name: value,
    })
  }, [])

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const res = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset: 0,
        league_name: value,
      }).unwrap()

      setLeaguesList(res?.leagues || [])
    })()
  }, [value])

  useEffect(() => {
    if (!isComponentVisible && selectedLeague) {
      setValue(selectedLeague.name)
    }
  }, [isComponentVisible])

  return (
    <Flex vertical style={{ width: '100%' }}>
      <div ref={ref} style={{ width: '100%' }}>
        <MonroeInput
          name="search"
          onChange={(event) => setValue(event.target.value)}
          value={value}
          placeholder="Find league or tournament"
          style={{ height: '32px' }}
          inputClasses="league-tourn-search-input"
        />

        {isComponentVisible && (
          <div
            style={{
              position: 'relative',
            }}
          >
            <ul
              ref={scrollRef as unknown as RefObject<HTMLUListElement>}
              onScroll={handleScroll}
              style={{
                position: 'absolute',
                left: 0,
                backgroundColor: 'white',
                height: '240px',
                width: '100%',
                boxShadow:
                  '0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
                paddingRight: '4px',
                zIndex: 20,
                overflow: 'scroll',
              }}
            >
              {leaguesList.length ? (
                leaguesList.map((league) => (
                  <li
                    key={league.id}
                    onClick={() => {
                      setLeagueTournament(league)
                      onClose()
                    }}
                    style={{
                      padding: '5px 12px',
                      color: 'rgba(26, 22, 87, 0.85)',
                      borderBottom: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {league.name}
                  </li>
                ))
              ) : (
                <Typography>There's no match. Try a different name or create a league/tourn first.</Typography>
              )}
            </ul>
          </div>
        )}
      </div>
    </Flex>
  )
}

export default SearchLeagueTournament

