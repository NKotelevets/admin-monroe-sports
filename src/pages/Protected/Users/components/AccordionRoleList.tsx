import { useCallback, useMemo } from 'react'
import PopulateRole from '@/pages/Protected/Users/components/PopulateRole.tsx'
import { Accordion, AccordionHeader, AddEntityButton } from '@/components/Elements'
import { FieldArray, useFormikContext } from 'formik'
import { ICreateUserFormValues, INITIAL_ROLE_DATA } from '@/pages/Protected/Users/constants/formik.ts'
import { ReactSVG } from 'react-svg'
import ShowAllIcon from '@/assets/icons/show-all.svg'
import { Flex } from 'antd'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { MASTER_ADMIN_ROLE, OPERATOR_ROLE } from '@/common/constants'

const MAX_CREATED_ROLES_BY_ADMIN = 6
const MAX_CREATED_ROLES_BY_OPERATOR = 4

export const AccordionRoleList = () => {
  const { user } = useUserSlice()
  const {
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    handleChange
  } = useFormikContext<ICreateUserFormValues>()

  const userAdminRoles = useMemo(() => (
    user?.roles.filter((role) => [OPERATOR_ROLE, MASTER_ADMIN_ROLE].includes(role)).length
  ), [user])

  const maximumRoles = useMemo(() => {
    if (user?.isSuperuser) return MAX_CREATED_ROLES_BY_ADMIN
    return userAdminRoles ? MAX_CREATED_ROLES_BY_OPERATOR + userAdminRoles : MAX_CREATED_ROLES_BY_OPERATOR
  }, [userAdminRoles])

  const canAddEntity = useMemo(() => (
    !errors.roles?.length && values.roles.length <= maximumRoles
  ), [maximumRoles, errors, values])

  const tooltipText = useMemo(() => {
    if (canAddEntity) return ''

    return (
      values.roles.length === maximumRoles
        ? `Maximum roles is ${maximumRoles}`
        : `You can't create role when you have errors in other roles`
    )
  }, [canAddEntity, maximumRoles])

  // role items to be rendered by the accordion component
  const collapsedRoleItems = useCallback((removeFn: (index: number) => void) =>
    values.roles.map((role, idx) => ({
      key: idx,
      children: (
        <PopulateRole
          index={idx}
          role={role}
          errors={errors}
          onChange={handleChange}
          setFieldValue={setFieldValue}
          removeFn={removeFn}
          values={values}
          setFieldTouched={setFieldTouched}
        />
      ),
      label: <AccordionHeader>#{idx + 1} Role</AccordionHeader>
    })), [values, errors, setFieldValue, setFieldTouched, handleChange])

  return (
    <FieldArray name="roles">
      {({ push, remove }) => (
        <Flex vertical>
          <Accordion
            items={collapsedRoleItems(remove)}
            expandIconPosition="end"
            expandIcon={() => <ReactSVG src={ShowAllIcon} />}
            accordion
          />
          <MonroeTooltip text={tooltipText} width="220px" containerWidth="113px">
            <AddEntityButton

              disabled={!canAddEntity}
              type="default"
              icon={<PlusOutlined />}
              iconPosition="start"
              onClick={() => push(INITIAL_ROLE_DATA)}
              className="w-auto"
            >
              Add Role
            </AddEntityButton>
          </MonroeTooltip>
        </Flex>
      )}
    </FieldArray>
  )
}
