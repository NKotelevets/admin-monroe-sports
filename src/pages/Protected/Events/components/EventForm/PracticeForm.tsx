import { AccordionForm, TAccordionFormProps } from '@/components/AccordionForm'
import TextInput from '@/components/Inputs/TextInput'
import { useFormikContext } from 'formik'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import Select from '@/components/Inputs/Select.tsx'
import { useMasterTeamPaginated } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamPaginated.ts'
import { VS } from '@/pages/Protected/Events/components/VS.tsx'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { useLazyGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'

type TFieldNames = 'team1Id' | 'team2Id'

export const PracticeForm = () => {
  const [secondTeam, setSecondTeam] = useState(false)
  const { values, errors } = useFormikContext<IEventForm>()

  const team2 = secondTeam || !!values.team2Id
  const team = (key: string, fieldName: TFieldNames, label: string): TAccordionFormProps['items'] => (
    [{
      key,
      label,
      children: <MasterTeamSelect fieldName={fieldName} />,
      title: values[fieldName === 'team1Id' ? 'team1Name' : 'team2Name'] || label,
      subtitle: values[fieldName === 'team1Id' ? 'coach1Name' : 'coach2Name'],
      error: errors[fieldName]
    }]
  )

  return (
    <>
      <AccordionForm items={team('0', 'team1Id', 'Team 1')} />
      {team2 && (
        <>
          <VS />
          <AccordionForm items={team('0', 'team2Id', 'Team 2')} />
        </>
      )}

      {!team2 && <Button onClick={() => setSecondTeam(true)}>Add Team</Button>}
    </>
  )
}

const MasterTeamSelect = (props: { fieldName: 'team1Id' | 'team2Id' }) => {
  const { fieldName } = props
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<IEventForm>()
  const { masterTeamItems, loadMore, isLoading, isFetching } = useMasterTeamPaginated()
  const { setAddingMasterTeam, setTargetField } = useEventFormContext()

  const [getMasterTeam] = useLazyGetMasterTeamQuery()

  const [currentMT, setCurrentMT] = useState<IFEMasterTeam | undefined>(undefined)
  const isTeam1 = fieldName === 'team1Id'
  const teamNameFiled = isTeam1 ? 'team1Name' : 'team2Name'
  const coachNameFiled = isTeam1 ? 'coach1Name' : 'coach2Name'

  useEffect(() => {
    if (!currentMT) return

    setFieldValue(teamNameFiled, currentMT.name)
    setFieldValue(coachNameFiled, currentMT.headCoachFullName)
  }, [currentMT])

  useEffect(() => {
    if (!values[fieldName]) return
    const mt = masterTeamItems.find(mt => mt.id === values[fieldName] as string)

    if (!mt) {
      getMasterTeam({id: values[fieldName]})
      return
    }

    setCurrentMT(mt)
  }, [masterTeamItems, values[fieldName], fieldName])

  return (
    <>
      <Select
        label="Team Name *"
        onLoadMore={loadMore}
        placeholder="Select team"
        buttonText="Add master team"
        loading={isLoading || isFetching}
        value={values[fieldName]}
        buttonAction={() => {
          setAddingMasterTeam(true)
          setTargetField(fieldName)
        }}
        options={masterTeamItems?.map(mt => ({ label: mt.name, value: mt.id })) || []}
        onChange={(value) => setFieldValue(fieldName, value)}
        error={touched[fieldName] ? errors[fieldName] : undefined}
        onBlur={() => setFieldTouched(fieldName)}
        errorPosition="bottom"
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
