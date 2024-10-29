import { useCallback, useMemo } from 'react'
import PopulateEntity, { IPopulateRoleProps } from '@/pages/Protected/MasterTeams/components/PopulateEntity.tsx'
import {  FormikErrors, useFormikContext } from 'formik'
import { IMasterTeamRole, IPopulateMasterTeam } from '@/pages/Protected/MasterTeams/formik.ts'
import { Accordion, AccordionHeader } from '@/components/Elements'
import { ReactSVG } from 'react-svg'
import ShowAllIcon from '@/assets/icons/show-all.svg'


type Props = {
  label: (idx: number) => string,
  removeFn: (idx: number) => void,
  entityName: IPopulateRoleProps['entityName']
}


// Component that displays both types of collapsible items (coaches and administrators)
export const EntityList = (
  props: Props
) => {
  const {
    label,
    removeFn,
    entityName,
  } = props
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<IPopulateMasterTeam>()

  const coachesCollapsedItems = useMemo(() => {
    return values[entityName].map((item: IMasterTeamRole, idx: number) => ({
      key: idx,
      children: (
        <PopulateEntity
          index={idx}
          entity={item}
          removeFn={removeFn}
          errors={errors[entityName] as FormikErrors<IMasterTeamRole>[]}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          entityName={entityName}
          touched={touched}
          totalNumberOfItems={values[entityName].length}
        />
      ),
      label: <AccordionHeader>{label(idx)}</AccordionHeader>
    }))
  }, [values[entityName], errors[entityName], entityName, touched, setFieldValue, setFieldTouched])


  const ExpandIcon = useCallback(() => <ReactSVG src={ShowAllIcon} />, [])

  return (
    <Accordion
      items={coachesCollapsedItems}
      expandIconPosition="end"
      defaultActiveKey={[0]}
      expandIcon={ExpandIcon}
      accordion
    />
  )
}

export default EntityList
