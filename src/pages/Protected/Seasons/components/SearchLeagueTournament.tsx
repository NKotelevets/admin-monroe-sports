// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styled from '@emotion/styled'
import { Flex } from 'antd'
import { RefObject, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { SearchSelectIconWrapper } from '@/components/Elements'
import { Subtext } from '@/components/Elements/entity'

import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IFELeague } from '@/common/interfaces/league'

import ShowAllIcon from '@/assets/icons/show-all.svg'
import { useFormikContext } from 'formik'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import TextInput from '@/components/Inputs/TextInput.tsx'

const DEFAULT_LIMIT_RECORDS = 20

const SearchLeagueTournament = () => {

  const {
    values,
    setFieldValue,
    errors,
    handleChange,
    handleBlur
  } = useFormikContext<ICreateSeasonFormValues>()

  // (data) => {
  //   setFieldValue('league', data.id)
  //   setTouched({ ...touched, league: true })
  //
  //   const updatedSubdivisions = values.divisions.map((division) => ({
  //     name: division.name,
  //     description: division.description,
  //     subdivisions: division.subdivisions.map((subdivision) => ({
  //       name: subdivision.name,
  //       description: subdivision.description,
  //       playoffFormat: data.playoffFormat,
  //       standingsFormat: data.standingsFormat,
  //       tiebreakersFormat: data.tiebreakersFormat,
  //     })),
  //   }))
  //
  //   setFieldValue('divisions', updatedSubdivisions)
  // }

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
        league_name: values.league,
        order_by: null
      }).unwrap()

      if (response?.leagues) setLeaguesList((prev) => [...prev, ...response.leagues])
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  useEffect(() => {
    const makeRequest = async () => {
      const response = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        order_by: null
      }).unwrap()

      setLeaguesList(response.leagues || [])
    }

    makeRequest()
  }, [])


  useDebounceEffect(async () => {
    const res = await getLeagues({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      league_name: values.league === values.league ? '' : values.league,
      order_by: null
    }).unwrap()

    setLeaguesList(res?.leagues || [])
  }, [values.league])


  return (
    <Flex vertical className="w-full">
      <div ref={ref} className="w-full">
        <Container>
          <TextInput
            name="league"
            onChange={handleChange}
            value={values.league}
            placeholder="Find league or tournament"
            className="h-32"
            error={errors.league}
            onBlur={handleBlur}
          />

          <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
            <ReactSVG src={ShowAllIcon} />
          </SearchSelectIconWrapper>
        </Container>

        {isComponentVisible && (
          <Container className="ph-5-v-12">
            {leaguesList.length ? (
              <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
                {leaguesList.map((league) => (
                  <ListItem
                    key={league.id}
                    onClick={() => {
                      setFieldValue('league', league.id)
                      onClose()
                    }}
                  >
                    {league.name}
                  </ListItem>
                ))}
              </List>
            ) : (
              <List as="div" className="ph-5-v-12">
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

// Styled Components
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
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding-right: 4px;
  z-index: 20;
  overflow: scroll;
`
const Container = styled.div`
  position: relative;
`
