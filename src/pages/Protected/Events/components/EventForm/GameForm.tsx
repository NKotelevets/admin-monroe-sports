import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import { VS } from '@/pages/Protected/Events/components/VS.tsx'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { useLeagueTeamPaginated } from '@/pages/Protected/LeagueTeams/hooks/useLeagueTeamPaginated.ts'

import { AccordionForm, TAccordionFormProps } from '@/components/AccordionForm'
import Select from '@/components/Inputs/Select.tsx'
import TextInput from '@/components/Inputs/TextInput'

import { useLazyGetLeagueTeamQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'

import { IEventForm } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

type TFieldNames = 'team1Id' | 'team2Id'
type TX = TAccordionFormProps['items'] & {
  season?: string
}

/**
 * GameForm component is a functional component designed to handle the
 * form for configuring game details such as selecting teams.
 *
 * It utilizes the `useFormikContext` hook to manage form values and errors,
 * and dynamically renders components for team selection and error handling.
 *
 * The component generates a form layout that includes:
 * - An accordion form with team selection for two teams.
 * - A separator component (`VS`) between the two team selection sections.
 *
 * The `team` function dynamically generates team-related form fields and components.
 */
export const GameForm = () => {
  const { values, errors } = useFormikContext<IEventForm>()

  /**
   * Generates a configuration object for a team selection component.
   *
   * @param {string} key - A unique identifier for the team.
   * @param {TFieldNames} fieldName - The name of the field representing the team.
   * @param {string} label - The label to display for the team.
   * @returns {TX} An object containing various properties for rendering the team selection component,
   * including the key, label, children, title, subtitle, and error.
   */
  const team = (key: string, fieldName: TFieldNames, label: string): TX => [
    {
      key,
      label,
      children: <LeagueTeamSelect fieldName={fieldName} />,
      title: values[fieldName === 'team1Id' ? 'team1Name' : 'team2Name'] || label,
      subtitle: values[fieldName === 'team1Id' ? 'coach1Name' : 'coach2Name'],
      error: errors[fieldName],
    },
  ]

  return (
    <>
      <AccordionForm items={team('0', 'team1Id', 'Team 1')} />
      <VS />
      <AccordionForm items={team('0', 'team2Id', 'Team 2')} />
    </>
  )
}

/**
 * LeagueTeamSelect is a functional React component that is part of a form for selecting league teams.
 * It dynamically handles form field values for league teams based on the specified fieldName prop.
 *
 * Props:
 * - `fieldName`: A string that specifies the field name being managed by this component.
 *                It can be either 'team1Id' or 'team2Id', which determines if the component
 *                handles the first or second team-related fields in the form.
 */
const LeagueTeamSelect = (props: { fieldName: 'team1Id' | 'team2Id' }) => {
  const { fieldName } = props
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<IEventForm>()

  const isTeam1 = fieldName === 'team1Id'
  const isDisabled = !isTeam1 && !values.season
  const params = {
    seasonId: !isTeam1 ? values.season : undefined,
  }
  const { setAddingLeagueTeam, setTargetField } = useEventFormContext()
  const { leagueTeamItems, loadMore, isLoading, isFetching, addItem } = useLeagueTeamPaginated(params)

  const [getLeagueTeam, { data: leagueTeamAdded, isLoading: isLoadingSingle }] = useLazyGetLeagueTeamQuery()
  const [currentLT, setCurrentLT] = useState<IFELeagueTeam | undefined>(undefined)

  const teamNameFiled = isTeam1 ? 'team1Name' : 'team2Name'
  const coachNameFiled = isTeam1 ? 'coach1Name' : 'coach2Name'
  const seasonNameFiled = isTeam1 ? 'season1Name' : 'season2Name'
  const leagueNameFiled = isTeam1 ? 'league1Name' : 'league2Name'

  /**
   * Updates form field values based on the current league team (currentLT) and conditions.
   * @callback
   */
  useEffect(
  () => {
    if (!currentLT) return

    if (isTeam1 && values.team1Id !== currentLT.id) {
      setFieldValue('team2Id', undefined)
      setFieldValue('team2Name', undefined)
      setFieldValue('coach2Name', undefined)
      setFieldValue('season2Name', undefined)
      setFieldValue('league2Name', undefined)
    }

    setFieldValue('league', currentLT.league?.id)
    setFieldValue('season', currentLT.season?.id)
    setFieldValue(teamNameFiled, currentLT.name)
    setFieldValue(seasonNameFiled, currentLT.season?.name)
    setFieldValue(leagueNameFiled, currentLT.league?.name)
    setFieldValue(coachNameFiled, `${currentLT.headCoach?.firstName} ${currentLT.headCoach?.lastName}`)
  }, [currentLT, isTeam1])

  /**
   * Handles the addition and setting of a league team based on the provided field value.
   */
  useEffect(() => {
    if (!values[fieldName] || isLoadingSingle) return
    const mt = leagueTeamItems.find((mt) => mt.id === (values[fieldName] as string))

    if (!mt && leagueTeamAdded === undefined) {
      getLeagueTeam({ id: values[fieldName] as string })
      return
    }

    if (!mt && leagueTeamAdded) {
      addItem({
        ...leagueTeamAdded,
        id: values[fieldName],
      } as unknown as IFELeagueTeam)
    }

    setCurrentLT(mt)
  }, [leagueTeamItems, values[fieldName], fieldName, leagueTeamAdded, isLoadingSingle])

  /**
   * Memoized list of team options formatted as label-value pairs based on league team data.
   * Filters out either team1Id or team2Id from the list depending on the isTeam1 flag.
   * @constant {Array<{label: string, value: string | number}>} teamOptions
   */
  const teamOptions = useMemo(() => {
    const list = leagueTeamItems?.map((mt) => ({ label: mt.name, value: mt.id }))

    if (!isTeam1) {
      return list.filter((lt) => lt.value !== values['team1Id'])
    }

    return list.filter((lt) => lt.value !== values['team2Id'])
  }, [leagueTeamItems, values['team1Id'], values['team2Id'], isTeam1])

  return (
    <>
      <Select
        label="Team Name *"
        disabled={isDisabled}
        onLoadMore={loadMore}
        placeholder="Select team"
        buttonText="Add League Team"
        loading={isLoading || isFetching}
        value={values[fieldName]}
        buttonAction={() => {
          setAddingLeagueTeam(true)
          setTargetField(fieldName)
        }}
        options={[...teamOptions] || []}
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
