import { AccordionForm, TAccordionFormProps } from '@/components/AccordionForm'
import TextInput from '@/components/Inputs/TextInput'
import { useFormikContext } from 'formik'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useEffect, useState } from 'react'
import Select from '@/components/Inputs/Select.tsx'
import { VS } from '@/pages/Protected/Events/components/VS.tsx'
import { useLazyGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useLeagueTeamPaginated } from '@/pages/Protected/LeagueTeams/hooks/useLeagueTeamPaginated.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

type TFieldNames = 'leagueTeam1Id' | 'leagueTeam2Id'
type TX = TAccordionFormProps['items'] & {
  season?: string
}

export const GameForm = () => {
  const { values, errors } = useFormikContext<IEventForm>()

  const team = (key: string, fieldName: TFieldNames, label: string): TX => (
    [{
      key,
      label,
      children: <LeagueTeamSelect fieldName={fieldName} />,
      title: values[fieldName === 'leagueTeam1Id' ? 'team1Name' : 'team2Name'] || label,
      subtitle: values[fieldName === 'leagueTeam1Id' ? 'coach1Name' : 'coach2Name'],
      error: errors[fieldName]
    }]
  )

  return (
    <>
      <AccordionForm
        items={team('0', 'leagueTeam1Id', 'Team 1')}
      />
      <VS />
      <AccordionForm
        items={team('1', 'leagueTeam2Id', 'Team 2')}
      />
    </>
  )
}

const LeagueTeamSelect = (props: { fieldName: 'leagueTeam1Id' | 'leagueTeam2Id' }) => {
  const { fieldName } = props
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<IEventForm>()

  const isTeam1 = fieldName === 'leagueTeam1Id'
  const isDisabled = !isTeam1 && !values.season
  const params = {
    seasonId: !isTeam1 ? values.season : undefined,
  }

  const { leagueTeamItems, loadMore, isLoading, isFetching } = useLeagueTeamPaginated(params)

  const [getMasterTeam] = useLazyGetMasterTeamQuery()
  const [currentLT, setCurrentLT] = useState<IFELeagueTeam | undefined>(undefined)

  const teamNameFiled = isTeam1 ? 'team1Name' : 'team2Name'
  const coachNameFiled = isTeam1 ? 'coach1Name' : 'coach2Name'
  const seasonNameFiled = isTeam1 ? 'season1Name' : 'season2Name'
  const leagueNameFiled = isTeam1 ? 'league1Name' : 'league2Name'

  // TODO: TEAMS MUST BE ON SAME LEAGUE
  useEffect(() => {
    if (!currentLT) return

    setFieldValue('league', currentLT.league?.id)
    setFieldValue('season', currentLT.season?.id)
    setFieldValue(teamNameFiled, currentLT.name)
    setFieldValue(seasonNameFiled, currentLT.season?.name)
    setFieldValue(leagueNameFiled, currentLT.league?.name)
    setFieldValue(coachNameFiled, `${currentLT.headCoach?.firstName} ${currentLT.headCoach?.lastName}`)
  }, [currentLT])

  useEffect(() => {
    if (!values[fieldName]) return
    const mt = leagueTeamItems.find(mt => mt.id === values[fieldName] as string)

    if (!mt) {
      getMasterTeam({ id: values[fieldName] })
      return
    }

    setCurrentLT(mt)
  }, [leagueTeamItems, values[fieldName], fieldName])

  return (
    <>
      <Select
        label="Team Name *"
        disabled={isDisabled}
        onLoadMore={loadMore}
        placeholder="Select team"
        buttonText="Add master team"
        loading={isLoading || isFetching}
        value={values[fieldName]}
        buttonAction={() => setFieldValue('isAddingMasterTeam', true)}
        options={leagueTeamItems?.map(mt => ({ label: mt.name, value: mt.id })) || []}
        onChange={(value) => setFieldValue(fieldName, value)}
        error={touched[fieldName] ? errors[fieldName] : undefined}
        onBlur={() => setFieldTouched(fieldName)}
        errorPosition="bottom"
      />
      <TextInput
        label="Season *"
        disabled
        name={seasonNameFiled}
        value={(isTeam1 ? values.season1Name : values.season2Name) || ''}
      />
      <TextInput
        label="League Name *"
        disabled
        name={leagueNameFiled}
        value={(isTeam1 ? values.league1Name : values.league2Name) || ''}
      />
      <TextInput
        label="Head Coach *"
        disabled
        name={coachNameFiled}
        value={(isTeam1 ? values.coach1Name : values.coach2Name) || ''}
      />
    </>
  )
}
