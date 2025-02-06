import { SeasonSelect } from '@/components/Inputs/SeasonSelect.tsx'
import { useFormikContext } from 'formik'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useEffect, useMemo, useState } from 'react'
import { IFEBracket, IFEDivision } from '@/common/interfaces/division.ts'
import { LeagueSelect } from '@/components/Inputs/LeagueSelect'
import { IFELeague } from '@/common/interfaces/league.ts'
import Select from '@/components/Inputs/Select.tsx'
import { IFESeason } from '@/common/interfaces/season.ts'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { IMatch } from '@/common/interfaces/bracket.ts'

export const PlayoffAdditionalFields = () => {
  const { setDivisionsAvailable } = useEventFormContext()
  const {
    values,
    errors,
    touched,
    setFieldTouched,
    handleChange,
    setFieldValue
  } = useFormikContext<IEventForm>()

  const [currentLeague, setCurrentLeague] = useState<IFELeague | undefined>(undefined)
  const [divisionList, setDivisionList] = useState<IFEDivision[]>([])
  const [bracketList, setBracketList] = useState<IFEBracket[]>([])
  const [matchList, setMatchList] = useState<IMatch[]>([])

  useEffect(() => {
    if(!values.division || !divisionList.length) return

    const find = divisionList.find(div => div.id === values.division)
    if (!find) return

    setBracketList(find.brackets)
  }, [divisionList, values.division])

  useEffect(() => {
    if(!values.bracket || !bracketList.length) return

    const find = bracketList.find(bracket => bracket.id === values.bracket)
    if (!find) return

    setMatchList(find.matches)
  }, [bracketList, values.bracket])

  const seasonOptions = useMemo(() => (
    (currentLeague?.seasons as IFESeason[])
      ?.map(season => ({ label: season.name, value: season.id }))
  ), [currentLeague?.seasons])

  const divisionOptions = useMemo(() => (
    divisionList?.filter(div => div.playoffFormat !== 0)
      ?.map(div => ({ label: div.name, value: div.id }))
  ), [divisionList])

  const resetFields = (fields: (keyof IEventForm)[]) => {
    fields.forEach(field => {
      setFieldValue(field, undefined)
      setFieldTouched(field, false)
    })
  }

  const getLeague = (league: IFELeague) => {
    setCurrentLeague(league)
  }

  const getDivision = (divs: IFEDivision[]) => {
    setDivisionList(divs)
    setDivisionsAvailable(divs)
  }

  const onLeagueChange = (value: string) => {
    setFieldValue('league', value)
    resetFields(['season', 'division', 'bracket', 'game'])
  }

  const onSeasonChange = (value: string) => {
    setFieldValue('season', value)
    resetFields(['division', 'bracket', 'game'])
  }

  const onDivisionChange = (value: string) => {
    setFieldValue('division', value)
    resetFields(['bracket', 'game'])
  }
    const onBracketChange = (value: string) => {
    setFieldValue('bracket', value)
    resetFields(['game'])
  }


  return (
    <>
      <LeagueSelect
        label="Legue/Tourn name *"
        placeholder="Select league"
        value={values.league}
        onChange={onLeagueChange}
        error={touched.league ? errors.league : undefined}
        onBlur={() => setFieldTouched('league')}
        getLeague={getLeague}
      />
      <SeasonSelect
        label="Season *"
        disabled={!currentLeague}
        value={values.season}
        options={seasonOptions}
        onChange={onSeasonChange}
        error={touched.season ? errors.season : undefined}
        placeholder="Select season"
        onBlur={() => setFieldTouched('season')}
        getDivisions={getDivision}
      />
      <Select
        label="Division Name *"
        disabled={!values.season}
        value={values.division}
        options={divisionOptions}
        onChange={onDivisionChange}
        error={touched.division ? errors.division : undefined}
        onBlur={() => setFieldTouched('division')}
        placeholder="Select division"
      />
      <Select
        label="Bracket *"
        disabled={!values.division}
        value={values.bracket}
        options={bracketList?.map(bracket => ({ label: bracket.name, value: bracket.id }))}
        onChange={onBracketChange}
        error={touched.bracket ? errors.bracket : undefined}
        onBlur={() => setFieldTouched('bracket')}
        placeholder="Select bracket"
      />
      <Select
        label="Game number *"
        disabled={!values.bracket}
        value={values.game}
        options={matchList?.map(match => {
          return ({ label: `Game ${match.gameNumber} (${match.stage})`, value: match.id })
        })}
        onChange={handleChange('game')}
        error={touched.game ? errors.game : undefined}
        onBlur={() => setFieldTouched('game')}
        placeholder="Select game"
      />
    </>
  )
}
